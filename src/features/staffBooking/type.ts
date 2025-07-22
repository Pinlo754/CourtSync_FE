export interface CreateBookingStaff {
    courtId: number;
    startTimes: Date[];
    endTimes: Date[];
}
export interface CreateBookingStaffRequest {
    courtId: number;
    startTimes: string[];
    endTimes: string[];
}
export interface Court {
    courtId: number;
    courtName: string;
    // Thêm các trường khác nếu cần
  }