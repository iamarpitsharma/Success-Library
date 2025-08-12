import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { API_ENDPOINTS, getAuthConfig } from '../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Mock admin user (normally from localStorage)
  const adminUser = JSON.parse(localStorage.getItem('adminUser')) || { name: 'Admin User' };
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    availableSeats: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        throw new Error('No admin token found');
      }
      
      const config = getAuthConfig();
      
      // Fetch total students count
      const studentsResponse = await axios.get(API_ENDPOINTS.MEMBERS, config);
      const totalStudents = studentsResponse.data.length || 0;
      
      // Fetch available seats count
      const seatsResponse = await axios.get(API_ENDPOINTS.SEATS, config);
      const availableSeats = seatsResponse.data.filter(seat => !seat.isOccupied).length || 0;
      
      // Fetch total earnings from payments
      const paymentsResponse = await axios.get(API_ENDPOINTS.PAYMENTS, config);
      const totalEarnings = paymentsResponse.data.reduce((sum, payment) => {
        return sum + (parseInt(payment.amount) || 0);
      }, 0);

      setStats({
        totalStudents,
        availableSeats,
        totalEarnings
      });
    } catch (err) {
      // Error handling for dashboard stats
      
      // Fallback to default values if API fails
      setStats({
        totalStudents: 0,
        availableSeats: 0,
        totalEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center backdrop-blur-3xl bg-slate-800/20 p-8 rounded-3xl border border-slate-700/30 shadow-2xl">
          <div className="relative">
              <svg className="animate-spin h-12 w-12 text-amber-400 mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-slate-300 text-lg font-medium">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Dashboard Overview
            </h1>
              <p className="text-slate-400 mt-2">
                Welcome back,
                {adminUser.name} • Success Library Management System
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Students Card */}
          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Students</p>
                <p className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                  {stats.totalStudents}
                </p>
                  </div>
                </div>
              </div>

            {/* Available Seats Card */}
          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2H6a2 2 0 002-2V6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Available Seats</p>
                <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  {stats.availableSeats}
                </p>
                            </div>
                          </div>
                        </div>

          {/* Total Earnings Card */}
          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                  ₹{stats.totalEarnings.toLocaleString()}
                </p>
              </div>
              </div>
            </div>
          </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => navigate('/admin/add-member')}
              className="group flex items-center p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/70 hover:border-amber-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 group-hover:from-amber-500/30 group-hover:to-orange-600/30 transition-all duration-200">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                      </div>
              <span className="ml-3 font-medium text-white group-hover:text-amber-400 transition-colors duration-200">
                Add New Student
              </span>
            </button>

            <button 
              onClick={() => navigate('/admin/members')}
              className="group flex items-center p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/70 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 group-hover:from-blue-500/30 group-hover:to-cyan-600/30 transition-all duration-200">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
              <span className="ml-3 font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                View Students
              </span>
                </button>

                <button 
              onClick={() => navigate('/admin/seats')}
              className="group flex items-center p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/70 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 group-hover:from-emerald-500/30 group-hover:to-green-600/30 transition-all duration-200">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2H6a2 2 0 002-2V6" />
                        </svg>
                      </div>
              <span className="ml-3 font-medium text-white group-hover:text-emerald-400 transition-colors duration-200">
                Manage Seats
              </span>
            </button>

            <button 
              onClick={() => navigate('/admin/payments')}
              className="group flex items-center p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/70 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-pink-600/30 transition-all duration-200">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
              <span className="ml-3 font-medium text-white group-hover:text-purple-400 transition-colors duration-200">
                View Payments
              </span>
                </button>
                      </div>
                    </div>

        {/* Recent Activity or Additional Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-3"></div>
              <div>
                <p className="text-sm text-slate-400">Server Status</p>
                <p className="text-white font-medium">Online</p>
            </div>
          </div>

            <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-3"></div>
              <div>
                <p className="text-sm text-slate-400">Database</p>
                <p className="text-white font-medium">Connected</p>
              </div>
              </div>
              
            <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse mr-3"></div>
              <div>
                <p className="text-sm text-slate-400">Last Backup</p>
                <p className="text-white font-medium">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 