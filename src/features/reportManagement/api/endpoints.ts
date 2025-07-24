/**
 * Report Management API endpoints
 */

export const REPORT_ENDPOINTS = {
    REPORTS: {
        GET_OWNER_REPORTS: '/CourtReport/GetCourtReportsByOwner',
        APPROVE_REPORT: '/CourtReport/ApproveCourtReport',
        REJECT_REPORT: '/CourtReport/RejectCourtReport',
    },
    BOOKINGS: {
        GET_BOOKING_TIMES: '/Booking/GetBookingTimesByDate',
    }
}; 