const Member = require('../models/Member');

exports.addMember = async (req, res) => {
  try {
    console.log('Adding member with data:', req.body);
    
    // Remove seat from the data before creating member to prevent automatic assignment
    const memberData = { ...req.body };
    const seatToAssign = memberData.seat;
    delete memberData.seat; // Remove seat to prevent automatic assignment
    
    const newMember = new Member(memberData);
    const member = await newMember.save();
    
    // If a seat was specified, assign it via the seat assignment endpoint
    if (seatToAssign) {
      console.log('Seat assignment will be handled by frontend for member:', member._id, 'to seat:', seatToAssign);
    }
    
    res.json(member);
  } catch (err) {
    console.error('Error adding member:', err.message);
    console.error('Error details:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'A member with this Aadhar number already exists' });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: `Validation Error: ${validationErrors.join(', ')}` });
    }
    
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    console.log('Fetching all members...');
    const members = await Member.find().sort({ createdAt: -1 });
    console.log(`Found ${members.length} members`);
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    console.log('Updating member with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const { name, fatherName, contact, aadhar, shift, monthlyFees, seat, customStartTime, customEndTime } = req.body;
    
    // Check if member exists
    const existingMember = await Member.findById(req.params.id);
    if (!existingMember) {
      return res.status(404).json({ msg: 'Member not found' });
    }
    
    // Check if aadhar is being changed and if it already exists
    if (aadhar && aadhar !== existingMember.aadhar) {
      const aadharExists = await Member.findOne({ aadhar, _id: { $ne: req.params.id } });
      if (aadharExists) {
        return res.status(400).json({ msg: 'A member with this Aadhar number already exists' });
      }
    }
    
    // Update member
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, fatherName, contact, aadhar, shift, monthlyFees, seat, customStartTime, customEndTime },
      { new: true, runValidators: true }
    );
    
    // Handle seat changes
    const Seat = require('../models/Seat');
    
    // If seat is being changed, remove member from old seat
    if (existingMember.seat && existingMember.seat !== seat) {
      const oldSeat = await Seat.findOne({ seatId: existingMember.seat });
      if (oldSeat && oldSeat.members) {
        // Remove this member from the seat's members array
        oldSeat.members = oldSeat.members.filter(member => member.memberId.toString() !== req.params.id);
        
        // Update isOccupied based on remaining members
        oldSeat.isOccupied = oldSeat.members.length > 0;
        
        // Update legacy fields if no members remain
        if (!oldSeat.isOccupied) {
          oldSeat.memberId = null;
          oldSeat.memberName = '';
          oldSeat.memberContact = '';
          oldSeat.occupiedDate = null;
        } else {
          // Update legacy fields with the first remaining member
          const firstMember = oldSeat.members[0];
          oldSeat.memberId = firstMember.memberId;
          oldSeat.memberName = firstMember.memberName;
          oldSeat.memberContact = firstMember.memberContact;
          oldSeat.occupiedDate = firstMember.occupiedDate;
        }
        
        await oldSeat.save();
        console.log('Old seat freed:', existingMember.seat);
      }
    }
    
    // If new seat is assigned, add member to new seat
    if (seat && seat !== existingMember.seat) {
      const newSeat = await Seat.findOne({ seatId: seat });
      if (newSeat) {
        // Add member to seat with time information
        const newSeatMember = {
          memberId: updatedMember._id,
          memberName: updatedMember.name,
          memberContact: updatedMember.contact,
          shift: updatedMember.shift,
          customStartTime: updatedMember.shift === 'Custom' ? updatedMember.customStartTime : null,
          customEndTime: updatedMember.shift === 'Custom' ? updatedMember.customEndTime : null,
          occupiedDate: new Date()
        };
        
        if (!newSeat.members) {
          newSeat.members = [];
        }
        
        newSeat.members.push(newSeatMember);
        newSeat.isOccupied = true;
        
        // Update legacy fields for backward compatibility
        newSeat.memberId = updatedMember._id;
        newSeat.memberName = updatedMember.name;
        newSeat.memberContact = updatedMember.contact;
        newSeat.occupiedDate = new Date();
        
        await newSeat.save();
        console.log('New seat assigned:', seat);
      }
    }

    // Ensure all seats containing this member reflect updated shift/times
    try {
      const Seat = require('../models/Seat');
      const seatsWithMember = await Seat.find({ 'members.memberId': updatedMember._id });
      for (const s of seatsWithMember) {
        let changed = false;
        s.members = s.members.map(m => {
          const mId = m.memberId ? m.memberId.toString() : '';
          if (mId === updatedMember._id.toString()) {
            changed = true;
            return {
              ...m,
              memberName: updatedMember.name,
              memberContact: updatedMember.contact,
              shift: updatedMember.shift,
              customStartTime: updatedMember.shift === 'Custom' ? updatedMember.customStartTime : null,
              customEndTime: updatedMember.shift === 'Custom' ? updatedMember.customEndTime : null
            };
          }
          return m;
        });

        if (changed) {
          // Keep legacy fields in sync with first member
          if (s.members.length > 0) {
            const firstMember = s.members[0];
            s.memberId = firstMember.memberId || null;
            s.memberName = firstMember.memberName || '';
            s.memberContact = firstMember.memberContact || '';
            s.occupiedDate = firstMember.occupiedDate || null;
            s.isOccupied = true;
          } else {
            s.memberId = null;
            s.memberName = '';
            s.memberContact = '';
            s.occupiedDate = null;
            s.isOccupied = false;
          }
          await s.save();
          console.log(`Updated seat ${s.seatId} member entry for ${updatedMember.name} with new shift/times`);
        }
      }
    } catch (seatUpdateErr) {
      console.error('Error updating seat member entry after member update:', seatUpdateErr);
      // Non-fatal: member update should still succeed
    }
    
    console.log('Member updated successfully');
    res.json(updatedMember);
  } catch (err) {
    console.error('Error updating member:', err.message);
    console.error('Error details:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: `Validation Error: ${validationErrors.join(', ')}` });
    }
    
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    console.log('Deleting member with ID:', req.params.id);

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    // Free the seat if member has one assigned
    if (member.seat) {
      try {
        const Seat = require('../models/Seat');
        const seat = await Seat.findOne({ seatId: member.seat });
        
        if (seat) {
          console.log(`Found seat ${member.seat} for member ${member.name}`);
          
          // Remove this member from the seat's members array
          if (seat.members && Array.isArray(seat.members)) {
            const initialMemberCount = seat.members.length;
            seat.members = seat.members.filter(seatMember => {
              const memberIdStr = seatMember.memberId ? seatMember.memberId.toString() : '';
              const targetIdStr = req.params.id;
              const shouldKeep = memberIdStr !== targetIdStr;
              if (!shouldKeep) {
                console.log(`Removing member ${seatMember.memberName} (${memberIdStr}) from seat ${member.seat}`);
              }
              return shouldKeep;
            });
            
            console.log(`Seat ${member.seat}: removed member, members count: ${initialMemberCount} -> ${seat.members.length}`);
          } else {
            console.log(`Seat ${member.seat} has no members array or it's not an array`);
            seat.members = [];
          }
          
          // Update isOccupied based on remaining members
          const newMemberCount = seat.members.length;
          seat.isOccupied = newMemberCount > 0;
          
          console.log(`Seat ${member.seat}: isOccupied set to ${seat.isOccupied} (${newMemberCount} members remaining)`);
          
          // Update legacy fields if no members remain
          if (!seat.isOccupied) {
            seat.memberId = null;
            seat.memberName = '';
            seat.memberContact = '';
            seat.occupiedDate = null;
            console.log(`Seat ${member.seat}: cleared legacy fields (no members remaining)`);
          } else if (seat.members.length > 0) {
            // Update legacy fields with the first remaining member
            const firstMember = seat.members[0];
            seat.memberId = firstMember.memberId;
            seat.memberName = firstMember.memberName;
            seat.memberContact = firstMember.memberContact;
            seat.occupiedDate = firstMember.occupiedDate;
            console.log(`Seat ${member.seat}: updated legacy fields with first member ${firstMember.memberName}`);
          }
          
          await seat.save();
          console.log(`✅ Seat ${member.seat} successfully updated and saved`);
          
          // Verify the save worked
          const savedSeat = await Seat.findOne({ seatId: member.seat });
          console.log(`Verification - Seat ${member.seat}: isOccupied=${savedSeat.isOccupied}, members=${savedSeat.members.length}`);
          
        } else {
          console.warn(`❌ No seat found with seatId: ${member.seat}`);
        }
      } catch (seatError) {
        console.error('❌ Error freeing seat:', seatError);
        // Continue with member deletion even if seat freeing fails
      }
    } else {
      console.log('ℹ️ No seat assigned to member, checking if member exists in any seat...');
      
      // Fallback: Search for this member in any seat
      try {
        const Seat = require('../models/Seat');
        const seatWithMember = await Seat.findOne({
          'members.memberId': req.params.id
        });
        
        if (seatWithMember) {
          console.log(`Found member ${member.name} in seat ${seatWithMember.seatId}, removing...`);
          
          // Remove this member from the seat's members array
          const initialMemberCount = seatWithMember.members.length;
          seatWithMember.members = seatWithMember.members.filter(seatMember => {
            const memberIdStr = seatMember.memberId ? seatMember.memberId.toString() : '';
            const targetIdStr = req.params.id;
            const shouldKeep = memberIdStr !== targetIdStr;
            if (!shouldKeep) {
              console.log(`Removing member ${seatMember.memberName} (${memberIdStr}) from seat ${seatWithMember.seatId}`);
            }
            return shouldKeep;
          });
          
          console.log(`Seat ${seatWithMember.seatId}: removed member, members count: ${initialMemberCount} -> ${seatWithMember.members.length}`);
          
          // Update isOccupied based on remaining members
          const newMemberCount = seatWithMember.members.length;
          seatWithMember.isOccupied = newMemberCount > 0;
          
          console.log(`Seat ${seatWithMember.seatId}: isOccupied set to ${seatWithMember.isOccupied} (${newMemberCount} members remaining)`);
          
          // Update legacy fields if no members remain
          if (!seatWithMember.isOccupied) {
            seatWithMember.memberId = null;
            seatWithMember.memberName = '';
            seatWithMember.memberContact = '';
            seatWithMember.occupiedDate = null;
            console.log(`Seat ${seatWithMember.seatId}: cleared legacy fields (no members remaining)`);
          } else if (seatWithMember.members.length > 0) {
            // Update legacy fields with the first remaining member
            const firstMember = seatWithMember.members[0];
            seatWithMember.memberId = firstMember.memberId;
            seatWithMember.memberName = firstMember.memberName;
            seatWithMember.memberContact = firstMember.memberContact;
            seatWithMember.occupiedDate = firstMember.occupiedDate;

            console.log(`Seat ${seatWithMember.seatId}: updated legacy fields with first member ${firstMember.memberName}`);
          }
          
          await seatWithMember.save();
          console.log(`✅ Seat ${seatWithMember.seatId} successfully updated and saved`);
          
          // Verify the save worked
          const savedSeat = await Seat.findOne({ seatId: seatWithMember.seatId });
          console.log(`Verification - Seat ${seatWithMember.seatId}: isOccupied=${savedSeat.isOccupied}, members=${savedSeat.members.length}`);
        } else {
          console.log(`ℹ️ Member ${member.name} not found in any seat`);
        }
      } catch (fallbackError) {
        console.error('❌ Error in fallback seat search:', fallbackError);
      }
    }

    // Final cleanup: Search for this member in ANY seat and remove them completely
    try {
      const Seat = require('../models/Seat');
      const allSeats = await Seat.find({});
      let cleanupCount = 0;
      
      for (const seat of allSeats) {
        if (seat.members && Array.isArray(seat.members)) {
          const initialCount = seat.members.length;
          seat.members = seat.members.filter(seatMember => {
            const memberIdStr = seatMember.memberId ? seatMember.memberId.toString() : '';
            const targetIdStr = req.params.id;
            return memberIdStr !== targetIdStr;
          });
          
          if (seat.members.length !== initialCount) {
            // Update seat status
            seat.isOccupied = seat.members.length > 0;
            
            // Clear legacy fields if no members remain
            if (!seat.isOccupied) {
              seat.memberId = null;
              seat.memberName = '';
              seat.memberContact = '';
              seat.occupiedDate = null;
            } else if (seat.members.length > 0) {
              // Update legacy fields with the first remaining member
              const firstMember = seat.members[0];
              seat.memberId = firstMember.memberId;
              seat.memberName = firstMember.memberName;
              seat.memberContact = firstMember.memberContact;
              seat.occupiedDate = firstMember.occupiedDate;
            }
            
            await seat.save();
            cleanupCount++;
            console.log(`🧹 Final cleanup: Removed member from seat ${seat.seatId}, members: ${initialCount} -> ${seat.members.length}`);
          }
        }
      }
      
      if (cleanupCount > 0) {
        console.log(`🧹 Final cleanup completed: Updated ${cleanupCount} seats`);
      }
    } catch (cleanupError) {
      console.error('❌ Error in final cleanup:', cleanupError);
    }

    // Remove any payment records associated with this member
    try {
      const Payment = require('../models/Payment');
      const deletedPayments = await Payment.deleteMany({ 
        $or: [
          { memberId: req.params.id },
          { memberName: member.name },
          { memberContact: member.contact }
        ]
      });
      console.log(`Deleted ${deletedPayments.deletedCount} payment records for member`);
    } catch (paymentError) {
      console.error('Error deleting payment records:', paymentError);
      // Continue with member deletion even if payment deletion fails
    }

    // Delete the member
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ msg: 'Member not found or already deleted' });
    }
    
    console.log('Member deleted successfully');

    // Final verification: Check if any seats still reference this member
    try {
      const Seat = require('../models/Seat');
      const seatsWithMember = await Seat.find({
        'members.memberId': req.params.id
      });
      
      if (seatsWithMember.length > 0) {
        console.warn(`⚠️ Found ${seatsWithMember.length} seats still referencing deleted member ${member.name}`);
        for (const seat of seatsWithMember) {
          console.log(`Cleaning up seat ${seat.seatId}...`);
          
          // Remove the deleted member from this seat
          const initialCount = seat.members.length;
          seat.members = seat.members.filter(seatMember => {
            const memberIdStr = seatMember.memberId ? seatMember.memberId.toString() : '';
            const targetIdStr = req.params.id;
            return memberIdStr !== targetIdStr;
          });
          
          // Update seat status
          seat.isOccupied = seat.members.length > 0;
          
          // Clear legacy fields if no members remain
          if (!seat.isOccupied) {
            seat.memberId = null;
            seat.memberName = '';
            seat.memberContact = '';
            seat.occupiedDate = null;
          } else if (seat.members.length > 0) {
            // Update legacy fields with the first remaining member
            const firstMember = seat.members[0];
            seat.memberId = firstMember.memberId;
            seat.memberName = firstMember.memberName;
            seat.memberContact = firstMember.memberContact;
            seat.occupiedDate = firstMember.occupiedDate;
          }
          
          await seat.save();
          console.log(`✅ Cleaned up seat ${seat.seatId}: ${initialCount} -> ${seat.members.length} members`);
        }
      } else {
        console.log('✅ No seats found referencing the deleted member');
      }
    } catch (verificationError) {
      console.error('❌ Error during final verification:', verificationError);
    }

    // Additional cleanup: Force refresh all seats to ensure consistency
    try {
      console.log('🔄 Performing final seat consistency check...');
      const allSeats = await Seat.find();
      let updatedSeats = 0;
      
      for (const seat of allSeats) {
        let needsUpdate = false;
        
        // Ensure members array exists
        if (!seat.members) {
          seat.members = [];
          needsUpdate = true;
        }
        
        // Update isOccupied based on actual member count
        const actualMemberCount = seat.members.length;
        if (seat.isOccupied !== (actualMemberCount > 0)) {
          seat.isOccupied = actualMemberCount > 0;
          needsUpdate = true;
          console.log(`🔄 Fixed seat ${seat.seatId}: isOccupied=${seat.isOccupied} (${actualMemberCount} members)`);
        }
        
        // Clear legacy fields if no members remain
        if (actualMemberCount === 0) {
          // Always clear legacy fields when no members remain
          seat.memberId = null;
          seat.memberName = '';
          seat.memberContact = '';
          seat.occupiedDate = null;
          needsUpdate = true;
          console.log(`🔄 Cleared legacy fields for seat ${seat.seatId} (no members remaining)`);
        }
        
        // Additional check: if seat has legacy data but no members, clear it
        if (seat.memberName && seat.memberName.trim() !== '' && actualMemberCount === 0) {
          seat.memberName = '';
          seat.memberId = null;
          seat.memberContact = '';
          seat.occupiedDate = null;
          needsUpdate = true;
          console.log(`🔄 Force cleared legacy data for seat ${seat.seatId} (had memberName but no members)`);
        }
        
        if (needsUpdate) {
          await seat.save();
          updatedSeats++;
        }
      }
      
      if (updatedSeats > 0) {
        console.log(`🔄 Final consistency check: Updated ${updatedSeats} seats`);
      } else {
        console.log('🔄 Final consistency check: All seats are consistent');
      }
    } catch (consistencyError) {
      console.error('❌ Error during final consistency check:', consistencyError);
    }

    res.json({ 
      msg: 'Member deleted successfully',
      memberId: req.params.id,
      memberName: member.name,
      seatFreed: member.seat || 'No seat assigned',
      cleanupCompleted: true
    });
  } catch (err) {
    console.error('Error deleting member:', err.message);
    console.error('Error details:', err);
    
    // Provide more specific error messages
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid member ID format' });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: `Validation Error: ${validationErrors.join(', ')}` });
    }
    
    res.status(500).json({ 
      msg: 'Server Error while deleting member', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};


