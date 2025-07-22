"use client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  User,
  Calendar,
  Lock,
  Settings,
  Bell,
  Globe,
  Clock,
  Heart,
  DollarSign,
  Star,
  Activity,
  Trash2,
  Camera,
  Save,
  History,
} from "lucide-react";
import Header from "../../components/sections/Header";
import useProfile from "./useProfile";
import { BookingHistoryCard } from "../../components/ui/booking-history-card";
import { BookingDetailModal } from "../../components/ui/booking-detail-modal";
export default function ProfilePage() {
  const {
    user,
    userStats,
    recentActivities,
    favoriteCourts,
    formData,
    setFormData,
    preferences,
    setPreferences,
    passwordData,
    setPasswordData,
    saving,
    handleInputChange,
    handlePreferenceChange,
    handlePasswordChange,
    handleSaveProfile,
    handlePasswordUpdate,
    bookings,
    handleViewDetails,
    handleCloseModal,
    selectedBooking,
    setSelectedBooking,
    showDetailModal
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
              <AvatarImage
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.full_name}
              />
              <AvatarFallback className="text-2xl bg-blue-500">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white text-blue-600 hover:bg-gray-100">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">{user.full_name}</h1>
          <p className="text-blue-100 mb-1">{user.email}</p>
          <p className="text-blue-100 mb-6">{user.phone}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        handleInputChange("date_of_birth", e.target.value)
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

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
              <CardContent className="space-y-4 h-[1000px] overflow-y-scroll scrollbar-hide">
                {bookings.map((booking) => (
                  <>
                  <BookingHistoryCard
                    key={booking.bookingId}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                  />
                   {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={handleCloseModal} open={showDetailModal} />
      )}
                  </>
                ))}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
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
                      Confirm New Password
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
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app experience and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Receive booking confirmations and updates via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("emailNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Get text messages for important updates
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={preferences.smsNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("smsNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("pushNotifications", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 h-[1px] w-[60%]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                    </Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        handlePreferenceChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Timezone
                    </Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        handlePreferenceChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">
                          Pacific Time (UTC-8)
                        </SelectItem>
                        <SelectItem value="UTC-5">
                          Eastern Time (UTC-5)
                        </SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+7">
                          Vietnam Time (UTC+7)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button variant="secondary" className="text-[red]">
                    <Trash2 className="h-4 w-4 mr-2 text-[red]" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Total Bookings</span>
                  </div>
                  <span className="font-bold text-lg">
                    {userStats.totalBookings}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Favorite Courts</span>
                  </div>
                  <span className="font-bold text-lg">
                    {userStats.favoriteCourts}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Total Spent</span>
                  </div>
                  <span className="font-bold text-lg">
                    ${userStats.totalSpent}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="bg-blue-100 rounded-full p-1">
                        <activity.icon className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="w-full mt-4 bg-transparent"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Favorite Courts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Favorite Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {favoriteCourts.map((court) => (
                    <div key={court.id} className="flex items-center space-x-3">
                      <img
                        src={court.image || "/placeholder.svg"}
                        alt={court.name}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {court.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {court.rating}
                            </span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">
                            ${court.price}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="w-full mt-4 bg-transparent"
                >
                  Manage Favorites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
