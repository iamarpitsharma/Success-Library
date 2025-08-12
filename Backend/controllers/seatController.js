const Seat = require('../models/Seat');
const Member = require('../models/Member');

// Helper function to check time conflicts using minute-accurate ranges with overnight handling
const checkTimeConflict = (existingShift, existingCustomTimes, newShift, newCustomTimes) => {
  // Convert HH:MM to minutes from midnight
  const toMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return null;
    const [hh, mm] = hhmm.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
  };

  // Build a normalized time range for a shift
  const buildRange = (shift, custom) => {
    const range = getTimeRange(shift, custom?.startTime, custom?.endTime);
    const startMin = toMinutes(range.startTime);
    const endMin = toMinutes(range.endTime);
    return { startMin, endMin };
  };

  // Split a possibly overnight range into non-wrapping segments
  const splitSegments = ({ startMin, endMin }) => {
    if (startMin == null || endMin == null) return [];
    if (endMin > startMin) return [[startMin, endMin]]; // same day
    if (endMin === startMin) return [[0, 0]]; // zero-length; treat as no occupancy
    // overnight (wraps)
    return [
      [startMin, 24 * 60],
      [0, endMin]
    ];
  };

  // Check if any segments overlap
  const segmentsOverlap = (aSegs, bSegs) => {
    for (const [aStart, aEnd] of aSegs) {
      for (const [bStart, bEnd] of bSegs) {
        // Proper interval overlap: allow touching edges (end == start) without conflict
        if (aStart < bEnd && aEnd > bStart) return true;
      }
    }
    return false;
  };

  const existingRange = buildRange(existingShift, existingCustomTimes);
  const newRange = buildRange(newShift, newCustomTimes);

  const existingSegs = splitSegments(existingRange);
  const newSegs = splitSegments(newRange);

  // If we cannot determine times, be conservative and declare conflict
  if (existingSegs.length === 0 || newSegs.length === 0) return true;

  return segmentsOverlap(existingSegs, newSegs);
};

// Helper function to get time range for a shift
const getTimeRange = (shift, customStartTime, customEndTime) => {
  switch (shift) {
    case 'Half Day (8 AM - 2 PM)':
      return { startTime: '08:00', endTime: '14:00' };
    case 'Half Day (2 PM - 8 PM)':
      return { startTime: '14:00', endTime: '20:00' };
    case 'Full Day (8 AM - 8 PM)':
      return { startTime: '08:00', endTime: '20:00' };
    case 'Custom':
      return { startTime: customStartTime, endTime: customEndTime };
    default:
      return { startTime: '08:00', endTime: '20:00' };
  }
};

// Migrate existing seat data to new format
const migrateSeatData = async () => {
  try {
    const seats = await Seat.find();
    let migratedCount = 0;
    
    for (const seat of seats) {
      let needsUpdate = false;
      
      // Ensure members array exists
      if (!seat.members) {
        seat.members = [];
        needsUpdate = true;
      }
      
      // If seat has legacy member data but no members in array, migrate it
      if (seat.isOccupied && seat.memberId && seat.members.length === 0) {
        const legacyMember = {
          memberId: seat.memberId,
          memberName: seat.memberName || 'Unknown',
          memberContact: seat.memberContact || 'Unknown',
          shift: 'Full Day (8 AM - 8 PM)', // Default to full day for legacy data
          customStartTime: null,
          customEndTime: null,
          occupiedDate: seat.occupiedDate || new Date()
        };
        
        seat.members.push(legacyMember);
        needsUpdate = true;
        console.log(`Migrated legacy data for seat ${seat.seatId}`);
      }
      
      // Remove duplicate members based on memberId
      if (seat.members && seat.members.length > 1) {
        const uniqueMembers = [];
        const seenMemberIds = new Set();
        
        for (const member of seat.members) {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          if (!memberIdStr || !seenMemberIds.has(memberIdStr)) {
            uniqueMembers.push(member);
            if (memberIdStr) {
              seenMemberIds.add(memberIdStr);
            }
          }
        }
        
        if (uniqueMembers.length !== seat.members.length) {
          seat.members = uniqueMembers;
          needsUpdate = true;
          console.log(`Removed duplicates from seat ${seat.seatId}: ${seat.members.length} -> ${uniqueMembers.length}`);
        }
      }
      
      if (needsUpdate) {
        await seat.save();
        migratedCount++;
      }
    }
    
    if (migratedCount > 0) {
      console.log(`Migrated ${migratedCount} seats to new format`);
    }
  } catch (error) {
    console.error('Error during seat migration:', error);
  }
};

// Initialize seats (create all seats if they don't exist)
const initializeSeats = async () => {
  const rows = ['A', 'B', 'C'];
  const seats = [];
  
  for (const row of rows) {
    for (let i = 1; i <= 30; i++) {
      const seatId = `${row}${i}`;
      seats.push({
        seatId,
        row,
        number: i,
        isOccupied: false,
        members: []
      });
    }
  }
  
  // Check if seats already exist
  const existingSeats = await Seat.find();
  if (existingSeats.length === 0) {
    await Seat.insertMany(seats);
    console.log('Seats initialized successfully');
  } else {
    // Update existing seats to ensure they have the members array
    for (const existingSeat of existingSeats) {
      if (!existingSeat.members) {
        existingSeat.members = [];
        await existingSeat.save();
      }
    }
    console.log('Existing seats updated with members array');
  }
};

// Get all seats
exports.getAllSeats = async (req, res) => {
  try {
    await initializeSeats();
    await migrateSeatData(); // Run migration to ensure data consistency
    
    // COMPREHENSIVE CLEANUP: Fix any inconsistent seat data before fetching
    console.log('🧹 Starting comprehensive seat data cleanup...');
    const allSeats = await Seat.find();
    let cleanupCount = 0;
    
    for (const seat of allSeats) {
      let needsUpdate = false;
      
      // Ensure members array exists
      if (!seat.members) {
        seat.members = [];
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Created missing members array`);
      }
      
      // Fix the main issue: isOccupied=true but empty members array
      const actualMemberCount = seat.members.length;
      if (seat.isOccupied && actualMemberCount === 0) {
        seat.isOccupied = false;
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Fixed isOccupied=true with empty members array`);
      }
      
      // Also fix the opposite: isOccupied=false but has members
      if (!seat.isOccupied && actualMemberCount > 0) {
        seat.isOccupied = true;
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Fixed isOccupied=false with ${actualMemberCount} members`);
      }
      
      // Clear legacy fields if no members remain
      if (actualMemberCount === 0) {
        if (seat.memberId !== null || seat.memberName !== '' || seat.memberContact !== '' || seat.occupiedDate !== null) {
          seat.memberId = null;
          seat.memberName = '';
          seat.memberContact = '';
          seat.occupiedDate = null;
          needsUpdate = true;
          console.log(`🧹 Seat ${seat.seatId}: Cleared legacy fields (no members)`);
        }
      }
      
      // Remove any duplicate members
      if (seat.members && seat.members.length > 1) {
        const uniqueMembers = [];
        const seenMemberIds = new Set();
        
        for (const member of seat.members) {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          if (!memberIdStr || !seenMemberIds.has(memberIdStr)) {
            uniqueMembers.push(member);
            if (memberIdStr) {
              seenMemberIds.add(memberIdStr);
            }
          }
        }
        
        if (uniqueMembers.length !== seat.members.length) {
          seat.members = uniqueMembers;
          needsUpdate = true;
          console.log(`🧹 Seat ${seat.seatId}: Removed duplicate members (${seat.members.length} -> ${uniqueMembers.length})`);
        }
      }
      
      if (needsUpdate) {
        await seat.save();
        cleanupCount++;
      }
    }
    
    if (cleanupCount > 0) {
      console.log(`🧹 Comprehensive cleanup completed: Updated ${cleanupCount} seats`);
    } else {
      console.log('🧹 Comprehensive cleanup: All seats are consistent');
    }
    
    // Now fetch the cleaned data
    const seats = await Seat.find().sort({ seatId: 1 });
    
    // Ensure no duplicates in response and save cleaned data back to database
    for (const seat of seats) {
      let needsUpdate = false;
      
      if (seat.members && seat.members.length > 1) {
        const uniqueMembers = [];
        const seenMemberIds = new Set();
        
        for (const member of seat.members) {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          if (!memberIdStr || !seenMemberIds.has(memberIdStr)) {
            uniqueMembers.push(member);
            if (memberIdStr) {
              seenMemberIds.add(memberIdStr);
            }
          }
        }
        
        if (uniqueMembers.length !== seat.members.length) {
          console.log(`Cleaned duplicates from seat ${seat.seatId}: ${seat.members.length} -> ${uniqueMembers.length}`);
          seat.members = uniqueMembers;
          needsUpdate = true;
        }
      }
      
      // Update isOccupied based on actual member count
      const actualMemberCount = seat.members ? seat.members.length : 0;
      if (seat.isOccupied !== (actualMemberCount > 0)) {
        seat.isOccupied = actualMemberCount > 0;
        needsUpdate = true;
        console.log(`Updated isOccupied for seat ${seat.seatId}: ${seat.isOccupied}`);
      }
      
      // Save changes if needed
      if (needsUpdate) {
        await seat.save();
        console.log(`Saved cleaned data for seat ${seat.seatId}`);
      }
    }
    
    // Fetch fresh data after cleaning
    const cleanedSeats = await Seat.find().sort({ seatId: 1 });
    
    // Additional cleanup: Ensure all seats have clean data
    for (const seat of cleanedSeats) {
      const actualMemberCount = seat.members ? seat.members.length : 0;
      if (actualMemberCount === 0) {
        seat.memberId = null;
        seat.memberName = '';
        seat.memberContact = '';
        seat.occupiedDate = null;
        seat.isOccupied = false;
        await seat.save();
        console.log(`Final cleanup: Cleared all fields for seat ${seat.seatId}`);
      } else {
        // Also ensure isOccupied is correct for seats with members
        if (!seat.isOccupied) {
          seat.isOccupied = true;
          await seat.save();
          console.log(`Final cleanup: Fixed isOccupied for seat ${seat.seatId}`);
        }
      }
    }
    
    // Fetch the final cleaned data
    const finalSeats = await Seat.find().sort({ seatId: 1 });
    
    // Log the final state for debugging
    console.log('📊 Final seat data summary:');
    const occupiedSeats = finalSeats.filter(seat => seat.isOccupied);
    const availableSeats = finalSeats.filter(seat => !seat.isOccupied);
    console.log(`📊 Total seats: ${finalSeats.length}`);
    console.log(`📊 Occupied seats: ${occupiedSeats.length}`);
    console.log(`📊 Available seats: ${availableSeats.length}`);
    
    // Log any remaining inconsistencies
    const inconsistentSeats = finalSeats.filter(seat => {
      const hasMembers = seat.members && seat.members.length > 0;
      return seat.isOccupied !== hasMembers;
    });
    
    if (inconsistentSeats.length > 0) {
      console.warn(`⚠️ Found ${inconsistentSeats.length} seats with inconsistent data:`);
      inconsistentSeats.forEach(seat => {
        console.warn(`⚠️ Seat ${seat.seatId}: isOccupied=${seat.isOccupied}, members=${seat.members?.length || 0}`);
      });
    } else {
      console.log('✅ All seats have consistent data');
    }
    
    res.json(finalSeats);
  } catch (err) {
    console.error('Error fetching seats:', err);
    res.status(500).send('Server Error');
  }
};

// Get available seats based on time slot
exports.getAvailableSeats = async (req, res) => {
  try {
    const { shift, customStartTime, customEndTime } = req.query;
    
    if (!shift) {
      return res.status(400).json({ msg: 'Shift information is required' });
    }

    // Validate custom time inputs when shift is Custom
    if (shift === 'Custom') {
      if (!customStartTime || !customEndTime) {
        return res.status(400).json({ msg: 'Custom shift requires start and end times' });
      }
      const hhmm = /^\d{2}:\d{2}$/;
      if (!hhmm.test(customStartTime) || !hhmm.test(customEndTime)) {
        return res.status(400).json({ msg: 'Invalid time format. Use HH:MM (24-hour)' });
      }
      // Disallow zero-length intervals
      if (customStartTime === customEndTime) {
        return res.status(400).json({ msg: 'Start and end times cannot be the same' });
      }
    }

    await migrateSeatData(); // Run migration to ensure data consistency
    const allSeats = await Seat.find().sort({ seatId: 1 });
    const availableSeats = [];

    for (const seat of allSeats) {
      let needsUpdate = false;
      
      // Clean duplicates from seat members
      if (seat.members && seat.members.length > 1) {
        const uniqueMembers = [];
        const seenMemberIds = new Set();
        
        for (const member of seat.members) {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          if (!memberIdStr || !seenMemberIds.has(memberIdStr)) {
            uniqueMembers.push(member);
            if (memberIdStr) {
              seenMemberIds.add(memberIdStr);
            }
          }
        }
        
        if (uniqueMembers.length !== seat.members.length) {
          console.log(`Cleaned duplicates from seat ${seat.seatId}: ${seat.members.length} -> ${uniqueMembers.length}`);
          seat.members = uniqueMembers;
          needsUpdate = true;
        }
      }
      
      // Update isOccupied based on actual member count
      const actualMemberCount = seat.members ? seat.members.length : 0;
      if (seat.isOccupied !== (actualMemberCount > 0)) {
        seat.isOccupied = actualMemberCount > 0;
        needsUpdate = true;
        console.log(`Updated isOccupied for seat ${seat.seatId}: ${seat.isOccupied}`);
      }
      
      // Save changes if needed
      if (needsUpdate) {
        await seat.save();
        console.log(`Saved cleaned data for seat ${seat.seatId}`);
      }
      
      let isAvailable = true;
      
      // Check if seat has any members
      if (seat.members && seat.members.length > 0) {
        for (const member of seat.members) {
          const hasConflict = checkTimeConflict(
            member.shift,
            { startTime: member.customStartTime, endTime: member.customEndTime },
            shift,
            { startTime: customStartTime, endTime: customEndTime }
          );
          
          if (hasConflict) {
            isAvailable = false;
            break;
          }
        }
      }
      
      if (isAvailable) {
        availableSeats.push(seat);
      }
    }

    res.json(availableSeats);
  } catch (err) {
    console.error('Error fetching available seats:', err);
    res.status(500).send('Server Error');
  }
};

// Assign seat to member with time slot
exports.assignSeat = async (req, res) => {
  try {
    const { 
      seatId, 
      memberId, 
      memberName, 
      memberContact, 
      shift, 
      customStartTime, 
      customEndTime 
    } = req.body;
    
    console.log('Assigning seat:', { 
      seatId, 
      memberId, 
      memberName, 
      memberContact, 
      shift, 
      customStartTime, 
      customEndTime 
    });
    
    // Validate required fields
    if (!seatId || !memberName || !memberContact || !shift) {
      return res.status(400).json({ 
        msg: 'Missing required fields: seatId, memberName, memberContact, and shift are required' 
      });
    }

    // Validate custom time inputs when shift is Custom
    if (shift === 'Custom') {
      if (!customStartTime || !customEndTime) {
        return res.status(400).json({ msg: 'Custom shift requires start and end times' });
      }
      const hhmm = /^\d{2}:\d{2}$/;
      if (!hhmm.test(customStartTime) || !hhmm.test(customEndTime)) {
        return res.status(400).json({ msg: 'Invalid time format. Use HH:MM (24-hour)' });
      }
      if (customStartTime === customEndTime) {
        return res.status(400).json({ msg: 'Start and end times cannot be the same' });
      }
    }
    
    // Check if seat exists
    const seat = await Seat.findOne({ seatId });
    if (!seat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }
    
    // Check for time conflicts with existing members and prevent duplicates
    if (seat.members && seat.members.length > 0) {
      for (const member of seat.members) {
        // Check for duplicate member
        if (member.memberId && memberId && member.memberId.toString() === memberId.toString()) {
          return res.status(400).json({ 
            msg: `Member ${memberName} is already assigned to this seat` 
          });
        }
        
        const hasConflict = checkTimeConflict(
          member.shift,
          { startTime: member.customStartTime, endTime: member.customEndTime },
          shift,
          { startTime: customStartTime, endTime: customEndTime }
        );
        
        if (hasConflict) {
          return res.status(400).json({ 
            msg: `Time conflict with existing member ${member.memberName} (${member.shift})` 
          });
        }
      }
    }
    
    // Add new member to seat
    const newMember = {
      memberId: memberId || null,
      memberName,
      memberContact,
      shift,
      customStartTime: shift === 'Custom' ? customStartTime : null,
      customEndTime: shift === 'Custom' ? customEndTime : null,
      occupiedDate: new Date()
    };
    
    console.log('New member data to add:', newMember);
    
    if (!seat.members) {
      seat.members = [];
    }
    
    seat.members.push(newMember);
    seat.isOccupied = true;
    
    // Update legacy fields for backward compatibility
    seat.memberId = memberId || null;
    seat.memberName = memberName;
    seat.memberContact = memberContact;
    seat.occupiedDate = new Date();
    
    console.log('Saving seat with data:', {
      seatId: seat.seatId,
      membersCount: seat.members.length,
      isOccupied: seat.isOccupied
    });
    
    // Validate seat data before saving
    try {
      await seat.validate();
      console.log('Seat validation passed');
    } catch (validationError) {
      console.error('Seat validation failed:', validationError);
      console.error('Validation error details:', validationError.errors);
      return res.status(400).json({ 
        msg: 'Invalid seat data', 
        error: validationError.message,
        details: validationError.errors
      });
    }
    
    await seat.save();
    console.log('Seat assigned successfully');
    
    // Update member's seat if memberId is provided
    if (memberId) {
      console.log('Updating member seat for memberId:', memberId);
      try {
        const updatedMember = await Member.findByIdAndUpdate(
          memberId, 
          { seat: seatId }, 
          { new: true, runValidators: true }
        );
        console.log('Member updated successfully:', updatedMember ? 'yes' : 'no');
        if (updatedMember) {
          console.log('Updated member seat field:', updatedMember.seat);
        }
      } catch (memberUpdateError) {
        console.error('Error updating member:', memberUpdateError);
        // Don't throw error here, just log it
        console.log('Member update failed, but seat assignment succeeded');
      }
    }
    
    res.json({ 
      seat, 
      message: 'Seat assigned successfully',
      memberUpdated: !!memberId 
    });
  } catch (err) {
    console.error('Error assigning seat:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Vacate seat for specific member
exports.vacateSeat = async (req, res) => {
  try {
    const { seatId, memberId } = req.body;
    console.log('Vacating seat:', seatId, 'for member:', memberId);
    
    if (!seatId) {
      return res.status(400).json({ msg: 'Seat ID is required' });
    }
    
    const seat = await Seat.findOne({ seatId });
    if (!seat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }
    
    console.log('Found seat:', {
      seatId: seat.seatId,
      isOccupied: seat.isOccupied,
      membersCount: seat.members ? seat.members.length : 0,
      members: seat.members
    });
    
    // Remove specific member from seat
    if (seat.members && seat.members.length > 0) {
      const initialCount = seat.members.length;
      
      // Handle both cases: memberId can be null or a string/ObjectId
      if (memberId) {
        // Remove member by memberId
        seat.members = seat.members.filter(member => {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          const requestMemberIdStr = memberId.toString();
          return memberIdStr !== requestMemberIdStr;
        });
      } else {
        // If no memberId provided, remove the first member (fallback)
        seat.members.shift();
      }
      
      console.log(`Removed member from seat. Before: ${initialCount}, After: ${seat.members.length}`);
    }
    
    // Update isOccupied based on remaining members
    seat.isOccupied = seat.members && seat.members.length > 0;
    
    // Update legacy fields if no members remain
    if (!seat.isOccupied) {
      seat.memberId = null;
      seat.memberName = '';
      seat.memberContact = '';
      seat.occupiedDate = null;
    } else {
      // Update legacy fields with the first remaining member
      const firstMember = seat.members[0];
      seat.memberId = firstMember.memberId;
      seat.memberName = firstMember.memberName;
      seat.memberContact = firstMember.memberContact;
      seat.occupiedDate = firstMember.occupiedDate;
    }
    
    console.log('Saving seat with updated data:', {
      seatId: seat.seatId,
      isOccupied: seat.isOccupied,
      membersCount: seat.members.length,
      memberId: seat.memberId,
      memberName: seat.memberName
    });
    
    await seat.save();
    console.log('Seat vacated successfully');
    
    // Double-check the saved data
    const savedSeat = await Seat.findOne({ seatId });
    console.log('Verified saved seat data:', {
      seatId: savedSeat.seatId,
      isOccupied: savedSeat.isOccupied,
      membersCount: savedSeat.members.length,
      members: savedSeat.members.map(m => ({ id: m.memberId, name: m.memberName }))
    });
    
    // Update member's seat if memberId is provided
    if (memberId) {
      console.log('Updating member seat for memberId:', memberId);
      try {
        const updatedMember = await Member.findByIdAndUpdate(
          memberId, 
          { $set: { seat: '' } }, 
          { new: true, runValidators: true }
        );
        console.log('Member updated successfully:', updatedMember ? 'yes' : 'no');
        if (updatedMember) {
          console.log('Updated member seat field:', updatedMember.seat);
        }
      } catch (memberUpdateError) {
        console.error('Error updating member:', memberUpdateError);
        // Don't throw error here, just log it - seat vacation should still succeed
        console.log('Member update failed, but seat vacation succeeded');
      }
    }
    
    res.json({ 
      seat, 
      message: 'Seat vacated successfully',
      memberUpdated: !!memberId 
    });
  } catch (err) {
    console.error('Error vacating seat:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Get seat by ID
exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findOne({ seatId: req.params.seatId });
    if (!seat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }
    res.json(seat);
  } catch (err) {
    console.error('Error fetching seat:', err);
    res.status(500).send('Server Error');
  }
}; 

// Test endpoint to verify seat assignment
exports.testSeatAssignment = async (req, res) => {
  try {
    console.log('Testing seat assignment...');
    
    // Test data
    const testData = {
      seatId: 'A1',
      memberId: null,
      memberName: 'Test User',
      memberContact: '1234567890',
      shift: 'Half Day (8 AM - 2 PM)'
    };
    
    console.log('Test data:', testData);
    
    // Check if seat exists
    const seat = await Seat.findOne({ seatId: testData.seatId });
    if (!seat) {
      return res.status(404).json({ msg: 'Test seat A1 not found' });
    }
    
    console.log('Found seat:', {
      seatId: seat.seatId,
      isOccupied: seat.isOccupied,
      membersCount: seat.members ? seat.members.length : 0
    });
    
    // Add test member
    const newMember = {
      memberId: testData.memberId,
      memberName: testData.memberName,
      memberContact: testData.memberContact,
      shift: testData.shift,
      customStartTime: null,
      customEndTime: null,
      occupiedDate: new Date()
    };
    
    if (!seat.members) {
      seat.members = [];
    }
    
    seat.members.push(newMember);
    seat.isOccupied = true;
    
    await seat.save();
    
    console.log('Test seat assignment successful');
    
    res.json({ 
      success: true, 
      message: 'Test seat assignment successful',
      seat: {
        seatId: seat.seatId,
        isOccupied: seat.isOccupied,
        membersCount: seat.members.length
      }
    });
  } catch (err) {
    console.error('Test seat assignment error:', err);
    res.status(500).json({ msg: 'Test failed', error: err.message });
  }
};

// Comprehensive data synchronization endpoint
exports.syncData = async (req, res) => {
  try {
    console.log('🔄 Starting comprehensive data synchronization...');
    
    // Step 1: Initialize seats if needed
    await initializeSeats();
    
    // Step 2: Migrate legacy data
    await migrateSeatData();
    
    // Step 3: Comprehensive cleanup of all seats
    const allSeats = await Seat.find();
    let cleanupCount = 0;
    
    for (const seat of allSeats) {
      let needsUpdate = false;
      
      // Ensure members array exists
      if (!seat.members) {
        seat.members = [];
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Created missing members array`);
      }
      
      // Fix the main issue: isOccupied=true but empty members array
      const actualMemberCount = seat.members.filter(m => m.memberId).length;
      if (seat.isOccupied && actualMemberCount === 0) {
        seat.isOccupied = false;
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Fixed isOccupied=true with empty members array`);
      }
      
      // Also fix the opposite: isOccupied=false but has members
      if (!seat.isOccupied && actualMemberCount > 0) {
        seat.isOccupied = true;
        needsUpdate = true;
        console.log(`🧹 Seat ${seat.seatId}: Fixed isOccupied=false with ${actualMemberCount} members`);
      }
      
      // Clear legacy fields if no members remain
      if (actualMemberCount === 0) {
        if (seat.memberId !== null || seat.memberName !== '' || seat.memberContact !== '' || seat.occupiedDate !== null) {
          seat.memberId = null;
          seat.memberName = '';
          seat.memberContact = '';
          seat.occupiedDate = null;
          needsUpdate = true;
          console.log(`🧹 Seat ${seat.seatId}: Cleared legacy fields (no members)`);
        }
      }
      
      // Remove any duplicate members
      if (seat.members && seat.members.length > 1) {
        const uniqueMembers = [];
        const seenMemberIds = new Set();
        
        for (const member of seat.members) {
          const memberIdStr = member.memberId ? member.memberId.toString() : null;
          if (!memberIdStr || !seenMemberIds.has(memberIdStr)) {
            uniqueMembers.push(member);
            if (memberIdStr) {
              seenMemberIds.add(memberIdStr);
            }
          }
        }
        
        if (uniqueMembers.length !== seat.members.length) {
          seat.members = uniqueMembers;
          needsUpdate = true;
          console.log(`🧹 Seat ${seat.seatId}: Removed duplicate members (${seat.members.length} -> ${uniqueMembers.length})`);
        }
      }
      
      if (needsUpdate) {
        await seat.save();
        cleanupCount++;
      }
    }
    
    // Step 4: Verify member-seat consistency
    const Member = require('../models/Member');
    const allMembers = await Member.find();
    let memberSeatIssues = 0;
    
    for (const member of allMembers) {
      if (member.seat) {
        // Check if the seat exists and has this member
        const seat = await Seat.findOne({ seatId: member.seat });
        if (!seat) {
          console.log(`⚠️ Member ${member.name} has seat ${member.seat} but seat doesn't exist`);
          memberSeatIssues++;
        } else {
          const hasMember = seat.members && seat.members.some(m => m.memberId && m.memberId.toString() === member._id.toString());
          if (!hasMember) {
            console.log(`⚠️ Member ${member.name} has seat ${member.seat} but not found in seat members`);
            memberSeatIssues++;
          }
        }
      }
    }
    
    // Step 5: Get final statistics
    const finalSeats = await Seat.find();
    const occupiedSeats = finalSeats.filter(seat => seat.isOccupied);
    const availableSeats = finalSeats.filter(seat => !seat.isOccupied);
    const seatsWithMembers = finalSeats.filter(seat => seat.members && seat.members.length > 0);
    
    console.log('🔄 Data synchronization completed');
    console.log(`📊 Final stats: Total seats=${finalSeats.length}, Occupied=${occupiedSeats.length}, Available=${availableSeats.length}, With members=${seatsWithMembers.length}`);
    
    res.json({
      success: true,
      message: 'Data synchronization completed successfully',
      stats: {
        totalSeats: finalSeats.length,
        occupiedSeats: occupiedSeats.length,
        availableSeats: availableSeats.length,
        seatsWithMembers: seatsWithMembers.length,
        cleanupCount,
        memberSeatIssues
      },
      cleanupDetails: {
        seatsUpdated: cleanupCount,
        memberSeatInconsistencies: memberSeatIssues
      }
    });
    
  } catch (err) {
    console.error('Error in data synchronization:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Data synchronization failed', 
      error: err.message 
    });
  }
};