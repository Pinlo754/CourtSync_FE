"use client";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Mail,
} from "lucide-react";
import { postData } from "../../api/fetchers";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
interface VNPayResponse {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

interface BookingInfo {
  facilityName: string;
  courtId: number;
  selectedDate: string;
  selectedTime: string;
  totalHours: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

// Mock booking info - trong thực tế sẽ lấy từ database dựa trên vnp_TxnRef
const mockBookingInfo: BookingInfo = {
  facilityName: "Sân cầu lông Tám Khỏe",
  courtId: 3,
  selectedDate: "2025-01-23",
  selectedTime: "08:00 - 10:00",
  totalHours: 2,
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  customerEmail: "nguyenvana@gmail.com",
};

const getPaymentStatus = (
  responseCode: string,
  transactionStatus: string,
  isDeposit = false
) => {
  if (responseCode === "00" && transactionStatus === "00") {
    return {
      status: "success",
      message: isDeposit ? "Nạp tiền thành công" : "Thanh toán thành công",
      description: isDeposit
        ? "Tiền đã được nạp vào ví của bạn"
        : "Giao dịch đã được xử lý thành công",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  } else if (responseCode === "24") {
    return {
      status: "cancelled",
      message: "Giao dịch bị hủy",
      description: "Khách hàng đã hủy giao dịch",
      icon: XCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  } else {
    return {
      status: "failed",
      message: isDeposit ? "Nạp tiền thất bại" : "Thanh toán thất bại",
      description: "Giao dịch không thành công, vui lòng thử lại",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  }
};

const getBankName = (bankCode: string) => {
  const banks: Record<string, string> = {
    NCB: "Ngân hàng NCB",
    AGRIBANK: "Ngân hàng Agribank",
    SCB: "Ngân hàng SCB",
    SACOMBANK: "Ngân hàng Sacombank",
    EXIMBANK: "Ngân hàng Eximbank",
    MSBANK: "Ngân hàng Maritime Bank",
    NAMABANK: "Ngân hàng Nam A Bank",
    VNMART: "Ví VnMart",
    VIETINBANK: "Ngân hàng Vietinbank",
    VIETCOMBANK: "Ngân hàng VCB",
    HDBANK: "Ngân hàng HDBank",
    DONGABANK: "Ngân hàng Dong A",
    TPBANK: "Ngân hàng TPBank",
    OJB: "Ngân hàng OceanBank",
    BIDV: "Ngân hàng BIDV",
    TECHCOMBANK: "Ngân hàng Techcombank",
    VPBANK: "Ngân hàng VPBank",
    MBBANK: "Ngân hàng MB",
    ACB: "Ngân hàng ACB",
    OCB: "Ngân hàng OCB",
    IVB: "Ngân hàng IVB",
    VISA: "Thẻ quốc tế Visa",
  };
  return banks[bankCode] || bankCode;
};

const formatAmount = (amount: string) => {
  const numAmount = Number.parseInt(amount) / 100; // VNPay trả về amount * 100
  return numAmount.toLocaleString("vi-VN");
};

const formatDateTime = (dateTime: string) => {
  // Format: YYYYMMDDHHmmss
  const year = dateTime.substring(0, 4);
  const month = dateTime.substring(4, 6);
  const day = dateTime.substring(6, 8);
  const hour = dateTime.substring(8, 10);
  const minute = dateTime.substring(10, 12);
  const second = dateTime.substring(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export default function PaymentResponsePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [vnpayData, setVnpayData] = useState<VNPayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingInfo] = useState<BookingInfo>(mockBookingInfo);
  const [action, setAction] = useState<string | null>(null);
  const [depositInfo, setDepositInfo] = useState<{
    amount: number;
    newBalance: number;
  } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: Partial<VNPayResponse> = {};

    searchParams.forEach((value, key) => {
      params[key as keyof VNPayResponse] = decodeURIComponent(
        value.replace(/\+/g, " ")
      );
    });

    if (params.vnp_ResponseCode) {
      const vnpadata = params as VNPayResponse;
      console.log(vnpadata);
      setVnpayData(vnpadata);
    }
    setLoading(false);
  }, [location.search]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("action");
      sessionStorage.removeItem("depositInfo");
    };
  }, []);

  useEffect(() => {
    console.log("data:", vnpayData);
  });
  const handleDownloadReceipt = () => {
    // Tạo và download receipt PDF
    console.log("Downloading receipt...");
    // Implement PDF generation logic here
  };

  const handleSendEmail = () => {
    // Gửi email xác nhận
    console.log("Sending confirmation email...");
    // Implement email sending logic here
  };

  const calledRef = useRef(false);
  useEffect(() => {
    const Callback = async () => {
      const depositData = {
        vnp_Amount: vnpayData?.vnp_Amount,
        vnp_OrderInfo: vnpayData?.vnp_OrderInfo,
        vnp_ResponseCode: vnpayData?.vnp_ResponseCode,
      };

      if (vnpayData?.vnp_ResponseCode && vnpayData?.vnp_TransactionNo && vnpayData?.vnp_ResponseCode) {
    setLoading(true);

      const response = await postData(
        "/Transaction/DepositCallBack",
        depositData
      );
      console.log(depositData);
      console.log("result", response)
      calledRef.current = true;
      setLoading(false);
    };
  } 
  console.log("action:" , action)
    Callback();
  }, [vnpayData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!vnpayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lỗi xử lý thanh toán
            </h2>
            <p className="text-gray-600 mb-6">
              Không tìm thấy thông tin giao dịch
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentStatus = getPaymentStatus(
    vnpayData.vnp_ResponseCode,
    vnpayData.vnp_TransactionStatus,
    action === "deposit"
  );
  const StatusIcon = paymentStatus.icon;

  const downloadDivAsPdf = async (elementId: string) => {
  const input = document.getElementById(elementId);
  if (!input) return;

  // Chụp thẻ và toàn bộ thẻ con
  const canvas = await html2canvas(input, {
    scale: 2, // Độ nét cao
    useCORS: true, // Hỗ trợ ảnh từ server
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");

  // Khởi tạo PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Nếu chiều cao lớn hơn 1 trang, tự động chia trang
  let heightLeft = pdfHeight;
  let position = 0;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
    if (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
    }
  }

  pdf.save("download.pdf");
};

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
                Kết quả thanh toán
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Payment Status */}
          <Card
            className={`${paymentStatus.bgColor} ${paymentStatus.borderColor} border-2`}
          >
            <CardContent className="text-center p-8">
              <StatusIcon
                className={`h-16 w-16 ${paymentStatus.color} mx-auto mb-4`}
              />
              <h2 className={`text-2xl font-bold ${paymentStatus.color} mb-2`}>
                {paymentStatus.message}
              </h2>
              <p className="text-gray-600">{paymentStatus.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6" id="invoice">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mã giao dịch</span>
                  <Badge variant="secondary">
                    {vnpayData.vnp_TransactionNo}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mã đơn hàng</span>
                  <span className="text-sm font-medium">
                    {vnpayData.vnp_TxnRef}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số tiền</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatAmount(vnpayData.vnp_Amount)} đ
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ngân hàng</span>
                  <span className="text-sm font-medium">
                    {getBankName(vnpayData.vnp_BankCode)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loại thẻ</span>
                  <span className="text-sm font-medium">
                    {vnpayData.vnp_CardType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thời gian</span>
                  <span className="text-sm font-medium">
                    {formatDateTime(vnpayData.vnp_PayDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mã phản hồi</span>
                  <Badge
                    variant={
                      paymentStatus.status === "success"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {vnpayData.vnp_ResponseCode}
                  </Badge>
                </div>

                <div>
                  <span className="text-sm text-gray-600">
                    Nội dung thanh toán
                  </span>
                  <p className="text-sm font-medium mt-1">
                    {vnpayData.vnp_OrderInfo}
                  </p>
                </div>
              </CardContent>
            </Card>

            {action === "deposit" ? (
              // Deposit Information
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin nạp tiền</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số tiền nạp</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatAmount(vnpayData.vnp_Amount)} đ
                    </span>
                  </div>

                  {depositInfo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số dư mới</span>
                      <span className="text-lg font-bold text-blue-600">
                        {depositInfo.newBalance.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phí giao dịch</span>
                    <span className="text-sm font-medium text-green-600">
                      Miễn phí
                    </span>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Nạp tiền thành công!</p>
                        <p>
                          Số tiền đã được cộng vào ví của bạn và có thể sử dụng
                          ngay.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Booking Details (existing code)
              // <Card>
              //   <CardHeader>
              //     <CardTitle>Thông tin đặt sân</CardTitle>
              //   </CardHeader>
              //   <CardContent className="space-y-4">
              //     <div>
              //       <span className="text-sm text-gray-600">Tên sân</span>
              //       <p className="font-semibold">{bookingInfo.facilityName}</p>
              //     </div>

              //     <div className="flex items-center justify-between">
              //       <span className="text-sm text-gray-600">Sân số</span>
              //       <Badge variant="outline">Sân {bookingInfo.courtId}</Badge>
              //     </div>

              //     <div className="flex items-center justify-between">
              //       <span className="text-sm text-gray-600">Ngày chơi</span>
              //       <span className="text-sm font-medium">
              //         {bookingInfo.selectedDate}
              //       </span>
              //     </div>

              //     <div className="flex items-center justify-between">
              //       <span className="text-sm text-gray-600">Thời gian</span>
              //       <span className="text-sm font-medium">
              //         {bookingInfo.selectedTime}
              //       </span>
              //     </div>

              //     <div className="flex items-center justify-between">
              //       <span className="text-sm text-gray-600">
              //         Tổng thời gian
              //       </span>
              //       <span className="text-sm font-medium">
              //         {bookingInfo.totalHours} giờ
              //       </span>
              //     </div>

              //     <div>
              //       <span className="text-sm text-gray-600">
              //         Thông tin khách hàng
              //       </span>
              //       <div className="mt-2 space-y-1">
              //         <p className="text-sm font-medium">
              //           {bookingInfo.customerName}
              //         </p>
              //         <p className="text-sm text-gray-600">
              //           {bookingInfo.customerPhone}
              //         </p>
              //         <p className="text-sm text-gray-600">
              //           {bookingInfo.customerEmail}
              //         </p>
              //       </div>
              //     </div>
              //   </CardContent>
              // </Card>
              <></>
            )}
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {paymentStatus.status === "success" && (
                  <>
                    <Button
                      onClick={() => downloadDivAsPdf ("invoice")}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tải hóa đơn
                    </Button>
                  </>
                )}

                <Button onClick={() => navigate("/")} className="flex-1">
                  Về trang chủ
                </Button>

                {action === "deposit" ? (
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Xem ví
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Xem lịch đặt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Lưu ý bảo mật</p>
                <p>
                  Vui lòng lưu lại thông tin giao dịch này. Nếu có bất kỳ thắc
                  mắc nào, hãy liên hệ với chúng tôi qua hotline:{" "}
                  <strong>1900-xxxx</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
