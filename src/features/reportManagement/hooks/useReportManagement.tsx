import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CourtReport, 
    CourtReportStatus,
    ApproveCourtReportRequest,
    GetBookingTimeRequest,
    CourtBookingTime
} from '../types';
import { 
    getCourtReports, 
    approveCourtReport, 
    rejectCourtReport,
    getBookingTimesByDate
} from '../api/reportService';

interface UseReportManagementProps {
    initialReportId?: string;
}

export const useReportManagement = ({ initialReportId }: UseReportManagementProps = {}) => {
    const [reports, setReports] = useState<CourtReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<CourtReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    // Fetch all reports
    const fetchReports = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getCourtReports();
            setReports(data.reports);
            return data.reports;
        } catch (err) {
            setError('Failed to load reports. Please try again later.');
            console.error('Error fetching reports:', err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch report by ID
    const fetchReportById = useCallback(async (reportId: string) => {
        try {
            setIsLoading(true);
            const data = await getCourtReports();
            const foundReport = data.reports.find(report => report.courtReportId === reportId);
            
            if (foundReport) {
                setSelectedReport(foundReport);
                return foundReport;
            } else {
                console.error(`Report with ID ${reportId} not found`);
                navigate('/reports');
                return null;
            }
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Failed to load report. Please try again later.');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Handle selecting a report
    const handleSelectReport = useCallback((report: CourtReport) => {
        setSelectedReport(report);
        navigate(`/reports/${report.courtReportId}`);
    }, [navigate]);

    // Handle going back to list
    const handleBackToList = useCallback(() => {
        setSelectedReport(null);
        navigate('/reports');
    }, [navigate]);

    // Handle report updated (after approval/rejection)
    const handleReportUpdated = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        
        // Wait a moment before going back to the list to show success message
        setTimeout(() => {
            setSelectedReport(null);
            navigate('/reports');
        }, 2000);
    }, [navigate]);

    // Approve a report
    const handleApproveReport = useCallback(async (data: ApproveCourtReportRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            
            await approveCourtReport(data);
            setSuccess('Report has been approved successfully! Maintenance scheduled.');
            
            // Update the report status locally
            if (selectedReport) {
                setSelectedReport({
                    ...selectedReport,
                    courtReportStatus: CourtReportStatus.IN_PROGRESS,
                    maintainDate: data.maintainDate,
                    estimateTime: data.estimatedTime.toString()
                });
            }
            
            return true;
        } catch (err) {
            console.error('Error approving report:', err);
            setError('Failed to approve report. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [selectedReport]);

    // Reject a report
    const handleRejectReport = useCallback(async (reportId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            
            await rejectCourtReport(reportId);
            setSuccess('Report has been rejected successfully!');
            
            // Update the report status locally
            if (selectedReport) {
                setSelectedReport({
                    ...selectedReport,
                    courtReportStatus: CourtReportStatus.CANCELLED
                });
            }
            
            return true;
        } catch (err) {
            console.error('Error rejecting report:', err);
            setError('Failed to reject report. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [selectedReport]);

    // Get booking times for a specific date
    const fetchBookingTimes = useCallback(async (request: GetBookingTimeRequest): Promise<CourtBookingTime[]> => {
        try {
            const data = await getBookingTimesByDate(request);
            return data;
        } catch (err) {
            console.error('Error fetching booking times:', err);
            return [];
        }
    }, []);

    // Load initial data
    useEffect(() => {
        fetchReports();
    }, [fetchReports, refreshKey]);

    // Load report by ID if provided
    useEffect(() => {
        if (initialReportId) {
            fetchReportById(initialReportId);
        }
    }, [initialReportId, fetchReportById]);

    return {
        reports,
        selectedReport,
        isLoading,
        error,
        success,
        setError,
        setSuccess,
        fetchReports,
        fetchReportById,
        handleSelectReport,
        handleBackToList,
        handleReportUpdated,
        handleApproveReport,
        handleRejectReport,
        fetchBookingTimes
    };
}; 