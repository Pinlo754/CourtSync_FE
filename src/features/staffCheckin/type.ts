export interface BookingElements {
  bookingId: number;
  courtId: number;
  facilityId: number;
  bookingStatus: string;
  checkinStatus: string;
  cHeckinDate: string;
  startTime: {
    $id: string;
    $values: string[];
  };
  endTime: {
    $id: string;
    $values: string[];
  };
  totalPrice: number;
  note: string;
  bookingDate: string;
  transactionId: number;
  transactionStatus: string;
  transactionType: string;
  transactionDate: string;
}