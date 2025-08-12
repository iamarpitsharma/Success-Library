import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS, getAuthConfig } from '../config/api';

const InputField = ({ label, name, value, onChange, maxLength, readOnly = false, type = "text", min, max, step }) => (
  <div className="flex flex-col">
    <label className="text-slate-300 font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      readOnly={readOnly}
      min={min}
      max={max}
      step={step}
      className={`p-3 backdrop-blur-xl bg-slate-800/30 border border-slate-600/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-slate-400 transition-all duration-300 ${
        readOnly ? 'bg-slate-700/30 text-slate-400' : 'hover:border-slate-500/50 hover:bg-slate-800/40'
      }`}
    />
    {maxLength && type === "text" && (
      <span className="text-slate-400 text-xs self-end mt-1">
        {value.length}/{maxLength}
      </span>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-slate-300 font-medium mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="p-3 backdrop-blur-xl bg-slate-800/30 border border-slate-600/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-800/40"
    >
      <option value="" disabled className="bg-slate-800 text-slate-400">{label}</option>
      {options.map(option => (
        <option key={option} value={option} className="bg-slate-800 text-white">{option}</option>
      ))}
    </select>
  </div>
);

const TimeField = ({ label, name, value, onChange }) => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <div className="flex flex-col">
      <label className="text-slate-300 font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="p-3 backdrop-blur-xl bg-slate-800/30 border border-slate-600/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-800/40"
      >
        <option value="" disabled className="bg-slate-800 text-slate-400">Select {label}</option>
        {timeOptions.map(time => (
          <option key={time} value={time} className="bg-slate-800 text-white">{time}</option>
        ))}
      </select>
    </div>
  );
};

const AddMember = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    contact: '',
    aadhar: '',
    address: '',
    gender: 'Male',
    shift: '',
    timing: '',
    seat: '',
    joiningDate: '2025-03-31',
    feesPaidTill: '2025-04-30',
    profilePicture: null,
    customStartTime: '',
    customEndTime: '',
  });

  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [feesPaid, setFeesPaid] = useState(false);
  const [feesData, setFeesData] = useState({
    studentName: '',
    contactNumber: '',
    amount: '',
    paymentMode: '',
    paymentProvider: '',
    transactionId: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);

  const paymentProviders = {
    'Online': ['Google Pay', 'Amazon Pay', 'Paytm', 'PhonePe', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card'],
    'Cash': [],
    'Card': ['Credit Card', 'Debit Card']
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: '👤' },
    { number: 2, title: 'Study Plan & Seat', icon: '📚' },
    { number: 3, title: 'Payment & Final', icon: '💳' }
  ];

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    return timeString;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'shift' && value !== 'Custom') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customStartTime: '',
        customEndTime: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.fatherName && formData.contact && formData.aadhar && formData.address;
      case 2:
        return formData.shift && formData.timing;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFeesSubmit = () => {
    setFeesData({
      studentName: formData.name,
      contactNumber: formData.contact,
      amount: '',
      paymentMode: '',
      paymentProvider: '',
      transactionId: '',
      notes: ''
    });
    setIsFeesModalOpen(true);
  };

  const handleFeesModalClose = () => {
    setIsFeesModalOpen(false);
    setFeesData({
      studentName: '',
      contactNumber: '',
      amount: '',
      paymentMode: '',
      paymentProvider: '',
      transactionId: '',
      notes: ''
    });
  };

  const handleSeatSelect = async () => {
    try {
      // Validate that shift is selected before checking seats
      if (!formData.shift) {
        toast.error('Please select a study plan first');
        return;
      }

      // Show loading state
      setIsSeatModalOpen(true);
      setSeatLoading(true);
      
      // Prepare query parameters for time-based seat availability
      const params = new URLSearchParams({
        shift: formData.shift
      });
      
      // Add custom time parameters if shift is Custom
      if (formData.shift === 'Custom') {
        if (!formData.customStartTime || !formData.customEndTime) {
          toast.error('Please set custom start and end times');
          setIsSeatModalOpen(false);
          setSeatLoading(false);
          return;
        }
        params.append('customStartTime', formData.customStartTime);
        params.append('customEndTime', formData.customEndTime);
      }

      // Fetch fresh seat data from backend
      const response = await axios.get(`${API_ENDPOINTS.SEATS_AVAILABLE}?${params}`, getAuthConfig());
      
      // Clean and validate the seat data before setting it
      const cleanedSeats = response.data.map(seat => ({
        ...seat,
        members: Array.isArray(seat.members) ? seat.members.filter(m => m.memberId) : []
      }));
      
      console.log('🔍 Fresh available seats data:', {
        totalSeats: response.data.length,
        seatsWithValidMembers: cleanedSeats.filter(seat => seat.members.length > 0).length,
        seatsWithoutMembers: cleanedSeats.filter(seat => seat.members.length === 0).length,
        sampleSeat: cleanedSeats[0]
      });
      
      setAvailableSeats(cleanedSeats);
      setSeatLoading(false);
    } catch (error) {
      console.error('Error fetching available seats:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to fetch available seats';
      toast.error(errorMessage);
      setIsSeatModalOpen(false);
      setSeatLoading(false);
    }
  };

  const handleSeatAssignment = async (seatId) => {
    try {
      // Validate form data before proceeding
      if (!formData.name || !formData.contact || !formData.shift) {
        toast.error('Please fill in all required fields (name, contact, shift) before selecting a seat');
        return;
      }
      
      // Don't make a temporary assignment - just store the seat selection
      // The actual assignment will happen when the student is registered
      console.log('🔍 Selecting seat:', seatId, 'for student:', formData.name);
      
      setFormData(prev => ({ ...prev, seat: seatId }));
      setIsSeatModalOpen(false);
      toast.success(`Seat ${seatId} selected! It will be assigned when you complete registration.`);
    } catch (error) {
      console.error('Error selecting seat:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to select seat. Please try again.';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    
    if (!feesData.studentName || !feesData.contactNumber || !feesData.amount || !feesData.paymentMode) {
      toast.error('Please fill in all required fields');
      setPaymentLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const paymentPayload = {
        ...feesData,
        amount: Number(feesData.amount),
        memberId: null,
        memberName: feesData.studentName,
        memberContact: feesData.contactNumber
      };

      await axios.post(API_ENDPOINTS.PAYMENTS, paymentPayload, getAuthConfig());

      toast.success('Payment submitted successfully!');
      setFeesPaid(true);
      handleFeesModalClose();
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.msg || 'Payment failed. Please try again.';
      toast.error(`Payment failed: ${errorMessage}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.fatherName || !formData.contact || !formData.aadhar || 
        !formData.address || !formData.shift || !formData.timing) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(API_ENDPOINTS.MEMBERS, formData, getAuthConfig());

      if (formData.seat && response.data._id) {
        try {
          console.log('🔍 Final seat assignment for member:', response.data._id, 'to seat:', formData.seat);
          
          // Prepare seat assignment data with time information
          const seatData = {
            seatId: formData.seat,
            memberId: response.data._id,
            memberName: response.data.name,
            memberContact: response.data.contact,
            shift: response.data.shift
          };
          
          // Add custom time data if shift is Custom
          if (response.data.shift === 'Custom') {
            seatData.customStartTime = formData.customStartTime;
            seatData.customEndTime = formData.customEndTime;
          }
          
          console.log('🔍 Final seat assignment data:', seatData);
          
          const seatResponse = await axios.post(API_ENDPOINTS.SEATS_ASSIGN, seatData, getAuthConfig());
          console.log('🔍 Final seat assignment response:', seatResponse.data);
          
          toast.success(`Student registered and seat ${formData.seat} assigned successfully!`);
        } catch (seatUpdateError) {
          console.error('Error updating seat with member ID:', seatUpdateError);
          console.error('Seat error response:', seatUpdateError.response?.data);
          toast.error(`Student registered but seat assignment failed: ${seatUpdateError.response?.data?.msg || seatUpdateError.message}`);
        }
      } else {
        toast.success('Student registered successfully!');
      }
      setFormData({
        name: '',
        fatherName: '',
        contact: '',
        aadhar: '',
        address: '',
        gender: 'Male',
        shift: '',
        timing: '',
        seat: '',
        joiningDate: '2025-03-31',
        feesPaidTill: '2025-04-30',
        profilePicture: null,
        customStartTime: '',
        customEndTime: '',
      });
      setFeesPaid(false);
      setCurrentStep(1);
    } catch (err) {
      console.error('Error adding student:', err);
      toast.error(err.response?.data?.msg || 'Error adding student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 relative">
        {/* Enhanced floating background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/4 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/4 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-emerald-500/3 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Header */}
        <header className="relative z-20 backdrop-blur-3xl bg-slate-900/30 border-b border-slate-700/30 shadow-xl">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Add New Student</h1>
                <p className="text-sm sm:text-base text-slate-400">Register a new student for library access</p>
              </div>
            </div>
          </div>
        </header>

        {/* Step Progress Bar */}
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
                      : 'bg-slate-800/30 border-slate-600/40 text-slate-400'
                  }`}>
                    <span className="text-base sm:text-lg font-bold">{step.number}</span>
                    {currentStep > step.number && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                      currentStep >= step.number ? 'text-white' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </h3>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 lg:w-24 h-0.5 mx-4 lg:mx-8 transition-colors duration-300 ${
                      currentStep > step.number ? 'bg-cyan-400/50' : 'bg-slate-600/40'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-3xl bg-slate-800/20 border border-slate-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Personal Information</h2>
                    <p className="text-sm sm:text-base text-slate-400">Enter student's basic details</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-600/40 flex items-center justify-center backdrop-blur-xl">
                          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center cursor-pointer hover:bg-cyan-500/30 transition-all duration-300">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex space-x-2 sm:space-x-3">
                        <button type="button" className="px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                          Gallery
                        </button>
                        <button type="button" className="px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                          Camera
                        </button>
                      </div>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Name *" name="name" value={formData.name} onChange={handleChange} maxLength="25" />
                        <InputField label="Father Name *" name="fatherName" value={formData.fatherName} onChange={handleChange} maxLength="25" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Contact *" name="contact" value={formData.contact} onChange={handleChange} maxLength="10" />
                        <InputField label="Aadhar *" name="aadhar" value={formData.aadhar} onChange={handleChange} maxLength="14" />
                      </div>
                      <InputField label="Address *" name="address" value={formData.address} onChange={handleChange} maxLength="30" />
                      
                      {/* Gender Selection */}
                      <div className="space-y-3">
                        <label className="text-slate-300 font-medium">Gender *</label>
                        <div className="flex space-x-6">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="gender" 
                              value="Male" 
                              checked={formData.gender === 'Male'} 
                              onChange={handleChange} 
                              className="w-4 h-4 text-cyan-400 bg-slate-800/50 border-slate-600/40 focus:ring-cyan-400/50 focus:ring-2"
                            />
                            <span className="ml-2 text-slate-300">Male</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="gender" 
                              value="Female" 
                              checked={formData.gender === 'Female'} 
                              onChange={handleChange} 
                              className="w-4 h-4 text-cyan-400 bg-slate-800/50 border-slate-600/40 focus:ring-cyan-400/50 focus:ring-2"
                            />
                            <span className="ml-2 text-slate-300">Female</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Study Plan & Seat */}
              {currentStep === 2 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Study Plan & Seat</h2>
                    <p className="text-sm sm:text-base text-slate-400">Choose study plan and assign seat</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <SelectField 
                      label="Study Plan *" 
                      name="shift" 
                      value={formData.shift} 
                      onChange={handleChange} 
                      options={['Half Day (8 AM - 2 PM)', 'Half Day (2 PM - 8 PM)', 'Full Day (8 AM - 8 PM)', 'Custom']} 
                    />
                    <SelectField 
                      label="Duration *" 
                      name="timing" 
                      value={formData.timing} 
                      onChange={handleChange} 
                      options={['1 Month', '3 Months', '6 Months', '1 Year']} 
                    />
                  </div>

                  {/* Custom Time Selection */}
                  {formData.shift === 'Custom' && (
                    <div className="backdrop-blur-xl bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Custom Time Selection
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <TimeField 
                          label="Start Time" 
                          name="customStartTime" 
                          value={formData.customStartTime} 
                          onChange={handleChange} 
                        />
                        <TimeField 
                          label="End Time" 
                          name="customEndTime" 
                          value={formData.customEndTime} 
                          onChange={handleChange} 
                        />
                      </div>
                      {formData.customStartTime && formData.customEndTime && (
                        <div className="mt-4 p-4 backdrop-blur-xl bg-slate-800/30 border border-slate-600/40 rounded-xl">
                          <p className="text-sm text-blue-400">
                            <strong>Selected Time:</strong> {formatTimeDisplay(formData.customStartTime)} - {formatTimeDisplay(formData.customEndTime)}
                          </p>
                          {(() => {
                            const validation = validateTimeRange(formData.customStartTime, formData.customEndTime);
                            if (!validation.isValid && validation.message) {
                              return (
                                <p className="text-sm text-red-400 mt-2">
                                  ⚠️ {validation.message}
                                </p>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seat Selection Button */}
                  <div className="flex justify-center">
                    <button 
                      type="button" 
                      onClick={handleSeatSelect}
                      className={`group relative px-8 py-4 rounded-2xl transition-all duration-300 ${
                        formData.seat 
                          ? 'backdrop-blur-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 cursor-default' 
                          : 'backdrop-blur-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:scale-105'
                      }`}
                      disabled={formData.seat}
                    >
                      <div className="flex items-center space-x-3">
                        {formData.seat ? (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg font-medium">Seat {formData.seat} Selected</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2H6a2 2 0 002-2V6" />
                            </svg>
                            <span className="text-lg font-medium">Select Seat</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment & Final */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment & Final Details</h2>
                    <p className="text-slate-400">Complete payment and finalize registration</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <InputField label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} type="date" />
                    <InputField label="Fees Paid Till" name="feesPaidTill" value={formData.feesPaidTill} onChange={handleChange} type="date" />
                    <InputField label="Seat Number" name="seat" value={formData.seat} onChange={handleChange} readOnly />
                  </div>

                  {/* Payment Button */}
                  <div className="flex justify-center mb-8">
                    <button 
                      type="button" 
                      onClick={handleFeesSubmit}
                      className={`group relative px-8 py-4 rounded-2xl transition-all duration-300 ${
                        feesPaid 
                          ? 'backdrop-blur-xl bg-green-500/20 border border-green-500/30 text-green-400 cursor-default' 
                          : 'backdrop-blur-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:scale-105'
                      }`}
                      disabled={feesPaid}
                    >
                      <div className="flex items-center space-x-3">
                        {feesPaid ? (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg font-medium">Payment Completed</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-lg font-medium">Submit Fees Payment</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Summary Card */}
                  <div className="backdrop-blur-xl bg-slate-700/20 border border-slate-600/40 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Registration Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-white">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Contact:</span>
                          <span className="text-white">{formData.contact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Study Plan:</span>
                          <span className="text-white">{formData.shift}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white">{formData.timing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Seat:</span>
                          <span className="text-white">{formData.seat || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Payment:</span>
                          <span className={feesPaid ? 'text-green-400' : 'text-red-400'}>
                            {feesPaid ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                    currentStep === 1
                      ? 'backdrop-blur-xl bg-slate-700/20 border border-slate-600/40 text-slate-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/40 hover:border-slate-500/50 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </div>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 backdrop-blur-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 hover:border-purple-400/30 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Register Student</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Seat Selection Modal */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-3xl bg-slate-900/80 border border-slate-700/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-4xl sm:max-w-6xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Select Available Seat</h2>
                <p className="text-sm sm:text-base text-slate-400 mt-1">Choose a seat for the student</p>
                {/* Show selected time slot */}
                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400">
                    <strong>Selected Time:</strong> {formData.shift}
                    {formData.shift === 'Custom' && formData.customStartTime && formData.customEndTime && (
                      <span> ({formatTimeDisplay(formData.customStartTime)} - {formatTimeDisplay(formData.customEndTime)})</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSeatModalOpen(false)}
                className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Seat Layout Display */}
            <div className="mb-4 sm:mb-6">
              {seatLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-300 text-lg font-medium">Loading current seat availability...</p>
                    <p className="text-slate-400 text-sm mt-2">Fetching real-time data from server</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-0">Library Seating Layout</h3>
                    <div className="text-sm text-slate-400">
                      {availableSeats.filter(seat => !seat.members || seat.members.filter(m => m.memberId).length === 0).length} empty seats, {availableSeats.filter(seat => seat.members && seat.members.filter(m => m.memberId).length > 0).length} shared seats available for your time slot
                    </div>
                  </div>
              
                  {/* Show existing seat occupants info */}
                  {availableSeats.some(seat => seat.members && seat.members.filter(m => m.memberId).length > 0) && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-400 mb-2">
                        <strong>Note:</strong> Some seats are shared with other students at different times
                      </p>
                      <div className="text-xs text-amber-300 space-y-1">
                        {availableSeats
                          .filter(seat => seat.members && seat.members.filter(m => m.memberId).length > 0)
                          .slice(0, 3) // Show first 3 examples
                          .map(seat => (
                            <div key={seat.seatId}>
                              <strong>Seat {seat.seatId}:</strong> {seat.members
                                .filter(member => member.memberId)
                                .map(member => 
                                  `${member.memberName} (${member.shift})`
                                ).join(', ')}
                            </div>
                          ))}
                        {availableSeats.filter(seat => seat.members && seat.members.filter(m => m.memberId).length > 0).length > 3 && (
                          <div className="text-amber-300/70">... and {availableSeats.filter(seat => seat.members && seat.members.filter(m => m.memberId).length > 0).length - 3} more shared seats</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Visual Layout */}
                  <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/40 p-3 sm:p-6 rounded-xl sm:rounded-2xl">
                    <div className="space-y-3 sm:space-y-4">
                      {['A', 'B', 'C'].map(row => (
                        <div key={row} className="flex items-center space-x-2 sm:space-x-4">
                          <div className="w-6 sm:w-8 text-center font-semibold text-slate-300 text-xs sm:text-sm">{row}</div>
                          <div className="flex space-x-1 sm:space-x-2 flex-wrap">
                            {Array.from({ length: 30 }, (_, i) => {
                              const seatId = `${row}${i + 1}`;
                              const isAvailable = availableSeats.some(seat => seat.seatId === seatId);
                              const seat = availableSeats.find(seat => seat.seatId === seatId);
                              
                              // Check if seat has existing members (only count valid members)
                              const hasExistingMembers = seat && seat.members && seat.members.filter(m => m.memberId).length > 0;
                              
                              return (
                                <div
                                  key={seatId}
                                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 cursor-pointer ${
                                    isAvailable 
                                      ? hasExistingMembers
                                        ? 'bg-amber-500/20 border border-amber-400/40 text-amber-400 hover:bg-amber-500/30 hover:scale-110'
                                        : 'bg-green-500/20 border border-green-400/40 text-green-400 hover:bg-green-500/30 hover:scale-110'
                                      : 'bg-red-500/20 border border-red-400/40 text-red-400 cursor-not-allowed opacity-60'
                                  }`}
                                  onClick={() => isAvailable && handleSeatAssignment(seatId)}
                                  title={
                                    isAvailable 
                                      ? hasExistingMembers
                                        ? `Seat ${seatId} - Shared seat available for ${formData.shift}`
                                        : `Seat ${seatId} - Available for ${formData.shift}`
                                      : `Seat ${seatId} - Not available for ${formData.shift}`
                                  }
                                >
                                  {i + 1}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/40">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500/20 border border-green-400/40 rounded"></div>
                          <span className="text-slate-300">Available (empty seat)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500/20 border border-amber-400/40 rounded"></div>
                          <span className="text-slate-300">Available (shared seat)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500/20 border border-red-400/40 rounded"></div>
                          <span className="text-slate-300">Time conflict or occupied</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Selected Seat Display */}
            {formData.seat && (
              <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm sm:text-base text-blue-400 font-medium">
                    <strong>Selected Seat:</strong> {formData.seat}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fees Submit Modal */}
      {isFeesModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-3xl bg-slate-900/80 border border-slate-700/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Submit Fees Payment</h2>
                <p className="text-sm sm:text-base text-slate-400 mt-1">Complete the payment process</p>
              </div>
              <button
                onClick={handleFeesModalClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Student Name</label>
                <input
                  type="text"
                  value={feesData.studentName}
                  onChange={(e) => setFeesData({...feesData, studentName: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={feesData.contactNumber}
                  onChange={(e) => setFeesData({...feesData, contactNumber: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={feesData.amount}
                  onChange={(e) => setFeesData({...feesData, amount: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Payment Mode</label>
                <select
                  value={feesData.paymentMode}
                  onChange={(e) => setFeesData({...feesData, paymentMode: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              {feesData.paymentMode === 'Online' && (
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Payment Provider</label>
                  <select
                    value={feesData.paymentProvider}
                    onChange={(e) => setFeesData({...feesData, paymentProvider: e.target.value})}
                    className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Provider</option>
                    {paymentProviders['Online'].map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
              )}

              {feesData.paymentMode === 'Card' && (
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Payment Provider</label>
                  <select
                    value={feesData.paymentProvider}
                    onChange={(e) => setFeesData({...feesData, paymentProvider: e.target.value})}
                    className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Provider</option>
                    {paymentProviders['Card'].map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={feesData.transactionId}
                  onChange={(e) => setFeesData({...feesData, transactionId: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">Notes (Optional)</label>
                <textarea
                  value={feesData.notes}
                  onChange={(e) => setFeesData({...feesData, notes: e.target.value})}
                  className="w-full p-2 sm:p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  rows="3"
                  placeholder="Any additional notes"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleFeesModalClose}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="flex-1 px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  {paymentLoading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>


    
  );
};

export default AddMember;