export interface CreateBookingStaff {
  courtId: number;
  note: string;
  totalPrice: number;
  startTimes: string[];
  endTimes: string[];
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

export interface Facility {
    address: string;
    city: string;
    closingTime: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
    distance: number;
    district: string;
    facilittyImageUrl: string[];
    facilityId: number;
    facilityName: string;
    facilityStatus: string;
    maxPrice: number;
    minPrice: number;
    openingTime: string;
    totalCourts: number;
    ward: string;
}
export interface BookingTime {
  courtId: number
  startTimes: string[]
  endTimes: string[]
}

export interface BookingResponse {
  $values: BookingTime[]
}