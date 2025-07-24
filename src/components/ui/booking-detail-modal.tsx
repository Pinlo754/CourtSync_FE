"use client"

import { Button } from "../..//components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Calendar, Clock, CreditCard, FileText, CheckCircle } from "lucide-react"
import { BookingHistoryItem,  getBookingStatus,
  getTransactionStatus,
  getCheckinStatus,
  formatDateTime,
  formatTime,
  calculateDuration, } from "../../types/booking"

interface BookingDetailModalProps {
  booking: BookingHistoryItem
  onClose: () => void
  open: boolean
}

export function BookingDetailModal({ booking, onClose, open }: BookingDetailModalProps) {
  const bookingStatus = getBookingStatus(booking.bookingStatus)
  const transactionStatus = getTransactionStatus(booking.transactionStatus)
  const checkinStatus = getCheckinStatus(booking.checkinStatus)
  const StatusIcon = bookingStatus.icon

  const duration = calculateDuration(booking.startTime.$values, booking.endTime.$values)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-5 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10 bg-white rounded-full p-2 shadow-md"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Chi tiết đặt sân #{booking.bookingId}</span>
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${bookingStatus.bgColor} ${bookingStatus.color}`}
                >
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {bookingStatus.label}
                </div>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${transactionStatus.bgColor} ${transactionStatus.color}`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {transactionStatus.label}
                </div>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-50 ${checkinStatus.color}`}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {checkinStatus.label}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Thông tin đặt sân</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã đặt sân</label>
                    <p className="text-lg font-semibold">#{booking.bookingId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sân số</label>
                    <Badge variant="outline" className="text-sm">
                      Sân {booking.courtId}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cơ sở</label>
                    <p className="font-medium">Facility #{booking.facilityId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày đặt</label>
                    <p className="font-medium">{formatDateTime(booking.bookingDate)}</p>
                  </div>
                </div>


                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Lịch chơi</label>
                  <div className="space-y-2">
                    {booking.startTime.$values.map((startTime, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {formatDateTime(startTime)} - {formatTime(booking.endTime.$values[index] || startTime)}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {(
                            (new Date(booking.endTime.$values[index] || startTime).getTime() -
                              new Date(startTime).getTime()) /
                            (1000 * 60 * 60)
                          ).toFixed(1)}
                          h
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tổng thời gian</label>
                    <p className="text-lg font-semibold text-blue-600">{duration.toFixed(1)} giờ</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tổng tiền</label>
                    <p className="text-xl font-bold text-green-600">{booking.totalPrice.toLocaleString("vi-VN")} đ</p>
                  </div>
                </div>

                {booking.note && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                      <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{booking.note}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transaction Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Thông tin giao dịch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã giao dịch</label>
                    <p className="text-lg font-semibold">#{booking.transactionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Loại giao dịch</label>
                    <Badge variant="outline">{booking.transactionType === "1" ? "Thanh toán" : "Hoàn tiền"}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái thanh toán</label>
                  <div
                    className={`mt-1 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${transactionStatus.bgColor} ${transactionStatus.color}`}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {transactionStatus.label}
                  </div>
                </div>

                {booking.transactionDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày thanh toán</label>
                    <p className="font-medium">{formatDateTime(booking.transactionDate)}</p>
                  </div>
                )}


                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số tiền</span>
                    <span className="font-semibold">{booking.totalPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phí dịch vụ</span>
                    <span className="font-semibold">0 đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giảm giá</span>
                    <span className="font-semibold">0 đ</span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng cộng</span>
                    <span className="font-bold text-green-600">{booking.totalPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Check-in Information */}
          {booking.checkinStatus === "1" && booking.cHeckinDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Thông tin check-in</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Đã check-in thành công</p>
                    <p className="text-sm text-gray-600">Thời gian: {formatDateTime(booking.cHeckinDate)}</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Đã check-in
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {booking.transactionStatus === "0" && (
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Thanh toán ngay
              </Button>
            )}

            {(booking.bookingStatus === "0" || booking.bookingStatus === "1") && (
              <Button className="flex-1">
                Hủy đặt sân
              </Button>
            )}

            <Button variant="outline" className="flex-1 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Tải hóa đơn
            </Button>

            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
