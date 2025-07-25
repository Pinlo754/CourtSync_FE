import React, { useEffect, useRef, useState } from "react";
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
import { useStaffCheckin } from "../hooks/useStaffCheckin";
import { BookingElements } from "../type";
import { CheckinDetailBox } from "./checkinDetailBox";
import QrScanner from "qr-scanner";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";


const PAGE_SIZE = 5;

const CheckinCustomer: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [listBooking, setListBooking] = useState<BookingElements[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const { getAllBookingInFacility, checkinBooking, getFacilityIdByStaffId } =
    useStaffCheckin();
  const [selectedBooking, setSelectedBooking] = useState<BookingElements | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [qrData, setQrData] = useState<string>("");
  const fetchData = async () => {
    const facilityId = await getFacilityIdByStaffId();
    const data = await getAllBookingInFacility(facilityId);
    setListBooking(data.$values || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(listBooking.length / PAGE_SIZE || 0);

  const handleSelect = (bookingId: number) => {
    setSelected((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    // Chỉ lấy bookingId của những booking chưa check-in
    const idsOnPage = bookingsToShow
      .filter((b) => b.checkinStatus !== "1")
      .map((b) => b.bookingId);

    if (idsOnPage.every((id) => selected.includes(id))) {
      setSelected((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    }
  };

  const handleCheckin = async () => {
    try {
      if (window.confirm(`Bạn có chắc chắn muốn check-in cho các đặt sân: ${selected.join(", ")}?`)) {
        await checkinBooking(selected);
        fetchData();
        setSelected([]);
        setError("")
      }
    } catch (error) {
      setError("Check-in thất bại");
    }
  };
  const handleCheckinCamera = async (qrData: string) => {
    try {
    if (window.confirm(`Bạn có chắc chắn muốn check-in cho sân: ${qrData}?`)) {
      await checkinBooking([Number(qrData)])
      fetchData();
      setSelected([]);
      setError("")
    }
    } catch (error) {
      setError("Check-in thất bại");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        // Đảo chiều sort nếu bấm lại cùng 1 cột
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleOpenDetails = (booking: BookingElements) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const sortedBookings = React.useMemo(() => {
    if (!sortConfig) return listBooking;
    const sorted = [...listBooking].sort((a, b) => {
      if (
        a[sortConfig.key as keyof BookingElements] <
        b[sortConfig.key as keyof BookingElements]
      )
        return sortConfig.direction === "asc" ? -1 : 1;
      if (
        a[sortConfig.key as keyof BookingElements] >
        b[sortConfig.key as keyof BookingElements]
      )
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [listBooking, sortConfig]);

  const bookingsToShow = sortedBookings?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (result?.data) {
          setQrData(result.data);
        }
      },
      {
        onDecodeError: (error) => {
          console.error("Decode error:", error);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;

    scanner
      .start()
      .then(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
          videoEl.addEventListener(
            "loadedmetadata",
            () => {
              videoEl.play().catch((err) => console.log("Play failed:", err));
            },
            { once: true }
          );
        }
      })
      .catch((err) => console.error("Scanner start error:", err));

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (qrData) {
      handleCheckinCamera(qrData);
      console.log("ID checkin:", qrData);
    }
  }, [qrData]);

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <ErrorMessage message={error} show={true} />}
      <Card className="bg-blue-300/20 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Check-in Sân</h1>
            <Button
              type="button"
              variant="custom"
              onClick={handleCheckin}
              disabled={selected.length === 0}
              className="bg-gradient-to-r from-blue-300 to-mint-400 text-slate-800 px-6 py-2 rounded-lg shadow-lg text-base font-bold hover:from-mint-400 hover:to-blue-700 hover:text-white transition-all duration-300 w-56 h-auto min-h-0"
            >
              Check-in đã chọn
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
                  <TableHead>Tên người đặt</TableHead>
                  <TableHead>Sân</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead
                    onClick={() => handleSort("bookingDate")}
                    className="cursor-pointer"
                  >
                    Ngày đặt sân{" "}
                    {sortConfig?.key === "bookingDate"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("checkinStatus")}
                    className="cursor-pointer"
                  >
                    Trạng thái check-in{" "}
                    {sortConfig?.key === "checkinStatus"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                  <TableHead>Hành động</TableHead>
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
                        disabled={booking.checkinStatus === "1"}
                      />
                    </TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.courtName}</TableCell>
                    <TableCell>
                      {booking.totalPrice.toLocaleString()} đ
                    </TableCell>
                    <TableCell>
                      {new Date(booking.bookingDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {booking.checkinStatus === "1" ? (
                        <span className="text-green-600 font-semibold">
                          Đã check-in
                        </span>
                      ) : (
                        <span className="text-gray-500">Chưa check-in</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="detail"
                        onClick={() => handleOpenDetails(booking)}
                      >
                        Chi tiết
                      </Button>
                      {selectedBooking && (
                        <CheckinDetailBox
                          booking={selectedBooking}
                          onClose={handleCloseDetails}
                          open={showDetailModal}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* QR scanner */}
          <div className="fixed top-4 right-4 w-64 z-50">
            <video
              ref={videoRef}
              className="w-80 h-40 object-cover rounded-xl border-4 border-white"
              muted
              playsInline
            />
            <p className="mt-4 text-lg">
              Kết quả: {qrData || "Chưa có dữ liệu"}
            </p>
          </div>

          {/* Pagination dưới bảng */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              type="button"
              variant="page"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Trang trước
            </Button>
            <span className="text-md font-medium w-96 text-center">
              Trang {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="page"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Trang tiếp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckinCustomer;
