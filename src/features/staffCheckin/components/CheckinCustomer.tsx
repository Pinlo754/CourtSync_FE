import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";

// Mock data (20 bookings)
const mockBookings = Array.from({ length: 20 }, (_, i) => ({
  bookingId: 100 + i + 1,
  courtId: (i % 5) + 1,
  totalPrice: 150000 + (i % 4) * 20000,
  checkin: i % 3 === 0,
}));

const PAGE_SIZE = 5;

const CheckinCustomer: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(mockBookings.length / PAGE_SIZE);
  const bookingsToShow = mockBookings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSelect = (bookingId: number) => {
    setSelected((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    const idsOnPage = bookingsToShow.map((b) => b.bookingId);
    if (idsOnPage.every((id) => selected.includes(id))) {
      setSelected((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    }
  };

  const handleCheckin = () => {
    alert(`Checkin for bookings: ${selected.join(", ")}`);
  };

  const handleViewDetail = (bookingId: number) => {
    alert(`View detail for booking ${bookingId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-blue-300/20 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">
              Check-in Customer
            </h1>
            <Button
              type="button"
              variant="custom"
              onClick={handleCheckin}
              disabled={selected.length === 0}
              className={
                 "bg-gradient-to-r from-blue-300 to-mint-400 text-slate-800 px-6 py-2 rounded-lg shadow-lg text-base font-bold hover:from-mint-400 hover:to-blue-700 hover:text-white transition-all duration-300 w-auto h-auto min-h-0"
              }
            >
              Check-in Selected
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        bookingsToShow.every((b) =>
                          selected.includes(b.bookingId)
                        ) && bookingsToShow.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Court ID</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Check-in Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingsToShow.map((booking) => (
                  <TableRow
                    key={booking.bookingId}
                    className={
                      selected.includes(booking.bookingId)
                        ? "bg-blue-100/50"
                        : ""
                    }
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(booking.bookingId)}
                        onChange={() => handleSelect(booking.bookingId)}
                        disabled={booking.checkin}
                      />
                    </TableCell>
                    <TableCell>{booking.bookingId}</TableCell>
                    <TableCell>{booking.courtId}</TableCell>
                    <TableCell>
                      {booking.totalPrice.toLocaleString()} đ
                    </TableCell>
                    <TableCell>
                      {booking.checkin ? (
                        <span className="text-green-600 font-semibold">
                          Checked-in
                        </span>
                      ) : (
                        <span className="text-gray-500">Not yet</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="detail"
                        onClick={() => handleViewDetail(booking.bookingId)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination dưới bảng */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              type="button"
              variant="page"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Prev
            </Button>
            <span className="text-md font-medium w-96 text-center">
              Page {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="page"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckinCustomer;
