import { useState, useEffect } from "react";
import { Calendar, DollarSign, Heart, MapPin, Star } from "lucide-react";
const useProfile = () => {
    interface UserProfile {
      id: string;
      email: string;
      full_name: string;
      phone: string;
      date_of_birth: string;
      avatar_url: string;
      created_at: string;
    }
    
    interface UserStats {
      totalBookings: number;
      favoriteCourts: number;
      totalSpent: number;
      memberSince: string;
    }
    
    interface RecentActivity {
      id: string;
      type: string;
      description: string;
      timestamp: string;
      icon: any;
    }

    const [user, setUser] = useState<UserProfile | null>(null);
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

  const mockUserProfile: UserProfile = {
    id: "1a2b3c4d",
    email: "johndoe@example.com",
    full_name: "John Doe",
    phone: "+84123456789",
    date_of_birth: "1990-05-15",
    avatar_url: "https://example.com/avatar/johndoe.jpg",
    created_at: "2024-07-01T10:30:00Z",
  };

  const userStats: UserStats = {
    totalBookings: 24,
    favoriteCourts: 5,
    totalSpent: 680,
    memberSince: "Jan 2024",
  };

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
    // fetchUserProfile()
    setUser(mockUserProfile);
  }, []);

  const fetchUserProfile = async () => {
    // try {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession()
    //   if (session?.user) {
    //     // Mock user data - in real app, fetch from database
    //     const mockUser: UserProfile = {
    //       id: session.user.id,
    //       email: session.user.email || "",
    //       full_name: session.user.user_metadata?.full_name || "John Doe",
    //       phone: "+1 (555) 123-4567",
    //       date_of_birth: "1990-01-15",
    //       avatar_url: "/placeholder.svg?height=120&width=120",
    //       created_at: "2024-01-15T00:00:00Z",
    //     }
    //     setUser(mockUser)
    //     setFormData({
    //       full_name: mockUser.full_name,
    //       email: mockUser.email,
    //       phone: mockUser.phone,
    //       date_of_birth: mockUser.date_of_birth,
    //     })
    //   }
    // } catch (error) {
    //   console.error("Error fetching profile:", error)
    // } finally {
    //   setLoading(false)
    // }
  };

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
    // Simulate API call
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
  return {
    user,
    loading,
    saving,
    activeTab,
    setActiveTab,
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    preferences,
    setPreferences,
    handleInputChange,
    handlePasswordChange,
    handlePreferenceChange,
    handleSaveProfile,
    handlePasswordUpdate,
    favoriteCourts,
    recentActivities,
    userStats,
    mockUserProfile,
    Calendar,
    DollarSign
  }
};
export default useProfile;