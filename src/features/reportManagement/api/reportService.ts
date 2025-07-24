import axiosInstance from "../../../api/axiosInstance";
import { handleApiError } from "../../../api/errorHandler";
import { AxiosError } from "axios";
import {
    CourtReportListResponse,
    CourtReportStatus,
    ApproveCourtReportRequest,
    GetBookingTimeRequest,
    CourtBookingTime
} from "../types";
import { REPORT_ENDPOINTS } from "./endpoints";

/**
 * Report management service
 * Contains all API calls related to court reports
 */
export const reportService = {
    // Get all reports for facility owner
    getCourtReports: async (): Promise<CourtReportListResponse> => {
        try {
            const response = await axiosInstance.get(REPORT_ENDPOINTS.REPORTS.GET_OWNER_REPORTS);
            
            // Transform backend response to match our frontend interface
            const reports = response.data.$values.map((item: any) => ({
                courtReportId: item.courtReportId.toString(),
                createdBy: item.creatorName || `User ${item.createdBy}`,
                createdDate: item.createdDate,
                description: item.description,
                courtReportStatus: mapReportStatus(item.courtReportStatus),
                courtId: item.courtId.toString(),
                courtName: item.courtName,
                facilityId: item.facilityId.toString(),
                facilityName: item.facilityName,
                estimateTime: item.estimateTime || 'Not specified',
                maintainDate: item.maintainDate || null,
                reportImages: item.reportImages || null
            }));
            
            return {
                reports,
                totalCount: reports.length
            };
        } catch (error) {
            handleApiError(error as AxiosError);
            throw error;
        }
    },

    // Approve a court report
    approveCourtReport: async (data: ApproveCourtReportRequest): Promise<any> => {
        try {
            const response = await axiosInstance.post(REPORT_ENDPOINTS.REPORTS.APPROVE_REPORT, data);
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            throw error;
        }
    },

    // Reject a court report
    rejectCourtReport: async (courtReportId: number): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${REPORT_ENDPOINTS.REPORTS.REJECT_REPORT}?courtReportId=${courtReportId}`);
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            throw error;
        }
    },

    // Get booking times by date
    getBookingTimesByDate: async (request: GetBookingTimeRequest): Promise<CourtBookingTime[]> => {
        try {
            const response = await axiosInstance.post(REPORT_ENDPOINTS.BOOKINGS.GET_BOOKING_TIMES, request);
            return response.data.$values;
        } catch (error) {
            handleApiError(error as AxiosError);
            throw error;
        }
    }
};

// Helper function to map backend status to frontend enum
const mapReportStatus = (status: string): CourtReportStatus => {
    switch (status) {
        case "0":
            return CourtReportStatus.PENDING;
        case "1":
            return CourtReportStatus.IN_PROGRESS;
        case "2":
            return CourtReportStatus.COMPLETED;
        case "3":
            return CourtReportStatus.CANCELLED;
        default:
            return CourtReportStatus.PENDING;
    }
};

// For backward compatibility
export const getCourtReports = reportService.getCourtReports;
export const approveCourtReport = reportService.approveCourtReport;
export const rejectCourtReport = reportService.rejectCourtReport;
export const getBookingTimesByDate = reportService.getBookingTimesByDate; 