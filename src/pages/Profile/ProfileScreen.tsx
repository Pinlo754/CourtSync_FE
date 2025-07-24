import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  User,
  Lock,
  Camera,
  Save,
  History,
  Wallet,
} from "lucide-react";
import Header from "../../components/sections/Header";
import useProfile from "./useProfile";
import { BookingHistoryCard } from "../../components/ui/booking-history-card";
import { BookingDetailModal } from "../../components/ui/booking-detail-modal";
import { WalletSection } from "../../components/ui/wallet";
export default function ProfilePage() {
  const {
    user,
    formData,
    passwordData,
    saving,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handlePasswordUpdate,
    bookings,
    handleViewDetails,
    handleCloseModal,
    selectedBooking,
    showDetailModal,
    userBalance
  } = useProfile();
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h2>
          <a href="/login">
            <Button>Go to Login</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 h-screen overflow-y-scroll scrollbar-hide px-16">
      <div className="h-21">
        <Header />
      </div>

      {/* Profile Hero */}
      <section className="w-[80%] h-96 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-lg mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={"/placeholder.svg"} alt={user.firstName} />
              <AvatarFallback className="text-2xl bg-blue-500">
                {user?.firstName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white text-blue-600 hover:bg-gray-100">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-blue-100 mb-1">{user.email}</p>
          <p className="text-blue-100 mb-6">{user.phoneNumber}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                  Chỉnh sửa thông tin cá nhân
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Bảo mật
                </CardTitle>
                <CardDescription>
                  Quản lí mật khẩu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Xác thực mật khẩu mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  variant="secondary"
                  className="w-full md:w-auto bg-transparent"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Lịch sử đặt sân
                </CardTitle>
                <CardDescription>
                  Lịch sử đặt sân của bản thân và thông tin chi tiết
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 h-[500px] overflow-y-scroll scrollbar-hide">
                {bookings.map((booking) => (
                  <>
                    <BookingHistoryCard
                      key={booking.bookingId}
                      booking={booking}
                      onViewDetails={handleViewDetails}
                    />
                    {selectedBooking && (
                      <BookingDetailModal
                        booking={selectedBooking}
                        onClose={handleCloseModal}
                        open={showDetailModal}
                      />
                    )}
                  </>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Ví
                </CardTitle>
                <CardDescription>Số dư tài khoản - dùng để đặt sân</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <WalletSection balance={userBalance ?? user.balance} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
