export interface ReportIssueRequest {
    courtId: number;
    description: string;
    imageUrl: string;
}
export interface ReportIssueForm {
    description: string;
    courtId: string;
    estimateTime: string;
}

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