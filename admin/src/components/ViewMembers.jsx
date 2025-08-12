import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS, getAuthConfig } from '../config/api';

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, member, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    studentName: '',
    contactNumber: '',
    amount: '',
    paymentMode: '',
    paymentProvider: '',
    transactionId: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const paymentProviders = {
    'Online': ['Google Pay', 'Amazon Pay', 'Paytm', 'PhonePe', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card'],
    'Cash': [],
    'Card': ['Credit Card', 'Debit Card']
  };

  useEffect(() => {
    if (member) {
      setPaymentData({
        studentName: member.name,
        contactNumber: member.contact,
        amount: member.monthlyFees || '',
        paymentMode: '',
        paymentProvider: '',
        transactionId: '',
        notes: ''
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const paymentPayload = {
        ...paymentData,
        memberId: member._id,
        memberName: member.name,
        memberContact: member.contact
      };

      await axios.post(API_ENDPOINTS.PAYMENTS, paymentPayload, getAuthConfig());

      toast.success('Payment submitted successfully!');
      onPaymentSuccess();
      onClose();
      setPaymentData({
        studentName: '',
        contactNumber: '',
        amount: '',
        paymentMode: '',
        paymentProvider: '',
        transactionId: '',
        notes: ''
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Submit Fees Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Student Name</label>
            <input
              type="text"
              value={paymentData.studentName}
              onChange={(e) => setPaymentData({...paymentData, studentName: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
            <input
              type="text"
              value={paymentData.contactNumber}
              onChange={(e) => setPaymentData({...paymentData, contactNumber: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Payment Mode</label>
            <select
              value={paymentData.paymentMode}
              onChange={(e) => setPaymentData({...paymentData, paymentMode: e.target.value, paymentProvider: ''})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Card">Card</option>
            </select>
          </div>

          {paymentData.paymentMode && paymentProviders[paymentData.paymentMode].length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Provider</label>
              <select
                value={paymentData.paymentProvider}
                onChange={(e) => setPaymentData({...paymentData, paymentProvider: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Provider</option>
                {paymentProviders[paymentData.paymentMode].map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
          )}

          {paymentData.paymentMode === 'Online' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Transaction ID</label>
              <input
                type="text"
                value={paymentData.transactionId}
                onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea
              value={paymentData.notes}
              onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Member Modal Component
const EditMemberModal = ({ isOpen, onClose, member, onEditSuccess }) => {
  const [memberData, setMemberData] = useState({
    name: '',
    fatherName: '',
    contact: '',
    aadhar: '',
    shift: '',
    monthlyFees: '',
    seat: '',
    customStartTime: '',
    customEndTime: ''
  });
  const [loading, setLoading] = useState(false);

  const shifts = [
    'Half Day (8 AM - 2 PM)',
    'Half Day (2 PM - 8 PM)',
    'Full Day (8 AM - 8 PM)',
    'Custom'
  ];

  const buildTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = buildTimeOptions();

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getShiftDisplay = (member) => {
    if (member?.shift === 'Custom' && member?.customStartTime && member?.customEndTime) {
      return `${member.shift} (${formatTimeDisplay(member.customStartTime)} - ${formatTimeDisplay(member.customEndTime)})`;
    }
    if (!member?.shift) return 'Not Set';
    return member.shift.replace('Half Day ', '').replace('Full Day ', '');
  };

  const validateTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return { isValid: false, message: '' };
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) {
      return { isValid: false, message: 'End time must be after start time' };
    }
    const diffHours = (end - start) / (1000 * 60 * 60);
    if (diffHours > 24) {
      return { isValid: false, message: 'Time range cannot exceed 24 hours' };
    }
    return { isValid: true, message: '' };
  };

  useEffect(() => {
    if (member) {
      setMemberData({
        name: member.name || '',
        fatherName: member.fatherName || '',
        contact: member.contact || '',
        aadhar: member.aadhar || '',
        shift: member.shift || '',
        monthlyFees: member.monthlyFees || '',
        seat: member.seat || '',
        customStartTime: member.customStartTime || '',
        customEndTime: member.customEndTime || ''
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (memberData.shift === 'Custom') {
        const validation = validateTimeRange(memberData.customStartTime, memberData.customEndTime);
        if (!memberData.customStartTime || !memberData.customEndTime) {
          toast.error('Please select both start and end time for Custom plan');
          setLoading(false);
          return;
        }
        if (!validation.isValid) {
          toast.error(validation.message || 'Invalid time range');
          setLoading(false);
          return;
        }
      } else {
        // Clear custom times when not using Custom shift
        if (memberData.customStartTime || memberData.customEndTime) {
          setMemberData({ ...memberData, customStartTime: '', customEndTime: '' });
        }
      }
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }
      
      const response = await axios.put(API_ENDPOINTS.MEMBER_BY_ID(member._id), memberData, getAuthConfig());
      toast.success('Member updated successfully!');
      onEditSuccess();
      onClose();

      // Trigger SeatManagement to refresh immediately
      try {
        localStorage.setItem('refreshSeatManagement', Date.now().toString());
        window.dispatchEvent(new CustomEvent('memberUpdated', {
          detail: { memberId: member._id }
        }));
      } catch {}
    } catch (error) {
      console.error('Edit member error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || 'Failed to update member';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={memberData.name}
              onChange={(e) => setMemberData({...memberData, name: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Father's Name</label>
            <input
              type="text"
              value={memberData.fatherName}
              onChange={(e) => setMemberData({...memberData, fatherName: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
            <input
              type="tel"
              value={memberData.contact}
              onChange={(e) => setMemberData({...memberData, contact: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Aadhar Number</label>
            <input
              type="text"
              value={memberData.aadhar}
              onChange={(e) => setMemberData({...memberData, aadhar: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Study Plan</label>
            <select
              value={memberData.shift}
              onChange={(e) => {
                const newShift = e.target.value;
                setMemberData({
                  ...memberData,
                  shift: newShift,
                  customStartTime: newShift === 'Custom' ? memberData.customStartTime : '',
                  customEndTime: newShift === 'Custom' ? memberData.customEndTime : ''
                });
              }}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Study Plan</option>
              {shifts.map(shift => (
                <option key={shift} value={shift}>{shift}</option>
              ))}
            </select>
          </div>

          {memberData.shift === 'Custom' && (
            <div className="backdrop-blur-xl bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Custom Time Selection
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <select
                    value={memberData.customStartTime}
                    onChange={(e) => setMemberData({ ...memberData, customStartTime: e.target.value })}
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select Start Time
                    </option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <select
                    value={memberData.customEndTime}
                    onChange={(e) => setMemberData({ ...memberData, customEndTime: e.target.value })}
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select End Time
                    </option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {memberData.customStartTime && memberData.customEndTime && (
                <div className="mt-3 p-3 backdrop-blur-xl bg-slate-800/30 border border-slate-600/40 rounded-md">
                  <p className="text-xs text-blue-300">
                    <strong>Selected Time:</strong> {formatTimeDisplay(memberData.customStartTime)} - {formatTimeDisplay(memberData.customEndTime)}
                  </p>
                  {(() => {
                    const validation = validateTimeRange(memberData.customStartTime, memberData.customEndTime);
                    if (!validation.isValid && validation.message) {
                      return (
                        <p className="text-xs text-red-400 mt-1">{validation.message}</p>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Fees (₹)</label>
            <input
              type="number"
              value={memberData.monthlyFees}
              onChange={(e) => setMemberData({...memberData, monthlyFees: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Seat Number</label>
            <input
              type="text"
              value={memberData.seat}
              onChange={(e) => setMemberData({...memberData, seat: e.target.value})}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter seat number"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, memberName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.337 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">Delete Member</h3>
          <p className="text-sm text-gray-400 mb-4">
            Are you sure you want to delete <span className="font-semibold text-white">{memberName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);
  
  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Real-time synchronization
  const [syncInterval, setSyncInterval] = useState(null);

  const getShiftDisplay = (member) => {
    if (member?.shift === 'Custom' && member?.customStartTime && member?.customEndTime) {
      return `${member.shift} (${member.customStartTime} - ${member.customEndTime})`;
    }
    if (!member?.shift) return 'Not Set';
    return member.shift.replace('Half Day ', '').replace('Full Day ', '');
  };

  useEffect(() => {
    console.log('🔄 ViewMembers: Initial fetch...');
    fetchMembers();
    
    // Set up periodic synchronization every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 ViewMembers: Periodic sync...');
      fetchMembers();
    }, 30000); // 30 seconds
    
    setSyncInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 ViewMembers: Tab became visible, refreshing...');
        fetchMembers();
      }
    };

    const handleFocus = () => {
      console.log('🔄 ViewMembers: Window gained focus, refreshing...');
      fetchMembers();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchMembers = async () => {
    try {
      console.log('🔄 ViewMembers: Fetching members from backend...');
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.MEMBERS, getAuthConfig());
      
      console.log('🔄 ViewMembers: Received members data:', response.data.length, 'members');
      setMembers(response.data);
    } catch (err) {
      console.error('Error fetching members:', err);
      toast.error('Failed to fetch members data');
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive data synchronization function
  const syncDataWithBackend = async () => {
    try {
      console.log('🔄 ViewMembers: Starting comprehensive data synchronization...');
      toast.loading('Synchronizing data with backend...', { id: 'sync' });
      
      const response = await axios.post(API_ENDPOINTS.SEATS_SYNC, {}, getAuthConfig());
      
      console.log('🔄 ViewMembers: Sync response:', response.data);
      
      if (response.data.success) {
        const stats = response.data.stats;
        const cleanup = response.data.cleanupDetails;
        
        console.log('🔄 ViewMembers: Sync completed successfully:', stats);
        
        // Show success message with details
        toast.success(
          `Data synchronized successfully! 
          ${cleanup.seatsUpdated > 0 ? `Fixed ${cleanup.seatsUpdated} seats. ` : ''}
          ${cleanup.memberSeatInconsistencies > 0 ? `Found ${cleanup.memberSeatInconsistencies} inconsistencies.` : ''}`,
          { id: 'sync' }
        );
        
        // Force refresh the members data
        await fetchMembers();
        
        // Also trigger a refresh for SeatManagement if it's open
        localStorage.setItem('refreshSeatManagement', Date.now().toString());
        
      } else {
        toast.error('Data synchronization failed', { id: 'sync' });
      }
      
    } catch (error) {
      console.error('Error in data synchronization:', error);
      toast.error('Failed to synchronize data with backend', { id: 'sync' });
    }
  };

  const isStudentActive = (student) => {
    if (!student.feesPaidTill) return false;
    const today = new Date();
    const feesPaidTill = new Date(student.feesPaidTill);
    return feesPaidTill >= today;
  };

  const getDaysLeft = (student) => {
    if (!student.feesPaidTill) return null;
    const today = new Date();
    const feesPaidTill = new Date(student.feesPaidTill);
    const diffTime = feesPaidTill - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'joiningDate':
        aValue = new Date(a.joiningDate);
        bValue = new Date(b.joiningDate);
        break;
      case 'feesPaidTill':
        aValue = a.feesPaidTill ? new Date(a.feesPaidTill) : new Date(0);
        bValue = b.feesPaidTill ? new Date(b.feesPaidTill) : new Date(0);
        break;
      case 'monthlyFees':
        aValue = parseFloat(a.monthlyFees) || 0;
        bValue = parseFloat(b.monthlyFees) || 0;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredMembers = sortedMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.contact.includes(searchTerm) ||
                         member.aadhar.includes(searchTerm);
    const matchesShift = filterShift === '' || member.shift === filterShift;
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = isStudentActive(member);
    } else if (statusFilter === 'inactive') {
      matchesStatus = !isStudentActive(member);
    }
    
    return matchesSearch && matchesShift && matchesStatus;
  });

  // Pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleFeesSubmit = (member) => {
    setSelectedMember(member);
    setIsPaymentModalOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(API_ENDPOINTS.MEMBER_BY_ID(selectedMember._id), getAuthConfig());
      toast.success(`Member "${selectedMember.name}" deleted successfully!`);
      
      // Refresh members list
      await fetchMembers();
      
      // Trigger seat management refresh by setting a flag in localStorage
      localStorage.setItem('refreshSeatManagement', Date.now().toString());
      
      // Also dispatch a custom event to ensure immediate refresh
      window.dispatchEvent(new CustomEvent('memberDeleted', {
        detail: { memberId: selectedMember._id, memberName: selectedMember.name }
      }));

      // Force a second refresh after a longer delay to ensure backend has processed
      setTimeout(() => {
        console.log('🔄 Forcing second seat refresh...');
        window.dispatchEvent(new CustomEvent('memberDeleted', {
          detail: { memberId: selectedMember._id, memberName: selectedMember.name }
        }));
      }, 1000);
      
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete member error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to delete member';
      
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
      
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchMembers();
  };

  const handleEditSuccess = () => {
    fetchMembers();
  };

  const handleWhatsAppReminder = async (member) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(API_ENDPOINTS.WHATSAPP_SEND_REMINDER, {
        studentNumber: member.contact,
        studentName: member.name
      }, getAuthConfig());

      if (response.data.success) {
        toast.success(`WhatsApp reminder sent to ${member.name} successfully!`);
      } else {
        toast.error('Failed to send WhatsApp reminder');
      }
    } catch (error) {
      console.error('WhatsApp reminder error:', error);
      toast.error('Failed to send WhatsApp reminder. Please try again.');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Father Name', 'Contact', 'Aadhar', 'Shift', 'Seat', 'Monthly Fees', 'Joining Date', 'Fees Paid Till', 'Status'],
      ...filteredMembers.map(member => [
        member.name,
        member.fatherName,
        member.contact,
        member.aadhar,
        member.shift,
        member.seat || '',
        member.monthlyFees,
        formatDate(member.joiningDate),
        member.feesPaidTill ? formatDate(member.feesPaidTill) : '',
        isStudentActive(member) ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">View Students</h1>
            <p className="text-gray-400">Manage and view all study library students</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={syncDataWithBackend}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
              title="Synchronize data with backend"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Sync Data</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchMembers}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>


          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-900">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-white">{members.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-900">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Active Students</p>
                  <p className="text-2xl font-bold text-white">
                    {members.filter(member => isStudentActive(member)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-900">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Inactive Students</p>
                  <p className="text-2xl font-bold text-white">
                    {members.filter(member => !isStudentActive(member)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-900">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Due Soon</p>
                  <p className="text-2xl font-bold text-white">
                    {members.filter(member => {
                      const daysLeft = getDaysLeft(member);
                      return daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Students</label>
                <input
                  type="text"
                  placeholder="Search by name, contact, or Aadhar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Study Plan</label>
                <select
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Plans</option>
                  <option value="Half Day (8 AM - 2 PM)">Half Day (8 AM - 2 PM)</option>
                  <option value="Half Day (2 PM - 8 PM)">Half Day (2 PM - 8 PM)</option>
                  <option value="Full Day (8 AM - 8 PM)">Full Day (8 AM - 8 PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active Students</option>
                  <option value="inactive">Inactive Students</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="joiningDate">Joining Date</option>
                  <option value="feesPaidTill">Fees Paid Till</option>
                  <option value="monthlyFees">Monthly Fees</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Students ({filteredMembers.length})
              </h2>
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredMembers.length)} of {filteredMembers.length}
              </div>
            </div>
            
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No students found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {searchTerm || filterShift || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new student.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th 
                          className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Member</span>
                            {sortBy === 'name' && (
                              <svg className={`w-3 h-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Shift
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Seat No
                        </th>
                        <th 
                          className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                          onClick={() => handleSort('joiningDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Joining Date</span>
                            {sortBy === 'joiningDate' && (
                              <svg className={`w-3 h-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                          onClick={() => handleSort('feesPaidTill')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Fees Paid Till</span>
                            {sortBy === 'feesPaidTill' && (
                              <svg className={`w-3 h-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Days Left
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-600">
                      {currentMembers.map((member) => (
                        <tr key={member._id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-3 py-1.5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-2">
                                <div className="text-base font-medium text-white truncate max-w-24">{member.name}</div>
                                <div className="text-sm text-gray-400 truncate max-w-24">{member.fatherName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="text-base text-white truncate max-w-20">{member.contact}</div>
                            <div className="text-sm text-gray-400 truncate max-w-20">{member.aadhar}</div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`inline-flex px-1.5 py-0.5 text-sm font-semibold rounded-full ${
                              member.shift?.includes('8 AM - 2 PM') 
                                ? 'bg-green-900 text-green-200' 
                                : member.shift?.includes('2 PM - 8 PM')
                                ? 'bg-orange-900 text-orange-200'
                                : 'bg-blue-900 text-blue-200'
                            }`}>
                              {getShiftDisplay(member)}
                            </span>
                          </td>
                          <td className="px-3 py-1.5">
                            {member.seat ? (
                              <span className="inline-flex px-1.5 py-0.5 text-sm font-semibold rounded-full bg-blue-900 text-blue-200">
                                {member.seat}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">Not Assigned</span>
                            )}
                          </td>
                          <td className="px-3 py-1.5 text-base text-white">
                            {formatDate(member.joiningDate)}
                          </td>
                          <td className="px-3 py-1.5 text-base text-white">
                            {member.feesPaidTill ? formatDate(member.feesPaidTill) : 'Not Set'}
                          </td>
                          <td className="px-3 py-1.5">
                            {(() => {
                              const daysLeft = getDaysLeft(member);
                              if (daysLeft === null) {
                                return <span className="text-gray-400 text-sm">Not Set</span>;
                              }
                              const isOverdue = daysLeft < 0;
                              const isDueSoon = daysLeft <= 7 && daysLeft >= 0;
                              return (
                                <span className={`inline-flex px-1.5 py-0.5 text-sm font-semibold rounded-full ${
                                  isOverdue 
                                    ? 'bg-red-900 text-red-200' 
                                    : isDueSoon
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-green-900 text-green-200'
                                }`}>
                                  {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`inline-flex px-1.5 py-0.5 text-sm font-semibold rounded-full ${
                              isStudentActive(member)
                                ? 'bg-green-900 text-green-200'
                                : 'bg-red-900 text-red-200'
                            }`}>
                              {isStudentActive(member) ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-sm font-medium">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleFeesSubmit(member)}
                                className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                                title="Submit Fees"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleWhatsAppReminder(member)}
                                className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-green-500 hover:bg-green-600 transition-colors"
                                title="Send WhatsApp Reminder"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleEditMember(member)}
                                className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                title="Edit Member"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteMember(member)}
                                className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                                title="Delete Member"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-300">
                          Showing <span className="font-medium">{indexOfFirstMember + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(indexOfLastMember, filteredMembers.length)}</span> of{' '}
                          <span className="font-medium">{filteredMembers.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = pageNumber === currentPage;
                            
                            // Show first page, last page, current page, and pages around current page
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    isCurrentPage
                                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            } else if (
                              pageNumber === currentPage - 2 ||
                              pageNumber === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={pageNumber}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        member={selectedMember}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={selectedMember}
        onEditSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        memberName={selectedMember?.name}
        loading={deleteLoading}
      />
      </div>
    </AdminLayout>
  );
};

export default ViewMembers;