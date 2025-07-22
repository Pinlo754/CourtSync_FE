import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
export interface BookingTime {
  courtId: number
  startTimes: {
    $values: string[]
  }
  endTimes: {
    $values: string[]
  }
}

export interface BookingResponse {
  $values: BookingTime[]
}

export interface PriceRequest {
  courtId: number
  startTimes: string[]
  endTimes: string[]
}

export interface BookingRequest {
  courtId: number
  note: string
  totalPrice: number
  startTimes: string[]
  endTimes: string[]
}

export interface TimeSlot {
  time: string
  hour: number
  minute: number
}

export interface CourtBooking {
  courtId: number
  selectedSlots: TimeSlot[]
  bookedSlots: { start: string; end: string }[]
}

export interface BookingHistoryItem {
  $id: string
  bookingId: number
  courtId: number
  facilityId: number
  bookingStatus: string
  checkinStatus: string
  cHeckinDate: string | null
  startTime: {
    $id: string
    $values: string[]
  }
  endTime: {
    $id: string
    $values: string[]
  }
  totalPrice: number
  note: string
  bookingDate: string
  transactionId: number
  transactionStatus: string
  transactionType: string
  transactionDate: string | null
}

export interface BookingHistoryResponse {
  $id: string
  $values: BookingHistoryItem[]
}

export interface BookingStatusInfo {
  label: string
  color: string
  bgColor: string
  icon: string
}

export interface TransactionStatusInfo {
  label: string
  color: string
  bgColor: string
}




export const getBookingStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    "0": {
      label: "Chờ xác nhận",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: Clock,
    },
    "1": {
      label: "Đã xác nhận",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: CheckCircle,
    },
    "2": {
      label: "Đã hủy",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: XCircle,
    },
    "3": {
      label: "Hoàn thành",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: CheckCircle,
    },
  }

  return (
    statusMap[status] || {
      label: "Không xác định",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: AlertCircle,
    }
  )
}

export const getTransactionStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    "0": {
      label: "Chờ thanh toán",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    "1": {
      label: "Đã thanh toán",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    "2": {
      label: "Thanh toán thất bại",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    "3": {
      label: "Đã hoàn tiền",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  }

  return (
    statusMap[status] || {
      label: "Không xác định",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    }
  )
}

export const getCheckinStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    "0": {
      label: "Chưa check-in",
      color: "text-gray-600",
    },
    "1": {
      label: "Đã check-in",
      color: "text-green-600",
    },
  }

  return (
    statusMap[status] || {
      label: "Không xác định",
      color: "text-gray-600",
    }
  )
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const calculateDuration = (startTimes: string[], endTimes: string[]) => {
  if (startTimes.length === 0 || endTimes.length === 0) return 0

  let totalMinutes = 0
  for (let i = 0; i < startTimes.length; i++) {
    const start = new Date(startTimes[i])
    const end = new Date(endTimes[i] || startTimes[i])
    totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60)
  }

  return totalMinutes / 60
}
