export interface BookingElements {
  $id: string;
  bookingId: number;
  courtId: number;
  courtName: string;
  facilityId: number;
  userId: number;
  userName: string;
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