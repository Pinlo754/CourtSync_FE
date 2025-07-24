export enum CourtReportStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface ReportImage {
    $id?: string;
    $values: string[];
}

export interface CourtReport {
    courtReportId: string;
    createdBy: string | number;
    creatorName?: string;
    createdDate: string;
    description: string;
    courtReportStatus: CourtReportStatus;
    courtId: string;
    courtName?: string;
    facilityId?: string;
    facilityName?: string;
    estimateTime: string | null;
    maintainDate: string | null;
    reportImages?: ReportImage | null;
}

export interface CourtReportListResponse {
    reports: CourtReport[];
    totalCount: number;
}

// Interface for approve court report request
export interface ApproveCourtReportRequest {
    courtReportId: number;
    maintainDate: string;
    estimatedTime: number;
}

// Interface for booking time request
export interface GetBookingTimeRequest {
    facilityId: number;
    bookingDate: string;
}

// Interface for booking time response
export interface CourtBookingTime {
    courtId: number;
    startTimes: {
        $id: string;
        $values: string[];
    };
    endTimes: {
        $id: string;
        $values: string[];
    };
}
