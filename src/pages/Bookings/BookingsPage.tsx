import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { getAllOwnerBookings, OwnerBooking } from '../../api/facility/facilityApi';
import { Calendar, Clock, DollarSign, User, CheckCircle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<number | 'all'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getAllOwnerBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getBookingStatusLabel = (status: string) => {
    switch (status) {
      case '0':
        return 'Pending';
      case '1':
        return 'Paid';
      case '2':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getCheckinStatusLabel = (status: string) => {
    switch (status) {
      case '0':
        return 'Not Checked In';
      case '1':
        return 'Checked In';
      default:
        return 'Unknown';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case '0': // Pending
        return 'bg-yellow-500';
      case '1': // Paid
        return 'bg-green-500';
      case '2': // Cancelled
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCheckinStatusColor = (status: string) => {
    switch (status) {
      case '0': // Not Checked In
        return 'bg-gray-500';
      case '1': // Checked In
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get unique facilities for filter dropdown
  const facilities = bookings
    .reduce<{ id: number; name: string }[]>((acc, booking) => {
      // Check if this facility is already in our accumulator
      if (!acc.some(item => item.id === booking.facilityId)) {
        acc.push({
          id: booking.facilityId,
          name: booking.facilityName || `Facility ${booking.facilityId}`
        });
      }
      return acc;
    }, []);

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filter === 'pending' && booking.bookingStatus !== '0') return false;
    if (filter === 'paid' && booking.bookingStatus !== '1') return false;
    if (filter === 'cancelled' && booking.bookingStatus !== '2') return false;
    
    // Filter by facility
    if (selectedFacility !== 'all' && booking.facilityId !== selectedFacility) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.userName.toLowerCase().includes(query) ||
        booking.courtName.toLowerCase().includes(query) ||
        booking.facilityName.toLowerCase().includes(query) ||
        booking.bookingId.toString().includes(query)
      );
    }
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Đơn đặt sân</h1>
              <p className="text-slate-300">Quản lý và theo dõi tất cả đặt sân</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, sân, hoặc cơ sở..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
              >
                <option value="all">Tất cả đơn đặt sân</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
              >
                <option value="all">Tất cả cơ sở</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy đơn đặt sân</h3>
              <p className="text-slate-400 text-lg">Không có đơn đặt sân nào phù hợp với các bộ lọc của bạn.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Lịch sử đặt sân</h2>
              <div className="overflow-hidden rounded-xl border border-slate-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-700/30">
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Khách hàng</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Sân</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Cơ sở</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Thời gian</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Giá</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30 bg-slate-800/20">
                      {filteredBookings.map((booking) => (
                        <tr 
                          key={booking.bookingId}
                          className="hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-base text-white">#{booking.bookingId}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-white">{booking.userName}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-white">{booking.courtName}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-white">{booking.facilityName}</td>
                          <td className="px-6 py-5 text-base text-white">
                            <div className="space-y-2">
                              {booking.startTime.$values.length > 0 ? (
                                booking.startTime.$values.map((startTime, index) => {
                                  const endTime = booking.endTime.$values[index];
                                  return (
                                    <div key={index} className="flex items-center bg-slate-700/30 p-2 rounded-lg">
                                      <Clock className="h-4 w-4 text-mint-400 mr-2" />
                                      <span>
                                        {format(new Date(startTime), 'dd/MM/yyyy')} | {formatTime(startTime)} - {formatTime(endTime)}
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <span>Không có thời gian</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-mint-400">
                            {formatAmount(booking.totalPrice)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getBookingStatusColor(booking.bookingStatus)} bg-opacity-10 text-${getBookingStatusColor(booking.bookingStatus).replace('bg-', '')}`}>
                              {getBookingStatusLabel(booking.bookingStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getCheckinStatusColor(booking.checkinStatus)} bg-opacity-10 text-${getCheckinStatusColor(booking.checkinStatus).replace('bg-', '')}`}>
                              {getCheckinStatusLabel(booking.checkinStatus)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage; 