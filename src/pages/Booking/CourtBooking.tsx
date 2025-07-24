"use client"

import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/label"
import { ArrowLeft, Calendar, MapPin, Phone, Clock } from "lucide-react"
import { useBooking } from "./useBooking"
import { Facility, FilterState, filterFacilities, sortFacilities } from "../../types/Facility"

 
export function CourtBooking() {
    
  const {
    // Facility data
    facility,
    facilityLoading,
    facilityError,
    facilityId,

    // Booking state
    selectedDate,
    selectedCourt,
    selectedSlots,
    totalPrice,
    note,
    loading,
    timeSlots,
    courts,
    totalHours,

    // Setters
    setSelectedDate,
    setNote,

    // Functions
    handleTimeSlotClick,
    handleBooking,
    handleCourtChange,
    clearSelection,
    getSlotStatus,
    getSlotColor,
  } = useBooking()

  // Loading state
  if (facilityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sân...</p>
        </div>
      </div>
    )
  }

  // Error state
 if (facilityError || !facility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sân</h1>
          <p className="text-gray-600 mb-4">{facilityError || "Sân bạn đang tìm không tồn tại."}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button className="text-white hover:bg-green-700" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Đặt lịch ngày trực quan</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Facility Info */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{facility.FacilityName}</h2>
              <p className="text-gray-600 text-sm mt-1">{facility.Description}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{facility.Address}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{facility.Phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {facility.OpeningTime} - {facility.ClosingTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span>Trống</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Đã đặt</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Khóa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Time Grid */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lịch đặt sân - {facility.NumberOfCourts} sân</CardTitle>
                  {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[1200px]">
                    {/* Time Header */}
                    <div className="grid grid-cols-[100px_repeat(38,1fr)] gap-1 mb-2">
                      <div></div>
                      {timeSlots.map((time) => (
                        <div key={time} className="w-[38px] ml-[3.4px] mr-[5px] text-xs  p-1 font-medium">
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Courts Grid */}
                    {courts.map((courtId, courtName) => (
                      <div key={courtId} className="grid grid-cols-[100px_repeat(38,1fr)] gap-1 mb-1">
                        <div
                          className={`flex items-center justify-center p-2 rounded text-sm font-medium cursor-pointer transition-colors ${
                            courtId === selectedCourt
                              ? "bg-green-100 text-green-800 border-2 border-green-500"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => handleCourtChange(courtId)}
                        >
                          Sân {courtName+1}
                        </div>
                        {timeSlots.map((timeSlot) => {
                          const status = getSlotStatus(courtId, timeSlot)
                          return (
                            <button
                              key={`${courtId}-${timeSlot}`}
                              onClick={() => {
                                handleCourtChange(courtId)
                                handleTimeSlotClick(timeSlot)
                              }}
                              disabled={status === "booked" || loading}
                              className={`h-8 w-[38px] ml-[3.4px] mr-[5px] rounded text-xs transition-colors ${getSlotColor(status)} ${
                                status === "booked"
                                  ? "cursor-not-allowed opacity-50"
                                  : "hover:opacity-80 cursor-pointer"
                              }`}
                              title={
                                status === "booked" ? "Đã được đặt" : status === "selected" ? "Đã chọn" : "Có thể đặt"
                              }
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt sân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div>
                  <Label>Sân đã chọn</Label>
                  <p className="text-lg font-semibold text-green-600">Sân {selectedCourt}</p>
                </div> */}

                <div>
                  <Label>Ngày đặt</Label>
                  <p className="font-medium">{selectedDate}</p>
                </div>

                <div>
                  <Label>Thời gian</Label>
                  <p className="font-medium">
                    {selectedSlots.length >= 2
                      ? `${selectedSlots[0]} - ${selectedSlots[selectedSlots.length - 1]}`
                      : "Chưa chọn"}
                  </p>
                </div>

                <div>
                  <Label>Tổng thời gian</Label>
                  <p className="text-lg font-semibold">{totalHours}h</p>
                </div>

                <div>
                  <Label>Giá sân</Label>
                  <p className="text-sm text-gray-600">{facility.MinPrice} - {facility.MaxPrice}</p>
                </div>

                <div>
                  <Label>Tổng tiền</Label>
                  <p className="text-xl font-bold text-green-600">{totalPrice.toLocaleString("vi-VN")} đ</p>
                </div>

                <div>
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú (tùy chọn)"
                    className="mt-1 [&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleBooking}
                    disabled={selectedSlots.length < 2 || totalPrice === 0 || loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "TIẾP THEO"}
                  </Button>

                  {selectedSlots.length > 0 && (
                    <Button variant="outline" onClick={clearSelection} className="w-full bg-transparent">
                      Xóa lựa chọn
                    </Button>
                  )}
                </div>

                {selectedSlots.length < 2 && (
                  <div className="text-sm text-gray-500 text-center">Vui lòng chọn ít nhất 2 khung giờ liên tiếp</div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hướng dẫn</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Click vào tên sân để chọn sân</p>
                <p>• Click vào ô thời gian để bắt đầu chọn</p>
                <p>• Click vào ô thời gian khác để kết thúc chọn</p>
                <p>• Ô đỏ: đã được đặt</p>
                <p>• Ô xanh: đang chọn</p>
                <p>• Ô trắng: có thể đặt</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
