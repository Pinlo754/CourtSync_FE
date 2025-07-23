import React, { useState } from 'react';
import { CourtReport, CourtReportStatus } from '../../staffReport/types';
import { Badge } from '../../../components/ui/badge';
import { format, parseISO, addDays } from 'date-fns';
import { approveCourtReport, ApproveCourtReportRequest } from '../../../api/facility/facilityApi';
import { motion } from 'framer-motion';

interface ReportDetailsProps {
  report: CourtReport;
  onReportUpdated?: () => void;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ report, onReportUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [maintainDate, setMaintainDate] = useState<string>(
    report.maintainDate || new Date().toISOString().split('T')[0]
  );
  const [estimatedTime, setEstimatedTime] = useState<number>(
    report.estimateTime ? parseInt(report.estimateTime) : 1
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getStatusBadgeColor = (status: CourtReportStatus) => {
    switch (status) {
      case CourtReportStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CourtReportStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CourtReportStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case CourtReportStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: CourtReportStatus) => {
    switch (status) {
      case CourtReportStatus.PENDING:
        return 'text-yellow-500';
      case CourtReportStatus.IN_PROGRESS:
        return 'text-blue-500';
      case CourtReportStatus.COMPLETED:
        return 'text-green-500';
      case CourtReportStatus.CANCELLED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleApproveReport = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);

      // Format the date and time for the API
      const maintainDateTime = new Date(maintainDate);
      maintainDateTime.setHours(10, 0, 0); // Set default time to 10:00 AM
      
      const approveData: ApproveCourtReportRequest = {
        courtReportId: parseInt(report.courtReportId),
        maintainDate: maintainDateTime.toISOString(),
        estimatedTime: estimatedTime
      };

      await approveCourtReport(approveData);
      setSuccess('Report has been approved successfully!');
      
      // Notify parent component that report was updated
      if (onReportUpdated) {
        onReportUpdated();
      }
    } catch (err) {
      console.error('Error approving report:', err);
      setError('Failed to approve report. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const canApprove = report.courtReportStatus === CourtReportStatus.PENDING;
  
  // Calculate estimated completion date
  const getEstimatedCompletionDate = () => {
    if (!maintainDate) return 'Not available';
    try {
      const startDate = new Date(maintainDate);
      const endDate = addDays(startDate, estimatedTime);
      return format(endDate, 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <motion.div 
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(report.courtReportStatus)} bg-slate-700/50`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Report #{report.courtReportId}</h2>
                  <Badge className={`${getStatusBadgeColor(report.courtReportStatus)} font-medium px-3 py-1`}>
                    {report.courtReportStatus}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Created on {formatDate(report.createdDate)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canApprove && (
                <motion.button 
                  className="px-4 py-2 bg-mint-500 hover:bg-mint-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('approveSection')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Court & Reporter Info */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Court Info Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Court Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Court Name</p>
                <p className="text-white mt-1">{report.courtName || `Court ${report.courtId}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Facility</p>
                <p className="text-white mt-1">{report.facilityName || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Court ID</p>
                <p className="text-white mt-1">{report.courtId}</p>
              </div>
            </div>
          </div>

          {/* Reporter Info Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Reporter Information</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-mint-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {report.createdBy && typeof report.createdBy === 'string' 
                      ? report.createdBy.split(' ').map(n => n[0]).join('').toUpperCase()
                      : 'U'}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-white font-medium">{report.creatorName || `User ${report.createdBy}`}</p>
                  <p className="text-slate-400 text-sm">Staff Member</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Description & Maintenance Info */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Description Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Issue Description</h3>
            </div>
            <div className="p-6">
              <div className="bg-slate-700/30 rounded-lg p-4 text-white">
                {report.description}
              </div>
            </div>
          </div>

          {/* Maintenance Schedule Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Maintenance Schedule</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">Estimated Time</p>
                  <p className="text-white mt-1">{report.estimateTime || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Maintain Date</p>
                  <p className="text-white mt-1">{formatDate(report.maintainDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approve Section */}
          {canApprove && (
            <motion.div 
              id="approveSection"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Approve Report</h3>
              </div>
              <div className="p-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-400">{error}</p>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-400">{success}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Maintenance Date
                    </label>
                    <input
                      type="date"
                      value={maintainDate}
                      onChange={(e) => setMaintainDate(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Estimated Time (days)
                    </label>
                    <input
                      type="number"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
                      min="1"
                    />
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mint-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-mint-400 font-medium">Maintenance Summary</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Start Date:</p>
                      <p className="text-white">{format(new Date(maintainDate), 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Duration:</p>
                      <p className="text-white">{estimatedTime} {estimatedTime === 1 ? 'day' : 'days'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Estimated Completion:</p>
                      <p className="text-white">{getEstimatedCompletionDate()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button 
                    className="px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApproveReport}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve Report</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}; 