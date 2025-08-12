import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS, getAuthConfig } from '../config/api';

const SeatManagement = () => {
  const [seats, setSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatDetails, setSeatDetails] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for force re-render
  const [assignmentForm, setAssignmentForm] = useState({
    memberId: '',
    memberName: '',
    memberContact: '',
    shift: '',
    customStartTime: '',
    customEndTime: ''
  });

  // Real-time synchronization interval
  const [syncInterval, setSyncInterval] = useState(null);

  // Generate seat layout: A1-A30, B1-B30, C1-C30
  const generateSeatLayout = () => {
    const layout = {};
    const rows = ['A', 'B', 'C'];
    
    rows.forEach(row => {
      for (let i = 1; i <= 30; i++) {
        const seatId = `${row}${i}`;
        layout[seatId] = {
          id: seatId,
          row: row,
          number: i,
          isOccupied: false,
          members: []
        };
      }
    });
    
    return layout;
  };

  // Enhanced fetch function with better error handling and data validation
  const fetchSeats = async (forceRefresh = false) => {
    try {
      console.log('🔄 Fetching seats from backend...');
      
      // If force refresh, clear the current state first
      if (forceRefresh) {
        console.log('🔄 Force refresh: clearing current seat state...');
        setSeats(generateSeatLayout());
        // Add a small delay to ensure state is cleared
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const response = await axios.get(API_ENDPOINTS.SEATS, getAuthConfig());
      
      console.log('🔄 Raw backend response:', response.data);
      
      // Validate and clean the received data
      const validatedSeats = response.data.map(seat => {
        // Ensure all required fields exist
        const cleanSeat = {
          seatId: seat.seatId,
          row: seat.row,
          number: seat.number,
          isOccupied: Boolean(seat.isOccupied),
          members: Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [],
          memberCount: Array.isArray(seat.members) ? seat.members.filter(m => m.memberId).length : 0
        };
        
        // Fix any inconsistencies in the received data
        const actualMemberCount = cleanSeat.members.length;
        if (cleanSeat.isOccupied && actualMemberCount === 0) {
          console.warn(`⚠️ Frontend fixing seat ${seat.seatId}: isOccupied=true but no valid members`);
          cleanSeat.isOccupied = false;
        } else if (!cleanSeat.isOccupied && actualMemberCount > 0) {
          console.warn(`⚠️ Frontend fixing seat ${seat.seatId}: isOccupied=false but has ${actualMemberCount} valid members`);
          cleanSeat.isOccupied = true;
        }
        
        return cleanSeat;
      });
      
      console.log('🔄 Validated seats data:', validatedSeats);
      
      // Merge fetched data with generated layout
      const layout = generateSeatLayout();
      validatedSeats.forEach(seat => {
        if (layout[seat.seatId]) {
          // Use the validated data
          layout[seat.seatId] = {
            ...layout[seat.seatId],
            isOccupied: seat.isOccupied,
            members: seat.members,
            memberCount: seat.memberCount
          };
          
          console.log(`Seat ${seat.seatId}: members=${seat.memberCount}, isOccupied=${seat.isOccupied}, memberNames=${seat.members.map(m => m.memberName).join(', ')}`);
        }
      });
      
      // Force a complete state update
      setSeats({...layout});
      
      // Log summary for debugging
      const occupiedSeats = Object.values(layout).filter(seat => seat.isOccupied);
      const availableSeats = Object.values(layout).filter(seat => !seat.isOccupied);
      console.log(`📊 Frontend summary: Total=${Object.keys(layout).length}, Occupied=${occupiedSeats.length}, Available=${availableSeats.length}`);
      
    } catch (err) {
      console.error('Error fetching seats:', err);
      toast.error('Failed to fetch seats data');
      // If API fails, use default layout
      setSeats(generateSeatLayout());
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive data synchronization function
  const syncDataWithBackend = async () => {
    try {
      console.log('🔄 Starting comprehensive data synchronization...');
      toast.loading('Synchronizing data with backend...', { id: 'sync' });
      
      const response = await axios.post(API_ENDPOINTS.SEATS_SYNC, {}, getAuthConfig());
      
      console.log('🔄 Sync response:', response.data);
      
      if (response.data.success) {
        const stats = response.data.stats;
        const cleanup = response.data.cleanupDetails;
        
        console.log('🔄 Sync completed successfully:', stats);
        
        // Show success message with details
        toast.success(
          `Data synchronized successfully! 
          ${cleanup.seatsUpdated > 0 ? `Fixed ${cleanup.seatsUpdated} seats. ` : ''}
          ${cleanup.memberSeatInconsistencies > 0 ? `Found ${cleanup.memberSeatInconsistencies} inconsistencies.` : ''}`,
          { id: 'sync' }
        );
        
        // Force refresh the seat data
        await fetchSeats(true);
        
        // Also trigger a refresh for ViewMembers if it's open
        localStorage.setItem('refreshSeatManagement', Date.now().toString());
        
      } else {
        toast.error('Data synchronization failed', { id: 'sync' });
      }
      
    } catch (error) {
      console.error('Error in data synchronization:', error);
      toast.error('Failed to synchronize data with backend', { id: 'sync' });
    }
  };

  // Enhanced seat operations with better synchronization
  const handleVacateSeat = async (memberId) => {
    try {
      console.log('🔄 Vacating seat for member:', memberId);
      
      const response = await axios.post(API_ENDPOINTS.SEATS_VACATE, {
        seatId: selectedSeat,
        memberId: memberId
      }, getAuthConfig());
      
      console.log('🔄 Vacate response:', response.data);
      
      // Force refresh seats data with multiple attempts to ensure consistency
      console.log('🔄 Force refreshing seats after vacating member...');
      await fetchSeats(true);
      
      // Add delays to ensure backend has processed the change
      setTimeout(async () => {
        console.log('🔄 Second refresh after vacating member (500ms)...');
        await fetchSeats(true);
        // Close modal after the refresh
        setShowSeatModal(false);
      }, 500);

      toast.success('Member removed from seat successfully!');
    } catch (error) {
      console.error('Error vacating seat:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to remove member from seat';
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        errorMessage = serverError.msg || serverError.error || `Server error: ${error.response.status}`;
        console.error('Server error details:', serverError);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection';
        console.error('Network error:', error.request);
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
        console.error('Other error:', error.message);
      }
      
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleClearAllMembers = async () => {
    try {
      console.log('🔄 Clearing all members from seat:', selectedSeat);
      
      // Remove all members one by one
      if (seatDetails.members && seatDetails.members.length > 0) {
        for (const member of seatDetails.members) {
          if (member.memberId) {
            try {
              await axios.post(API_ENDPOINTS.SEATS_VACATE, {
                seatId: selectedSeat,
                memberId: member.memberId
              }, getAuthConfig());
              console.log(`🔄 Removed member ${member.memberName} from seat ${selectedSeat}`);
            } catch (memberError) {
              console.error(`Error removing member ${member.memberName}:`, memberError);
            }
          }
        }
      }
      
      // Force refresh seats data with multiple attempts to ensure consistency
      console.log('🔄 Force refreshing seats after clearing all members...');
      await fetchSeats(true);
      
      // Add delays to ensure backend has processed all changes
      setTimeout(async () => {
        console.log('🔄 Second refresh after clearing members (500ms)...');
        await fetchSeats(true);
      }, 500);
      
      setTimeout(async () => {
        console.log('🔄 Third refresh after clearing members (1500ms)...');
        await fetchSeats(true);
        // Close modal after the final refresh
        setShowSeatModal(false);
      }, 1500);

      toast.success('All members removed from seat successfully!');
    } catch (error) {
      console.error('Error clearing all members:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to clear all members from seat';
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        errorMessage = serverError.msg || serverError.error || `Server error: ${error.response.status}`;
        console.error('Server error details:', serverError);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection';
        console.error('Network error:', error.request);
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
        console.error('Other error:', error.message);
      }
      
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleSeatClick = (seatId) => {
    const seat = seats[seatId];
    console.log(`🔍 Clicked seat ${seatId}:`, {
      isOccupied: seat?.isOccupied,
      members: seat?.members,
      actualMembersLength: seat?.members?.length || 0
    });
    setSelectedSeat(seatId);
    setSeatDetails(seat);
    setShowSeatModal(true);
    
    // Force refresh the seat data to ensure we have the latest information
    setTimeout(() => {
      if (seats[seatId]) {
        console.log(`🔄 Force updating seat details for ${seatId} after click...`);
        setSeatDetails(seats[seatId]);
      }
    }, 100);
  };

  const handleAssignSeat = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const seatData = {
        seatId: selectedSeat,
        memberId: assignmentForm.memberId,
        memberName: assignmentForm.memberName,
        memberContact: assignmentForm.memberContact,
        shift: assignmentForm.shift
      };

      // Add custom time data if shift is Custom
      if (assignmentForm.shift === 'Custom') {
        seatData.customStartTime = assignmentForm.customStartTime;
        seatData.customEndTime = assignmentForm.customEndTime;
      }

      await axios.post(API_ENDPOINTS.SEATS_ASSIGN, seatData, getAuthConfig());
      
      // Refresh seats data
      await fetchSeats(true);
      
      setShowAssignModal(false);
      setShowSeatModal(false);
      setAssignmentForm({ 
        memberId: '', 
        memberName: '', 
        memberContact: '', 
        shift: '',
        customStartTime: '',
        customEndTime: ''
      });
      toast.success('Seat assigned successfully!');
    } catch (error) {
      console.error('Error assigning seat:', error);
      toast.error('Failed to assign seat. Please try again.');
    }
  };

  // Set up real-time synchronization
  useEffect(() => {
    console.log('🔄 Component mounted, fetching seats with force refresh...');
    fetchSeats(true); // Force refresh to trigger backend cleanup
    
    // Set up periodic synchronization every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Periodic sync: fetching latest seat data...');
      fetchSeats(true);
    }, 30000); // 30 seconds
    
    setSyncInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // Update seat details when seats data changes
  useEffect(() => {
    if (selectedSeat && seats[selectedSeat]) {
      const validMembers = Array.isArray(seats[selectedSeat]?.members) ? seats[selectedSeat].members.filter(m => m.memberId) : [];
      console.log(`🔄 Updating seat details for ${selectedSeat} due to seats data change:`, {
        isOccupied: seats[selectedSeat]?.isOccupied,
        members: seats[selectedSeat]?.members,
        validMembersLength: validMembers.length,
        totalMembersLength: seats[selectedSeat]?.members?.length || 0
      });
      setSeatDetails(seats[selectedSeat]);
    }
  }, [seats, selectedSeat]);

  // Listen for refresh trigger from ViewMembers
  useEffect(() => {
    const handleStorageChange = () => {
      const refreshFlag = localStorage.getItem('refreshSeatManagement');
      if (refreshFlag) {
        console.log('🔄 Refresh triggered from ViewMembers, fetching seats...');
        fetchSeats(true);
        localStorage.removeItem('refreshSeatManagement');
      }
    };

    const refreshAfterMemberChange = (event, reason = 'change') => {
      console.log(`🔄 Member ${reason} event received:`, event.detail);
      // Force a complete component re-render
      setRefreshKey(prev => prev + 1);
      // Immediate refresh with force
      console.log(`🔄 Immediate force fetch after member ${reason}...`);
      fetchSeats(true);
      // Add a small delay to ensure backend has processed the change
      setTimeout(() => {
        console.log(`🔄 Fetching seats after member ${reason} (500ms)...`);
        fetchSeats(true);
      }, 500);
      // Also fetch again after a longer delay to ensure consistency
      setTimeout(() => {
        console.log(`🔄 Second fetch for consistency (1500ms) after member ${reason}...`);
        fetchSeats(true);
      }, 1500);
      // Third fetch after even longer delay
      setTimeout(() => {
        console.log(`🔄 Third fetch for final consistency (3000ms) after member ${reason}...`);
        fetchSeats(true);
      }, 3000);
    };

    const handleMemberDeleted = (event) => {
      refreshAfterMemberChange(event, 'deletion');
    };

    const handleMemberUpdated = (event) => {
      refreshAfterMemberChange(event, 'update');
    };

    // Check for refresh flag on mount and when window gains focus
    handleStorageChange();
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('memberDeleted', handleMemberDeleted);
    window.addEventListener('memberUpdated', handleMemberUpdated);

    return () => {
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('memberDeleted', handleMemberDeleted);
      window.removeEventListener('memberUpdated', handleMemberUpdated);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [syncInterval]);

  const getSeatColor = (seatId) => {
    const seat = seats[seatId];
    if (!seat) return 'bg-slate-600/50 border-slate-500';
    
    // Use actual members length for status determination
    const actualMembers = Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [];
    
    // Debug logging
    console.log(`🎨 Seat ${seatId} color check:`, {
      actualMembers: actualMembers.length,
      isOccupied: seat.isOccupied,
      memberNames: actualMembers.map(m => m.memberName).join(', ') || 'none'
    });
    
    if (actualMembers.length === 0) {
      console.log(`🎨 Seat ${seatId} returning GREEN (available)`);
      return 'bg-emerald-500/80 hover:bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20';
    } else if (actualMembers.length === 1) {
      console.log(`🎨 Seat ${seatId} returning RED (occupied)`);
      return 'bg-red-500/80 hover:bg-red-500 border-red-400 shadow-lg shadow-red-500/20';
    } else {
      console.log(`🎨 Seat ${seatId} returning PURPLE (shared)`);
      return 'bg-purple-500/80 hover:bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/20';
    }
  };

  const getSeatText = (seatId) => {
    const seat = seats[seatId];
    if (!seat) return '';
    
    // Use actual members array for text determination - filter out invalid members
    const actualMembers = Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [];
    
    // Double-check that we have valid data
    if (actualMembers.length === 0) {
      console.log(`🔍 Seat ${seatId}: No valid members, returning empty text`);
      return '';
    }
    
    console.log(`🔍 getSeatText for ${seatId}:`, {
      actualMembers: actualMembers.length,
      firstMemberName: actualMembers[0]?.memberName
    });
    
    if (actualMembers.length === 0) {
      return '';
    } else if (actualMembers.length === 1) {
      const firstLetter = actualMembers[0]?.memberName?.charAt(0) || '';
      console.log(`🔍 Seat ${seatId} showing first letter: "${firstLetter}"`);
      return firstLetter;
    } else {
      return `${actualMembers.length}`;
    }
  };

  const getOccupiedCount = () => {
    return Object.values(seats).filter(seat => {
      const actualMembers = Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [];
      return actualMembers.length > 0;
    }).length;
  };

  const getAvailableCount = () => {
    return Object.values(seats).filter(seat => {
      const actualMembers = Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [];
      return actualMembers.length === 0;
    }).length;
  };

  const getSharedSeatsCount = () => {
    return Object.values(seats).filter(seat => {
      const actualMembers = Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : [];
      return actualMembers.length > 1;
    }).length;
  };

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getShiftDisplay = (member) => {
    if (member.shift === 'Custom' && member.customStartTime && member.customEndTime) {
      return `${member.shift} (${formatTimeDisplay(member.customStartTime)} - ${formatTimeDisplay(member.customEndTime)})`;
    }
    return member.shift;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-xl">
            <svg className="animate-spin h-12 w-12 text-amber-400 mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-300 text-lg font-medium">Loading seat layout...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout key={refreshKey}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Seat Management
              </h1>
              <p className="text-slate-400 mt-2">
                Manage library seating arrangement with shared seats
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
                <span className="text-sm text-slate-300">Available ({getAvailableCount()})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/30"></div>
                <span className="text-sm text-slate-300">Single Occupied ({getOccupiedCount() - getSharedSeatsCount()})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/30"></div>
                <span className="text-sm text-slate-300">Shared ({getSharedSeatsCount()})</span>
              </div>
              <button
                onClick={syncDataWithBackend}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center space-x-2"
                title="Synchronize data with backend"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Sync Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Seats</p>
                <p className="text-2xl font-bold text-white">90</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Available</p>
                <p className="text-2xl font-bold text-emerald-400">{getAvailableCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Occupied</p>
                <p className="text-2xl font-bold text-red-400">{getOccupiedCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Shared Seats</p>
                <p className="text-2xl font-bold text-purple-400">{getSharedSeatsCount()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Library Seating Layout
          </h2>
          
          <div className="space-y-4">
            {['A', 'B', 'C'].map(row => (
              <div key={row} className="flex items-center space-x-4">
                <div className="w-8 text-center font-bold text-amber-400 text-lg">{row}</div>
                <div className="flex space-x-1 flex-wrap gap-1">
                  {Array.from({ length: 30 }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const seat = seats[seatId];
                    const seatText = getSeatText(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 transform hover:scale-105 ${getSeatColor(seatId)} text-white relative`}
                        title={
                          (() => {
                            const actualMembers = Array.isArray(seat?.members) ? seat.members.filter(m => m.memberId) : [];
                            
                            if (actualMembers.length === 0) {
                              return `Seat ${seatId} - Available`;
                            } else if (actualMembers.length === 1) {
                              return `Seat ${seatId} - ${actualMembers[0]?.memberName} (${getShiftDisplay(actualMembers[0])})`;
                            } else {
                              return `Seat ${seatId} - ${actualMembers.length} members sharing`;
                            }
                          })()
                        }
                      >
                        {(() => {
                          const actualMembers = Array.isArray(seat?.members) ? seat.members.filter(m => m.memberId) : [];
                          return actualMembers.length > 0 ? seatText : (i + 1);
                        })()}
                        {(() => {
                          const actualMembers = Array.isArray(seat?.members) ? seat.members.filter(m => m.memberId) : [];
                          return actualMembers.length > 1 ? (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-xs text-black font-bold">{actualMembers.length}</span>
                            </div>
                          ) : null;
                        })()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Legend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded border-2 border-emerald-400"></div>
                <span className="text-slate-300">Available - Click to assign</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-400"></div>
                <span className="text-slate-300">Single occupant - Click to view</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded border-2 border-purple-400 relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-slate-300">Shared seat - Multiple occupants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Details Modal */}
      {showSeatModal && seatDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Seat {selectedSeat}</h2>
              <button
                onClick={() => setShowSeatModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const actualMembers = Array.isArray(seatDetails?.members) ? seatDetails.members.filter(m => m.memberId) : [];
              const hasNoMembers = actualMembers.length === 0;
              console.log(`🔍 Modal check for seat ${selectedSeat}: actualMembers=${actualMembers.length}, hasNoMembers=${hasNoMembers}`);
              
              // Additional debug: log the actual seatDetails object
              console.log(`🔍 Full seatDetails for ${selectedSeat}:`, seatDetails);
              
              return hasNoMembers;
            })() ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <p className="text-emerald-300 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status: Available
                  </p>
                </div>
                <p className="text-slate-300">This seat is available for assignment to a student.</p>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSeatModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-xl text-white hover:bg-slate-600/70 transition-colors"
                  >
                    Close
                  </button>
                  {/* <button
                    onClick={() => {
                      setShowSeatModal(false);
                      setShowAssignModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Assign Seat
                  </button> */}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${
                  (() => {
                    const actualMembers = Array.isArray(seatDetails?.members) ? seatDetails.members.filter(m => m.memberId) : [];
                    return actualMembers.length === 1;
                  })()
                    ? 'bg-red-500/20 border-red-500/30' 
                    : 'bg-purple-500/20 border-purple-500/30'
                }`}>
                  <p className={`font-medium flex items-center ${
                    (() => {
                      const actualMembers = Array.isArray(seatDetails?.members) ? seatDetails.members.filter(m => m.memberId) : [];
                      return actualMembers.length === 1;
                    })() ? 'text-red-300' : 'text-purple-300'
                  }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Status: {(() => {
                      const actualMembers = Array.isArray(seatDetails?.members) ? seatDetails.members.filter(m => m.memberId) : [];
                      return actualMembers.length === 1 ? 'Occupied' : `Shared by ${Math.floor(actualMembers.length/2)} members`;
                    })()}
                  </p>
                </div>

                                 {/* Members List */}
                 <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-lg font-semibold text-white">Assigned Members:</h3>
                     {seatDetails.members && seatDetails.members.length > 0 && (
                       <button
                         onClick={() => setShowClearAllConfirm(true)}
                         className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition-colors"
                       >
                         Clear All
                       </button>
                     )}
                   </div>
                   {(seatDetails.members
                     ? seatDetails.members.filter(
                         (member, idx, arr) =>
                           member.memberId &&
                           arr.findIndex(m => m.memberId === member.memberId) === idx
                       )
                     : []
                   ).map((member, index) => (
                     <div key={member.memberId || index} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/30">
                       <div className="flex justify-between items-start mb-3">
                         <div className="flex-1">
                           <h4 className="text-white font-medium">{member.memberName}</h4>
                           <p className="text-slate-400 text-sm">{member.memberContact}</p>
                         </div>
                         <button
                           onClick={() => {
                             setMemberToRemove(member);
                             setShowRemoveMemberConfirm(true);
                           }}
                           className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
                         >
                           Remove
                         </button>
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center space-x-2">
                           <span className="text-slate-400 text-sm">Shift:</span>
                           <span className="text-white text-sm font-medium">{getShiftDisplay(member)}</span>
                         </div>
                         {member.occupiedDate && (
                           <div className="flex items-center space-x-2">
                             <span className="text-slate-400 text-sm">Assigned:</span>
                             <span className="text-white text-sm">{new Date(member.occupiedDate).toLocaleDateString()}</span>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSeatModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-xl text-white hover:bg-slate-600/70 transition-colors"
                  >
                    Close
                  </button>
                  {/* <button
                    onClick={() => {
                      setShowSeatModal(false);
                      setShowAssignModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Add Another Member
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assign Seat Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Assign Seat {selectedSeat}</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignmentForm({ 
                    memberId: '', 
                    memberName: '', 
                    memberContact: '', 
                    shift: '',
                    customStartTime: '',
                    customEndTime: ''
                  });
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Member ID</label>
                <input
                  type="text"
                  value={assignmentForm.memberId}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, memberId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Enter member ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Member Name</label>
                <input
                  type="text"
                  value={assignmentForm.memberName}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, memberName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Enter member name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contact Number</label>
                <input
                  type="text"
                  value={assignmentForm.memberContact}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, memberContact: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Study Plan</label>
                <select
                  value={assignmentForm.shift}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, shift: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                >
                  <option value="">Select Study Plan</option>
                  <option value="Half Day (8 AM - 2 PM)">Half Day (8 AM - 2 PM)</option>
                  <option value="Half Day (2 PM - 8 PM)">Half Day (2 PM - 8 PM)</option>
                  <option value="Full Day (8 AM - 8 PM)">Full Day (8 AM - 8 PM)</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {assignmentForm.shift === 'Custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={assignmentForm.customStartTime}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, customStartTime: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={assignmentForm.customEndTime}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, customEndTime: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignmentForm({ 
                      memberId: '', 
                      memberName: '', 
                      memberContact: '', 
                      shift: '',
                      customStartTime: '',
                      customEndTime: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-xl text-white hover:bg-slate-600/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSeat}
                  disabled={!assignmentForm.memberName || !assignmentForm.memberContact || !assignmentForm.shift}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
                 </div>
       )}

       {/* Clear All Confirmation Modal */}
       {showClearAllConfirm && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-white">Clear All Members</h2>
               <button
                 onClick={() => setShowClearAllConfirm(false)}
                 className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="space-y-4">
               <div className="p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                 <p className="text-orange-300 font-medium flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                   Warning: This action cannot be undone
                 </p>
               </div>
               
               <p className="text-slate-300">
                 Are you sure you want to remove all {seatDetails?.members?.length || 0} member(s) from Seat {selectedSeat}? 
                 This will make the seat available for new assignments.
               </p>

               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={() => setShowClearAllConfirm(false)}
                   className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-xl text-white hover:bg-slate-600/70 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     setShowClearAllConfirm(false);
                     handleClearAllMembers();
                   }}
                   className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
                 >
                   Clear All
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Remove Member Confirmation Modal */}
       {showRemoveMemberConfirm && memberToRemove && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-white">Remove Member</h2>
               <button
                 onClick={() => {
                   setShowRemoveMemberConfirm(false);
                   setMemberToRemove(null);
                 }}
                 className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="space-y-4">
               <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                 <p className="text-red-300 font-medium flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                   Remove Member from Seat
                 </p>
               </div>
               
               <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/30">
                 <h4 className="text-white font-medium">{memberToRemove.memberName}</h4>
                 <p className="text-slate-400 text-sm">{memberToRemove.memberContact}</p>
                 <p className="text-slate-400 text-sm mt-1">Seat: {selectedSeat}</p>
               </div>
               
               <p className="text-slate-300">
                 Are you sure you want to remove {memberToRemove.memberName} from Seat {selectedSeat}? 
                 This action cannot be undone.
               </p>

               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={() => {
                     setShowRemoveMemberConfirm(false);
                     setMemberToRemove(null);
                   }}
                   className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-xl text-white hover:bg-slate-600/70 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     setShowRemoveMemberConfirm(false);
                     handleVacateSeat(memberToRemove.memberId);
                     setMemberToRemove(null);
                   }}
                   className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                 >
                   Remove
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </AdminLayout>
   );
 };

export default SeatManagement;