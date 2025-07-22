"use client"

import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Calendar, Clock, CreditCard, FileText, MoreHorizontal } from "lucide-react"
import {
  getBookingStatus,
  getTransactionStatus,
  getCheckinStatus,
  formatDateTime,
  formatTime,
  calculateDuration,
  BookingHistoryItem,
} from "../../types/booking"

interface BookingHistoryCardProps {
  booking: BookingHistoryItem
  onViewDetails: (booking: BookingHistoryItem) => void
}

export function BookingHistoryCard({ booking, onViewDetails }: BookingHistoryCardProps) {
  const bookingStatus = getBookingStatus(booking.bookingStatus)
  const transactionStatus = getTransactionStatus(booking.transactionStatus)
  const checkinStatus = getCheckinStatus(booking.checkinStatus)
  const StatusIcon = bookingStatus.icon

  const duration = calculateDuration(booking.startTime.$values, booking.endTime.$values)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                #{booking.bookingId}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Sân {booking.courtId}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Facility {booking.facilityId}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Đặt ngày: {formatDateTime(booking.bookingDate)}</p>
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bookingStatus.bgColor} ${bookingStatus.color}`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {bookingStatus.label}
          </div>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transactionStatus.bgColor} ${transactionStatus.color}`}
          >
            <CreditCard className="h-3 w-3 mr-1" />
            {transactionStatus.label}
          </div>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 ${checkinStatus.color}`}
          >
            {checkinStatus.label}
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          {/* Time Slots */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Lịch chơi:</span>
            </div>
            <div className="ml-6 space-y-1">
              {booking.startTime.$values.map((startTime, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>
                    {formatDateTime(startTime)} - {formatTime(booking.endTime.$values[index] || startTime)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
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

          {/* Price and Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Tổng thời gian: <strong>{duration.toFixed(1)} giờ</strong>
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">{booking.totalPrice.toLocaleString("vi-VN")} đ</p>
            </div>
          </div>

          {/* Note */}
          {booking.note && (
            <>
              <div className="text-sm">
                <span className="text-gray-600">Ghi chú: </span>
                <span className="text-gray-900">{booking.note}</span>
              </div>
            </>
          )}

          {/* Transaction Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Mã GD: #{booking.transactionId}</span>
            {booking.transactionDate && <span>Thanh toán: {formatDateTime(booking.transactionDate)}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={() => onViewDetails(booking)} className="flex-1 bg-transparent">
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
