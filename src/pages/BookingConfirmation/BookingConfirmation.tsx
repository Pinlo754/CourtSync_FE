"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { User } from "../../types/user";
import { fetcher, postData } from "../../api/fetchers";
interface BookingData {
  facilityId: number;
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  courtId: number;
  selectedDate: string;
  selectedSlots: string[];
  totalHours: number;
  totalPrice: number;
  startTimes: string;
  endTimes: string;
  note: string;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

interface PaymentInfo {
  method: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDataFromState = location.state as BookingData;
  const [bookingData] = useState<BookingData>(bookingDataFromState);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "info" | "payment" | "success"
  >("info");
  const [user, setUser] = useState<User | null>(null);

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePaymentInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paymentInfo.method) {
      newErrors.method = "Vui lòng chọn phương thức thanh toán";
    }

    if (paymentInfo.method === "card") {
      if (!paymentInfo.cardNumber.trim()) {
        newErrors.cardNumber = "Vui lòng nhập số thẻ";
      } else if (
        !/^[0-9]{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ""))
      ) {
        newErrors.cardNumber = "Số thẻ không hợp lệ";
      }

      if (!paymentInfo.expiryDate.trim()) {
        newErrors.expiryDate = "Vui lòng nhập ngày hết hạn";
      } else if (
        !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentInfo.expiryDate)
      ) {
        newErrors.expiryDate = "Định dạng MM/YY";
      }

      if (!paymentInfo.cvv.trim()) {
        newErrors.cvv = "Vui lòng nhập CVV";
      } else if (!/^[0-9]{3,4}$/.test(paymentInfo.cvv)) {
        newErrors.cvv = "CVV không hợp lệ";
      }

      if (!paymentInfo.cardName.trim()) {
        newErrors.cardName = "Vui lòng nhập tên chủ thẻ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === "info") {
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (validatePaymentInfo()) {
        handlePayment();
      }
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    localStorage.removeItem("bookingData");
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    if (
      paymentInfo.method === "card" ||
      paymentInfo.method === "momo" ||
      paymentInfo.method === "zalopay"
    ) {
      setLoading(false);
      toast.warning(
        "Phương thức thanh toán bạn chọn đang được phát triển, vui lòng chọn phương thức khác!"
      );
      console.log(
        "Phương thức thanh toán bạn chọn đang được phát triển, vui lòng chọn phương thức khác!"
      );
      return;
    } else if (paymentInfo.method == "wallet") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (userBalance < bookingData.totalPrice) {
        setLoading(false);
        toast.warning(
          "Số dư trong ví không đủ, xin vui lòng nộp thêm hoặc chọn phương thức thanh toán khác!"
        );
        console.log(
          "Số dư trong ví không đủ, xin vui lòng nộp thêm hoặc chọn phương thức thanh toán khác!"
        );
        return;
      }
      try {
        const response = await postData(
          "https://localhost:7255/api/Booking/CreateBooking",
          {
            courtId: bookingData.courtId,
            note: bookingData.note,
            totalPrice: bookingData.totalPrice,
            startTimes: bookingData.startTimes,
            endTimes: bookingData.endTimes,
          }
        );
        console.log(response);
        console.log("createbooking:", response.bookingId);
        if (response.bookingId) {
          const res = await postData(
            "https://localhost:7255/api/Transaction/PayBookingCourt",
            {
              bookingId: response.bookingId,
            }
          );
          console.log("payment:", res);
          toast.success(
            "Đặt sân thành công! Chuyển đến trang Profile sau 2 giây..."
          );
          setTimeout(() => {
            navigate("/profile");
          }, 2500);
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert("Có lỗi xảy ra trong quá trình thanh toán bằng ví");
      } finally {
        setLoading(false);
      }
    } else if (paymentInfo.method == "banking") {
      console.log("continue");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    const userString = sessionStorage.getItem("loggedUser");
    const loggedUser = userString ? JSON.parse(userString) : null;
    console.log("logged:", loggedUser);
    setUser(loggedUser);

    const fetchBalance = async () => {
      try {
        const res = await fetcher("/Users/GetUserBalance");
        console.log("balance:", res);
        setUserBalance(res);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đặt sân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer position="top-right" autoClose={2000} />
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt sân thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt sân. Chúng tôi sẽ gửi thông tin chi tiết qua
              email.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/")} className="w-full">
                Về trang chủ
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/bookings")}
                className="w-full bg-transparent"
              >
                Xem lịch đặt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentStep === "info" ? "Thông tin đặt sân" : "Thanh toán"}
              </h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "info" ? "text-blue-600" : "text-green-600"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "info"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Thông tin</span>
              </div>
              <div
                className={`w-8 h-0.5 ${
                  currentStep === "payment" ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "payment" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "payment"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Thanh toán</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === "info" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={user?.firstName + " " + user?.lastName}
                        onChange={(e: any) => {}}
                        disabled
                        placeholder="Nhập họ và tên"
                        className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={user?.phoneNumber ?? ""}
                        onChange={(e: any) => {}}
                        disabled
                        placeholder="Nhập số điện thoại"
                        className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email ?? ""}
                      onChange={(e: any) => {}}
                      disabled
                      placeholder="Nhập địa chỉ email"
                      className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <Label htmlFor="customerNote">Ghi chú thêm</Label>
                    <Input
                      id="customerNote"
                      value={customerInfo.note}
                      onChange={(e: any) =>
                        setCustomerInfo({
                          ...customerInfo,
                          note: e.target.value,
                        })
                      }
                      placeholder="Yêu cầu đặc biệt (tùy chọn)"
                      className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                    />
                  </div> */}
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-4">
                      Chọn phương thức thanh toán *
                    </Label>
                    <Select
                      value={paymentInfo.method}
                      onValueChange={(value: any) =>
                        setPaymentInfo({ ...paymentInfo, method: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.method ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="card">
                          Thẻ tín dụng/ghi nợ
                        </SelectItem>
                        <SelectItem value="momo">Ví MoMo</SelectItem>
                        <SelectItem value="zalopay">ZaloPay</SelectItem>
                        <SelectItem value="banking">VN Pay</SelectItem>
                        <SelectItem value="wallet">Ví</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.method && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.method}
                      </p>
                    )}
                  </div>

                  {paymentInfo.method === "card" && (
                    <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <Label htmlFor="cardNumber">
                          <div className="text-orange-800">Số thẻ *</div>
                        </Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardNumber: formatCardNumber(e.target.value),
                            })
                          }
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-orange-200  [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">
                            <div className="text-orange-800">
                              Ngày hết hạn *
                            </div>
                          </Label>
                          <Input
                            id="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={(e: any) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length >= 2) {
                                value =
                                  value.substring(0, 2) +
                                  "/" +
                                  value.substring(2, 4);
                              }
                              setPaymentInfo({
                                ...paymentInfo,
                                expiryDate: value,
                              });
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-orange-200  [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                          />
                          {errors.expiryDate && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cvv">
                            <div className="text-orange-800">CVV *</div>
                          </Label>
                          <Input
                            id="cvv"
                            value={paymentInfo.cvv}
                            onChange={(e: any) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                cvv: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            placeholder="123"
                            maxLength={4}
                            className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-orange-200 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                          />
                          {errors.cvv && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">
                          <div className="text-orange-800">Tên chủ thẻ *</div>
                        </Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName}
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardName: e.target.value,
                            })
                          }
                          placeholder="NGUYEN VAN A"
                          className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-orange-200  [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
                        />
                        {errors.cardName && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.cardName}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-orange-700">Đang phát triển</p>
                    </div>
                  )}

                  {paymentInfo.method === "momo" && (
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="flex items-center space-x-3">
                        <Wallet className="h-8 w-8 text-pink-600" />
                        <div>
                          <p className="font-medium text-pink-900">
                            Thanh toán qua MoMo
                          </p>
                          <p className="text-sm text-pink-700">
                            Đang phát triển
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === "zalopay" && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Wallet className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">
                            Thanh toán qua ZaloPay
                          </p>
                          <p className="text-sm text-blue-700">
                            Đang phát triển
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === "banking" && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">VN Pay</p>
                          <p className="text-sm text-green-700">
                            Vui lòng chọn thanh toán để chuyển sang trang thanh
                            toán bằng VN Pay
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === "wallet" && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Wallet className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">
                            Thanh toán bằng số dư trong ví
                          </p>
                          <p className="text-sm text-blue-700">
                            Số dư hiện có: {userBalance} đ. Số dư sau thanh
                            toán: {userBalance - bookingData.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt sân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {bookingData.facilityName}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{bookingData.facilityAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Phone className="h-4 w-4" />
                    <span>{bookingData.facilityPhone}</span>
                  </div>
                </div>

                <div className="h-[1px] border border-gray-100 w-[60%]" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sân</span>
                    <Badge variant="secondary">Sân {bookingData.courtId}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày</span>
                    <span className="text-sm font-medium">
                      {formatDate(bookingData.selectedDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời gian</span>
                    <span className="text-sm font-medium">
                      {bookingData.selectedSlots[0]} -{" "}
                      {
                        bookingData.selectedSlots[
                          bookingData.selectedSlots.length - 1
                        ]
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Tổng thời gian
                    </span>
                    <span className="text-sm font-medium">
                      {bookingData.totalHours} giờ
                    </span>
                  </div>

                  {bookingData.note && (
                    <div>
                      <span className="text-sm text-gray-600">Ghi chú:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {bookingData.note}
                      </p>
                    </div>
                  )}
                </div>

                <div className="h-[1px] border border-gray-100 w-[60%]" />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Tổng tiền</span>
                  <span className="text-green-600">
                    {bookingData.totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  console.log();
                  handleNextStep();
                }}
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Đang xử lý..."
                  : currentStep === "info"
                  ? "Tiếp tục thanh toán"
                  : `Thanh toán ${bookingData.totalPrice.toLocaleString(
                      "vi-VN"
                    )} đ`}
              </Button>

              {currentStep === "payment" && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("info")}
                  className="w-full bg-transparent"
                >
                  Quay lại
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
