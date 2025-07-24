import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Phone,
    Mail,
    Clock,
    Edit3,
    Save,
    X,
    Calendar,
    Users,
    BarChart3,
    Settings,
    ChevronRight,
    Star,
    Zap,
    TrendingUp,
    Activity,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Gamepad2,
    UserCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { CourtCard } from '../../components/courts/CourtCard';
import { AddCourtModal } from '../../components/courts/AddCourtModal';
import { getCourtsByFacilityId, getFacilityById, Court, CourtPricing, getStaffByFacilityId, StaffInfo } from '../../api/facility/facilityApi';

interface FacilityDetail {
    $id: string;
    facilityId: number;
    facilityName: string;
    description: string;
    contactPhone: string;
    contactEmail: string;
    openingTime: string;
    closingTime: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    latitude: number | null;
    longtitude: number | null;
    facilityStatus: string;
    ownerId: number;
    staffId: number;
    distance?: number;
    totalCourts?: number;
    minPrice?: number;
    maxPrice?: number;
    facilityImageUrl?: {
        $id: string;
        $values: string[];
    };
}

export const FacilityDetailPage: React.FC = () => {
    const { id: facilityId } = useParams<{ id: string }>();

    const [facility, setFacility] = useState<FacilityDetail>({
        $id: "",
        facilityId: parseInt(facilityId || '0'),
        facilityName: "",
        description: "",
        contactPhone: "",
        contactEmail: "",
        openingTime: "00:00:00",
        closingTime: "00:00:00",
        address: "",
        ward: "",
        district: "",
        city: "",
        latitude: null,
        longtitude: null,
        facilityStatus: "",
        ownerId: 0,
        staffId: 0
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        description: "",
        openingTime: "",
        closingTime: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [facilityLoading, setFacilityLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('courts');

    // Courts management state
    const [courts, setCourts] = useState<Court[]>([]);
    const [courtsLoading, setCourtsLoading] = useState(false);
    const [courtsError, setCourtsError] = useState('');
    const [showAddCourtModal, setShowAddCourtModal] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);
    
    // Staff information state
    const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
    const [staffLoading, setStaffLoading] = useState(false);
    const [staffError, setStaffError] = useState('');
    
    // Load facility details
    useEffect(() => {
        const loadFacilityDetails = async () => {
            if (!facilityId) return;

            setFacilityLoading(true);
            setError('');
            try {
                const facilityData = await getFacilityById(parseInt(facilityId));
                setFacility(facilityData);
                setEditData({
                    description: facilityData.description,
                    openingTime: facilityData.openingTime.slice(0, 5),
                    closingTime: facilityData.closingTime.slice(0, 5)
                });
                console.log('Loaded facility details:', facilityData);
            } catch (error) {
                console.error('Error loading facility details:', error);
                setError('Không thể tải thông tin cơ sở. Vui lòng thử lại sau.');
            } finally {
                setFacilityLoading(false);
            }
        };

        loadFacilityDetails();
    }, [facilityId]);

    // Load courts function
    const loadCourts = async () => {
        if (!facilityId) return;

        setCourtsLoading(true);
        setCourtsError('');
        try {
            const courtsData = await getCourtsByFacilityId(parseInt(facilityId));
            setCourts(courtsData);
            console.log('Loaded courts:', courtsData);
        } catch (error) {
            console.error('Error loading courts:', error);
            setCourtsError('Unable to load courts list. Please try again.');
        } finally {
            setCourtsLoading(false);
        }
    };

    // Load courts data on component mount
    useEffect(() => {
        loadCourts();
    }, [facilityId]);

    // Load staff information
    useEffect(() => {
        const loadStaffInfo = async () => {
            if (!facilityId) return;

            setStaffLoading(true);
            setStaffError('');
            try {
                const staffData = await getStaffByFacilityId(parseInt(facilityId));
                setStaffInfo(staffData);
                console.log('Loaded staff details:', staffData);
            } catch (error) {
                console.error('Error loading staff information:', error);
                setStaffError('Không thể tải thông tin nhân viên. Vui lòng thử lại sau.');
            } finally {
                setStaffLoading(false);
            }
        };

        loadStaffInfo();
    }, [facilityId]);


    const tabs = [
        { id: 'courts', label: 'Quản lý sân', icon: Building2 },
        { id: 'details', label: 'Thông tin', icon: Settings },
        { id: 'staff', label: 'Nhân viên', icon: UserCircle },
    ];

    const handleEditChange = (field: string, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError('');
    };

    const handleSave = async () => {
        if (!editData.description.trim()) {
            setError('Description cannot be empty');
            return;
        }

        if (!editData.openingTime || !editData.closingTime) {
            setError('Please set both opening and closing times');
            return;
        }

        const openTime = new Date(`2000-01-01T${editData.openingTime}:00`);
        const closeTime = new Date(`2000-01-01T${editData.closingTime}:00`);

        if (openTime >= closeTime) {
            setError('Opening time must be before closing time');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setFacility(prev => ({
                ...prev,
                description: editData.description,
                openingTime: `${editData.openingTime}:00`,
                closingTime: `${editData.closingTime}:00`
            }));
            setIsLoading(false);
            setIsEditing(false);
        }, 1500);
    };

    const handleCancel = () => {
        setEditData({
            description: facility.description,
            openingTime: facility.openingTime.slice(0, 5),
            closingTime: facility.closingTime.slice(0, 5)
        });
        setError('');
        setIsEditing(false);
    };

    const formatTime = (time: string) => {
        return time.slice(0, 5);
    };

    // Handle court added successfully
    const handleCourtAdded = () => {
        loadCourts(); // Reload courts list
    };

    // Format user status
    const formatUserStatus = (status: string) => {
        switch (status) {
            case '0':
                return { label: 'Inactive', color: 'red' };
            case '1':
                return { label: 'Active', color: 'green' };
            default:
                return { label: 'Deleted', color: 'gray' };
        }
    };

    // Format role
    const formatRole = (role: string) => {
        switch (role) {
            case '1':
                return 'Admin';
            case '2':
                return 'Facility Owner';
            case '3':
                return 'Staff';
            case '4':
                return 'Customer';
            default:
                return 'Unknown';
        }
    };


    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Redesigned Compact Header */}
                <motion.div
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 border border-slate-600/50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-mint-500/5 via-transparent to-blue-500/5"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-mint-400/10 to-transparent rounded-full blur-3xl"></div>
                    
                    {/* Facility Image as Background */}
                    {facility.facilityImageUrl && facility.facilityImageUrl.$values && facility.facilityImageUrl.$values.length > 0 && (
                        <div className="absolute inset-0 opacity-20">
                            <img 
                                src={facility.facilityImageUrl.$values[0]} 
                                alt={facility.facilityName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
                        </div>
                    )}

                    <div className="relative p-6">
                        {facilityLoading ? (
                            <div className="flex justify-center items-center h-24">
                                <div className="animate-spin w-10 h-10 border-4 border-mint-500/30 border-t-mint-500 rounded-full"></div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.button
                                        onClick={() => window.history.back()}
                                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-700/50 backdrop-blur-sm"
                                        whileHover={{ x: -3, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </motion.button>

                                    <div className="flex items-center space-x-8">
                                        {/* Facility Name and Status - Redesigned */}
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
                                                {facility.facilityImageUrl && facility.facilityImageUrl.$values && facility.facilityImageUrl.$values.length > 0 ? (
                                                    <img 
                                                        src={facility.facilityImageUrl.$values[0]} 
                                                        alt={facility.facilityName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-7 h-7 text-mint-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>';
                                                        }}
                                                    />
                                                ) : (
                                                    <Building2 className="w-7 h-7 text-mint-400" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3">
                                                    <h1 className="text-2xl font-bold text-white">{facility.facilityName}</h1>
                                                    <motion.div
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${facility.facilityStatus === '1'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.3, type: "spring" }}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${facility.facilityStatus === '1' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                                                        <span>{facility.facilityStatus === '1' ? 'Active' : 'Inactive'}</span>
                                                    </motion.div>
                                                </div>
                                                <p className="text-slate-400 text-sm">Mã cơ sở: #{facility.facilityId}</p>
                                            </div>
                                        </div>

                                        {/* Facility Info Cards - Improved */}
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-slate-700/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-600/50 min-w-[100px]">
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 mb-1">Vị trí</p>
                                                    <p className="text-sm font-semibold text-white">{facility.city}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-700/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-600/50 min-w-[120px]">
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 mb-1">Giờ hoạt động</p>
                                                    <p className="text-sm font-semibold text-white">{formatTime(facility.openingTime)} - {formatTime(facility.closingTime)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Show error if any */}
                <ErrorMessage message={error} show={!!error} />

                {/* Tab Navigation */}
                <motion.div
                    className="flex space-x-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-mint-500 to-blue-500 text-white shadow-lg shadow-mint-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'courts' && (
                        <motion.div
                            key="courts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Header with Add Court Button */}
                            <div className="flex items-center justify-between bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-mint-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Quản lý sân</h2>
                                        <p className="text-slate-400">Quản lý tất cả sân trong cơ sở</p>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Button
                                        onClick={() => setShowAddCourtModal(true)}
                                        icon={Plus}
                                        className="bg-gradient-to-r from-mint-500/20 to-blue-500/20 border border-mint-500/30 hover:from-mint-500/30 hover:to-blue-500/30 px-4 py-2 text-sm"
                                    >
                                        Thêm sân mới
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Error Message for Courts */}
                            <ErrorMessage message={courtsError} show={!!courtsError} />

                            {/* Loading State */}
                            {courtsLoading && (
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/50 text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-mint-500/30 border-t-mint-500 rounded-full mx-auto mb-4"></div>
                                    <p className="text-slate-400">Đang tải sân...</p>
                                </div>
                            )}

                            {/* Courts Grid */}
                            {!courtsLoading && !courtsError && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {courts.map((court, index) => (
                                        <CourtCard
                                            key={court.id}
                                            court={court}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!courtsLoading && !courtsError && courts.length === 0 && (
                                <motion.div
                                    className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/50 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Chưa có sân nào</h3>
                                    <p className="text-slate-400 mb-6">Hãy thêm sân đầu tiên để bắt đầu quản lý sân của bạn</p>
                                    <Button
                                        onClick={() => setShowAddCourtModal(true)}
                                        icon={Plus}
                                        className="bg-gradient-to-r from-mint-500 to-blue-500 hover:from-mint-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-mint-500/25"
                                    >
                                        Thêm sân mới
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Header with Edit Button */}
                            <div className="flex items-center justify-between bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-mint-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Thông tin cơ sở</h2>
                                        <p className="text-slate-400">Quản lý thông tin cơ sở</p>
                                    </div>
                                </div>

                 
                            </div>

                            <ErrorMessage message={error} show={!!error} />

                            {/* Organized Information Sections */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 space-y-6">
                                    <h3 className="flex items-center space-x-2 text-xl font-semibold text-white border-b border-slate-600/50 pb-3">
                                        <Edit3 className="w-5 h-5 text-mint-400" />
                                        <span>Thông tin cơ sở</span>
                                    </h3>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Mô tả</label>
                                        {isEditing ? (
                                            <textarea
                                                value={editData.description}
                                                onChange={(e) => handleEditChange('description', e.target.value)}
                                                className="w-full p-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white text-sm placeholder-slate-500 resize-none h-32"
                                                placeholder="Nhập mô tả cơ sở..."
                                            />
                                        ) : (
                                            <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                                                <p className="text-white leading-relaxed">{facility.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Operating Hours */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Giờ hoạt động</label>
                                        {isEditing ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Giờ mở cửa</label>
                                                    <input
                                                        type="time"
                                                        value={editData.openingTime}
                                                        onChange={(e) => handleEditChange('openingTime', e.target.value)}
                                                        className="w-full p-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2">Giờ đóng cửa</label>
                                                    <input
                                                        type="time"
                                                        value={editData.closingTime}
                                                        onChange={(e) => handleEditChange('closingTime', e.target.value)}
                                                        className="w-full p-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                                                <div className="flex items-center justify-center space-x-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-mint-500/20 rounded-lg flex items-center justify-center">
                                                            <Clock className="w-5 h-5 text-mint-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-400">Mở cửa</p>
                                                            <p className="text-white font-semibold">{formatTime(facility.openingTime)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-0.5 bg-gradient-to-r from-mint-400 to-blue-400 rounded-full"></div>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                            <Clock className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-400">Đóng cửa</p>
                                                            <p className="text-white font-semibold">{formatTime(facility.closingTime)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact & Location Information */}
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 space-y-4">
                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white border-b border-slate-600/50 pb-3">
                                            <Phone className="w-5 h-5 text-mint-400" />
                                            <span>Thông tin liên hệ</span>
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                        <Phone className="w-5 h-5 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Số điện thoại</p>
                                                        <p className="text-white font-medium">{facility.contactPhone}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Email cơ sở</p>
                                                        <p className="text-white font-medium text-sm break-all">{facility.contactEmail}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Information */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 space-y-4">
                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white border-b border-slate-600/50 pb-3">
                                            <MapPin className="w-5 h-5 text-mint-400" />
                                            <span>Vị trí</span>
                                        </h3>

                                        <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-mint-500/20 rounded-lg flex items-center justify-center mt-1">
                                                    <MapPin className="w-5 h-5 text-mint-400" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-white font-medium">{facility.address}</p>
                                                    <p className="text-slate-300 text-sm">
                                                        {facility.ward}, {facility.district}
                                                    </p>
                                                    <p className="text-slate-300 text-sm font-medium">
                                                        {facility.city}
                                                    </p>
                                                    {(facility.latitude !== 0 || facility.longtitude !== 0) && (
                                                        <p className="text-slate-400 text-xs">
                                                            📍 {facility.latitude}, {facility.longtitude}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Remove Staff Information Section */}
                        </motion.div>
                    )}

                    {activeTab === 'staff' && (
                        <motion.div
                            key="staff"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-xl flex items-center justify-center">
                                        <UserCircle className="w-6 h-6 text-mint-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Thông tin nhân viên</h2>
                                        <p className="text-slate-400">Xem nhân viên được giao cho cơ sở</p>
                                    </div>
                                </div>
                            </div>

                            <ErrorMessage message={staffError} show={!!staffError} />

                            {/* Staff Information */}
                            {staffLoading ? (
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/50 text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-mint-500/30 border-t-mint-500 rounded-full mx-auto mb-4"></div>
                                    <p className="text-slate-400">Loading staff information...</p>
                                </div>
                            ) : staffInfo ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Staff Profile */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white border-b border-slate-600/50 pb-3 mb-4">
                                            <UserCircle className="w-5 h-5 text-mint-400" />
                                            <span>Thông tin nhân viên</span>
                                        </h3>

                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-full flex items-center justify-center">
                                                <UserCircle className="w-10 h-10 text-mint-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-white">{staffInfo.firstName} {staffInfo.lastName}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-sm text-slate-400">{formatRole(staffInfo.role)}</span>
                                                    <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${staffInfo.userStatus === '0' ?  'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                                        {formatUserStatus(staffInfo.userStatus).label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                                                <Mail className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-400">Email nhân viên</p>
                                                    <p className="text-white">{staffInfo.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                                                <Phone className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-400">Số điện thoại</p>
                                                    <p className="text-white">{staffInfo.phoneNumber}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                                                <Building2 className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-400">Cơ sở được giao</p>
                                                    <p className="text-white">{staffInfo.facilityName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Staff Details */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50">
                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white border-b border-slate-600/50 pb-3 mb-4">
                                            <Settings className="w-5 h-5 text-mint-400" />
                                            <span>Thông tin nhân viên</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Mã nhân viên</p>
                                                        <p className="text-white font-medium">#{staffInfo.userId}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-mint-500/20 rounded-lg flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-mint-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Trạng thái</p>
                                                        <p className={`font-medium ${staffInfo.userStatus === '0' ?  'text-red-400' : 'text-green-400'}`}> 
                                                            {formatUserStatus(staffInfo.userStatus).label}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                        <Settings className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Vai trò</p>
                                                        <p className="text-white font-medium">{formatRole(staffInfo.role)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Mã cơ sở</p>
                                                        <p className="text-white font-medium">#{staffInfo.facilityId}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/50 text-center">
                                    <UserCircle className="w-16 h-16 text-slate-500 mx-auto mb-3" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Chưa có nhân viên nào</h3>
                                    <p className="text-slate-400">Cơ sở này chưa có nhân viên nào</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Court Modal */}
            <AddCourtModal
                isOpen={showAddCourtModal}
                onClose={() => setShowAddCourtModal(false)}
                facilityId={parseInt(facilityId || '0')}
                onCourtAdded={handleCourtAdded}
                facilityOpeningTime={facility.openingTime}
                facilityClosingTime={facility.closingTime}
            />
        </DashboardLayout>
    );
};