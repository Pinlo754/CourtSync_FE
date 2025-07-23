import React, { useState, useEffect } from 'react';
import { CourtReport, CourtReportStatus, ReportImage } from '../../staffReport/types';
import { Badge } from '../../../components/ui/badge';
import { format, parseISO, addDays, parse } from 'date-fns';
import { 
  approveCourtReport, 
  ApproveCourtReportRequest, 
  getBookingTimesByDate, 
  GetBookingTimeRequest, 
  CourtBookingTime 
} from '../../../api/facility/facilityApi';
import { motion } from 'framer-motion';

interface ReportDetailsProps {
  report: CourtReport;
  onReportUpdated?: () => void;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ report, onReportUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [maintainDate, setMaintainDate] = useState<string>(
    report.maintainDate ? new Date(report.maintainDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [maintainTime, setMaintainTime] = useState<string>("10:00");
  const [estimatedTime, setEstimatedTime] = useState<number>(
    report.estimateTime ? parseInt(report.estimateTime) : 1
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bookingTimes, setBookingTimes] = useState<CourtBookingTime[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  console.log("courtReport", report);

  // Format image URL based on the format
  const formatImageUrl = (imageData: string): string => {
    // Kiểm tra nếu đã là URL đầy đủ (bắt đầu bằng http hoặc https)
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }
    
    // Kiểm tra nếu là dữ liệu Base64 đã có tiền tố
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // Thêm tiền tố Base64 nếu có vẻ là dữ liệu Base64
    if (imageData.length > 100) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    // Nếu là URL tương đối, thêm URL gốc
    return `${process.env.REACT_APP_API_URL || 'https://localhost:7255'}/${imageData}`;
  };

  // Get image URLs from report
  const getReportImageUrls = (): string[] => {
    try {
      if (!report.reportImages) {
        console.log("No reportImages found");
        return [];
      }
      
      console.log("Report images:", report.reportImages);
      
      if (report.reportImages.$values && Array.isArray(report.reportImages.$values)) {
        console.log("Found reportImages.$values:", report.reportImages.$values);
        return report.reportImages.$values.map(img => formatImageUrl(img));
      }
      
      return [];
    } catch (error) {
      console.error("Error extracting image URLs:", error);
      return [];
    }
  };
  
  const imageUrls = getReportImageUrls();

  // Fetch booking times when date changes
  useEffect(() => {
    const fetchBookingTimes = async () => {
      if (!report.facilityId) return;
      
      setIsLoadingBookings(true);
      try {
        const request: GetBookingTimeRequest = {
          facilityId: parseInt(report.facilityId),
          bookingDate: maintainDate
        };
        
        const data = await getBookingTimesByDate(request);
        setBookingTimes(data);
      } catch (err) {
        console.error('Error fetching booking times:', err);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    
    fetchBookingTimes();
  }, [maintainDate, report.facilityId]);

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
      const [hours, minutes] = maintainTime.split(':').map(Number);
      const maintainDateTime = new Date(maintainDate);
      maintainDateTime.setHours(hours, minutes, 0);
      
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
  
  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, 'HH:mm');
    } catch (error) {
      return timeString;
    }
  };
  
  // Calculate estimated completion date
  const getEstimatedCompletionDate = () => {
    if (!maintainDate) return 'Not available';
    try {
      const [hours, minutes] = maintainTime.split(':').map(Number);
      const startDate = new Date(maintainDate);
      startDate.setHours(hours, minutes, 0);
      const endDate = addDays(startDate, estimatedTime);
      return format(endDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Find bookings for the current court
  const currentCourtBookings = bookingTimes.find(
    booking => booking.courtId === parseInt(report.courtId)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Report image full view" 
              className="w-full h-full object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-slate-800/80 text-white rounded-full p-2 hover:bg-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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

          {/* Report Images */}
          {imageUrls.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Report Images ({imageUrls.length})</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageUrls.map((imageUrl, index) => (
                    <motion.div 
                      key={index}
                      className="relative overflow-hidden rounded-lg aspect-video bg-slate-900/50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Report image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-3 w-full">
                          <p className="text-white text-sm font-medium">Click to enlarge</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                      Maintenance Time
                    </label>
                    <input
                      type="time"
                      value={maintainTime}
                      onChange={(e) => setMaintainTime(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Estimated Time (hours)
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

                {/* Booking Times Display */}
                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-blue-400 font-medium">Existing Bookings on {format(new Date(maintainDate), 'dd/MM/yyyy')}</p>
                  </div>
                  
                  {isLoadingBookings ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
                    </div>
                  ) : (
                    <div>
                      {bookingTimes.length === 0 ? (
                        <p className="text-slate-400 text-center py-2">No booking data available</p>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-sm font-medium text-slate-300 border-b border-slate-600/50 pb-2">
                            <div>Court</div>
                            <div>Start Time</div>
                            <div>End Time</div>
                          </div>
                          
                          {bookingTimes.map((courtBooking) => {
                            // Skip courts with no bookings
                            if (courtBooking.startTimes.$values.length === 0) return null;
                            
                            return courtBooking.startTimes.$values.map((startTime, index) => {
                              const endTime = courtBooking.endTimes.$values[index] || '';
                              const isCurrentCourt = courtBooking.courtId === parseInt(report.courtId);
                              
                              return (
                                <div 
                                  key={`${courtBooking.courtId}-${index}`}
                                  className={`grid grid-cols-3 gap-2 text-sm py-1 ${isCurrentCourt ? 'text-yellow-300' : 'text-slate-300'}`}
                                >
                                  <div className="flex items-center">
                                    {isCurrentCourt && (
                                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                    )}
                                    Court {courtBooking.courtId}
                                  </div>
                                  <div>{formatTime(startTime)}</div>
                                  <div>{formatTime(endTime)}</div>
                                </div>
                              );
                            });
                          }).filter(Boolean)}
                          
                          {bookingTimes.every(court => court.startTimes.$values.length === 0) && (
                            <p className="text-green-400 text-center py-2">No bookings for this date</p>
                          )}
                        </div>
                      )}
                      
                      {currentCourtBookings && currentCourtBookings.startTimes.$values.length > 0 && (
                        <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 text-sm">
                            <span className="font-medium">Note:</span> There are existing bookings for this court. 
                            Consider scheduling maintenance during non-booked hours.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
                      <p className="text-white">{format(new Date(maintainDate), 'dd/MM/yyyy')} at {maintainTime}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Duration:</p>
                      <p className="text-white">{estimatedTime} {estimatedTime === 1 ? 'hour' : 'hours'}</p>
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