import { useState, useEffect } from "react";
import { Calendar, DollarSign, Heart, MapPin, Star } from "lucide-react";
import { BookingHistoryItem, BookingHistoryResponse } from "../../types/booking";
import { User } from "../../types/user";
import { fetcher, postData } from "../../api/fetchers";
const useProfile = () => {

  interface RecentActivity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    icon: any;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: "en",
    timezone: "UTC-8",
  });

  // Mock data

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "booking",
      description: "Booked Elite Badminton Center",
      timestamp: "2 hours ago",
      icon: Calendar,
    },
    {
      id: "2",
      type: "payment",
      description: "Payment completed - $35.50",
      timestamp: "2 hours ago",
      icon: DollarSign,
    },
    {
      id: "3",
      type: "favorite",
      description: "Added Victory Sports Hall to favorites",
      timestamp: "1 day ago",
      icon: Heart,
    },
    {
      id: "4",
      type: "checkin",
      description: "Checked in at Champion Courts",
      timestamp: "3 days ago",
      icon: MapPin,
    },
    {
      id: "5",
      type: "review",
      description: "Left a 5-star review",
      timestamp: "1 week ago",
      icon: Star,
    },
  ];

  const favoriteCourts = [
    {
      id: 1,
      name: "Elite Badminton Center",
      rating: 4.8,
      price: 25,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 2,
      name: "Victory Sports Hall",
      rating: 4.6,
      price: 20,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 3,
      name: "Champion Courts",
      rating: 4.9,
      price: 30,
      image: "/placeholder.svg?height=80&width=120",
    },
  ];

  useEffect(() => {
    const userString = sessionStorage.getItem('loggedUser');
    const loggedUser = userString ? JSON.parse(userString) : null;
      setUser(loggedUser);
  }, []);



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully!");
    }, 1000);
  };

  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryItem | null>(null)
   const [showDetailModal, setShowDetailModal] = useState(false)
   const [userBalance, setUserBalance] = useState<number>()
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await postData(
          "https://localhost:7255/api/Booking/UserViewBooking", {}          
        );
        const data: BookingHistoryResponse = await res;
        setBookings(data.$values);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đặt sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    const fetchBalance = async () => {
      try {
        const res = await fetcher(
          "/Users/GetUserBalance"          
        );
        console.log("balance:", res)
        setUserBalance(res);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đặt sân:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBalance();
  }, []);

  const handleViewDetails = (booking: BookingHistoryItem) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedBooking(null)
  }
  return {    
    user,
    formData,
    passwordData,
    saving,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handlePasswordUpdate,
    bookings: bookings || [],
    handleViewDetails,
    handleCloseModal,
    selectedBooking,
    showDetailModal,
    userBalance
  };
};
export default useProfile;
