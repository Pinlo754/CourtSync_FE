import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import { Calendar, Search, Filter } from 'lucide-react';

interface Transaction {
  transactionId: number;
  bookingId: number;
  userId: number;
  name: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
  updateDate: string;
  description: string;
  courtName: string;
  facilityName: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '0' | '1' | '2'>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Get unique facilities for filter
  const facilities = transactions.reduce<{ name: string }[]>((acc, transaction) => {
    if (!acc.some(item => item.name === transaction.facilityName)) {
      acc.push({ name: transaction.facilityName });
    }
    return acc;
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/Transaction/GetMyTransactions');
        
        if (response.data && response.data.$values) {
          setTransactions(response.data.$values);
        } else {
          setTransactions([]);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load transactions. Please try again later.');
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateForInput = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return '';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case '0':
        return 'Deposit';
      case '1':
        return 'Payment';
      case '2':
        return 'Refund';
      case '3':
        return 'Hold';
      default:
        return 'Unknown';
    }
  };

  const getTransactionStatusLabel = (status: string) => {
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

  const getTransactionStatusColor = (status: string) => {
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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case '0': // Deposit
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        );
      case '1': // Payment
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mint-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case '2': // Refund
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        );
      case '3': // Hold
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setFacilityFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by status
    if (statusFilter !== 'all' && transaction.transactionStatus !== statusFilter) {
      return false;
    }
    
    // Filter by facility
    if (facilityFilter !== 'all' && transaction.facilityName !== facilityFilter) {
      return false;
    }
    
    // Filter by date range
    if (startDate) {
      const transactionDate = new Date(transaction.updateDate);
      const filterStartDate = new Date(startDate);
      filterStartDate.setHours(0, 0, 0, 0);
      
      if (isBefore(transactionDate, filterStartDate)) {
        return false;
      }
    }
    
    if (endDate) {
      const transactionDate = new Date(transaction.updateDate);
      const filterEndDate = new Date(endDate);
      filterEndDate.setHours(23, 59, 59, 999);
      
      if (isAfter(transactionDate, filterEndDate)) {
        return false;
      }
    }
    
    // Filter by search query (transaction ID, description, court name, facility name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.transactionId.toString().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query) ||
        transaction.courtName.toLowerCase().includes(query) ||
        transaction.facilityName.toLowerCase().includes(query)
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
              <h1 className="text-3xl font-bold text-white mb-2">Giao dịch</h1>
              <p className="text-slate-300">Xem và quản lý giao dịch thanh toán của bạn</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 shadow-lg">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[220px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mint-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm giao dịch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-700/40 rounded-lg p-2 border border-slate-600/30">
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Ngày bắt đầu"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-slate-800/70 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all w-40"
                    />
                  </div>
                  <span className="text-slate-300 font-medium">to</span>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Ngày kết thúc"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-slate-800/70 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all w-40"
                      min={startDate}
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | '0' | '1' | '2')}
                    className="bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner appearance-none pr-10 relative"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2380CBC4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="0">Chờ thanh toán</option>
                    <option value="1">Đã thanh toán</option>
                    <option value="2">Đã hủy</option>
                  </select>
                </div>

                <div>
                  <select
                    value={facilityFilter}
                    onChange={(e) => setFacilityFilter(e.target.value)}
                    className="bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner appearance-none pr-10 relative"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2380CBC4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="all">Tất cả cơ sở</option>
                    {facilities.map((facility, index) => (
                      <option key={index} value={facility.name}>{facility.name}</option>
                    ))}
                  </select>
                </div>
                
                {(!!searchQuery || statusFilter !== 'all' || facilityFilter !== 'all' || !!startDate || !!endDate) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-lg transition-all flex items-center gap-2 border border-red-500/20 hover:border-red-500/30"
                  >
                    <Filter className="h-4 w-4" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>
              
              {(!!searchQuery || statusFilter !== 'all' || facilityFilter !== 'all' || !!startDate || !!endDate) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-400">Bộ lọc đang hoạt động:</span>
                  {!!searchQuery && (
                    <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      Tìm kiếm: {searchQuery}
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                      Trạng thái: {getTransactionStatusLabel(statusFilter)}
                    </span>
                  )}
                  {facilityFilter !== 'all' && (
                    <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                        Cơ sở: {facilityFilter}
                    </span>
                  )}
                  {(!!startDate || !!endDate) && (
                    <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Ngày: {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'Bất kỳ'} - {endDate ? format(new Date(endDate), 'dd/MM/yyyy') : 'Bất kỳ'}
                    </span>
                  )}
                </div>
              )}
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
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy giao dịch</h3>
              <p className="text-slate-400 text-lg">Không có giao dịch nào phù hợp với các bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Lịch sử giao dịch</h2>
              <div className="overflow-hidden rounded-xl border border-slate-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-700/30">
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Mô tả</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Cơ sở</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Sân</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Số tiền</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Ngày</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30 bg-slate-800/20">
                      {filteredTransactions.map((transaction) => (
                        <tr 
                          key={transaction.transactionId}
                          className="hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-base text-white">#{transaction.transactionId}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-300 max-w-xs truncate">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-300">
                            {transaction.facilityName}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-300">
                            {transaction.courtName}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-mint-400">
                            {formatAmount(transaction.amount)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-300">
                            {formatDate(transaction.updateDate)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getTransactionStatusColor(transaction.transactionStatus)} bg-opacity-10 text-${getTransactionStatusColor(transaction.transactionStatus).replace('bg-', '')}`}>
                              {getTransactionStatusLabel(transaction.transactionStatus)}
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

export default TransactionsPage; 