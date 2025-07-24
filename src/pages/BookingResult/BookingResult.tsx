"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Download,
  Home,
  History,
  Share2,
  Copy,
} from "lucide-react"

interface BookingSuccessData {
  bookingId: number
  facilityName: string
  facilityAddress: string
  facilityPhone: string
  courtId: number
  selectedDate: string
  selectedRanges: Array<{
    start: string
    end: string
    display: string
  }>
  totalHours: number
  totalPrice: number
  note: string
  customerName: string
  customerPhone: string
  customerEmail: string
  bookingReference: string
  paymentStatus: string
  paymentMethod: string
  bookingDate: string
}

// Mock data - trong thực tế sẽ lấy từ API hoặc props
const mockBookingData: BookingSuccessData = {
  bookingId: 12345,
  facilityName: "Sân cầu lông Tám Khỏe",
  facilityAddress: "270 Bưng Ông Thoàn, Thủ Đức, Hồ Chí Minh",
  facilityPhone: "0901234567",
  courtId: 3,
  selectedDate: "2025-01-25",
  selectedRanges: [
    { start: "08:00", end: "08:30", display: "08:00-08:30" },
    { start: "08:30", end: "09:00", display: "08:30-09:00" },
    { start: "09:00", end: "09:30", display: "09:00-09:30" },
    { start: "09:30", end: "10:00", display: "09:30-10:00" },
  ],
  totalHours: 2,
  totalPrice: 200000,
  note: "Cần chuẩn bị vợt dự phòng",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  customerEmail: "nguyenvana@gmail.com",
  bookingReference: "BK2025012500001",
  paymentStatus: "pending", // pending, paid, failed
  paymentMethod: "wallet", // wallet, vnpay, cash
  bookingDate: "2025-01-24T15:30:00",
}

const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case "paid":
      return {
        label: "Đã thanh toán",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    case "pending":
      return {
        label: "Chờ thanh toán",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      }
    case "failed":
      return {
        label: "Thanh toán thất bại",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    default:
      return {
        label: "Không xác định",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
  }
}

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "wallet":
      return "Ví điện tử"
    case "vnpay":
      return "VNPay"
    case "cash":
      return "Thanh toán tại sân"
    default:
      return "Khác"
  }
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BookingSuccess() {
  const navigate = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bookingData] = useState<BookingSuccessData>(mockBookingData)
  const [copied, setCopied] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Animation delay
    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const paymentStatus = getPaymentStatusInfo(bookingData.paymentStatus)

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(bookingData.bookingReference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleDownloadReceipt = () => {
    // Implement PDF generation and download
    console.log("Downloading receipt...")
  }

  const handleShare = async () => {
    const shareData = {
      title: "Đặt sân thành công",
      text: `Đã đặt sân ${bookingData.facilityName} - Sân ${bookingData.courtId} vào ngày ${formatDate(bookingData.selectedDate)}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyReference()
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Đặt sân thành công</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleShare}  className="bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message */}
          <Card
            className={`bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 transform transition-all duration-500 ${
              showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <CardContent className="text-center p-8">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4 animate-bounce" />
                <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-green-100 animate-ping opacity-20"></div>
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">Đặt sân thành công!</h2>
              <p className="text-green-700 text-lg mb-4">
                Cảm ơn bạn đã đặt sân. Thông tin chi tiết đã được gửi qua email.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-sm text-green-600">Mã đặt sân:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-green-100 text-green-800">
                  {bookingData.bookingReference}
                </Badge>
                <Button onClick={handleCopyReference} className="p-1">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600">Đã sao chép mã đặt sân!</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Thông tin đặt sân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{bookingData.facilityName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{bookingData.facilityAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Phone className="h-4 w-4" />
                    <span>{bookingData.facilityPhone}</span>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sân số</label>
                    <p className="text-lg font-semibold">Sân {bookingData.courtId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày chơi</label>
                    <p className="font-medium">{formatDate(bookingData.selectedDate)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Khung giờ</label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingData.selectedRanges.map((range, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{range.display}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tổng thời gian</label>
                    <p className="text-lg font-semibold text-blue-600">{bookingData.totalHours} giờ</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tổng tiền</label>
                    <p className="text-xl font-bold text-green-600">
                      {bookingData.totalPrice.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>

                {bookingData.note && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                      <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{bookingData.note}</p>
                    </div>
                  </>
                )}


                <div>
                  <label className="text-sm font-medium text-gray-600">Thời gian đặt</label>
                  <p className="text-sm font-medium">{formatDateTime(bookingData.bookingDate)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Payment Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ tên</label>
                    <p className="font-medium">{bookingData.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="font-medium">{bookingData.customerPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="font-medium">{bookingData.customerEmail}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    <Badge
                      variant="secondary"
                      className={`${paymentStatus.bgColor} ${paymentStatus.color} ${paymentStatus.borderColor} border`}
                    >
                      {paymentStatus.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phương thức</span>
                    <span className="text-sm font-medium">{getPaymentMethodLabel(bookingData.paymentMethod)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số tiền</span>
                    <span className="text-lg font-bold text-green-600">
                      {bookingData.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  {bookingData.paymentStatus === "pending" && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Chờ thanh toán</p>
                          <p>Vui lòng hoàn tất thanh toán để xác nhận đặt sân</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <Button onClick={handleDownloadReceipt} variant="outline" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Tải hóa đơn
                </Button>

                <Button onClick={() => navigate("/profile")} variant="outline" className="bg-transparent">
                  <History className="h-4 w-4 mr-2" />
                  Xem lịch đặt
                </Button>

                <Button onClick={() => navigate("/")} variant="outline" className="bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Lưu ý quan trọng</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Vui lòng có mặt tại sân trước giờ chơi ít nhất 15 phút</p>
                <p>• Mang theo giấy tờ tùy thân và mã đặt sân để check-in</p>
                <p>• Liên hệ hotline {bookingData.facilityPhone} nếu cần hỗ trợ</p> 
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="text-center p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h3>
              <p className="text-gray-600 mb-4">Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào</p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Hotline: 1900-xxxx</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Email: support@badminton.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
