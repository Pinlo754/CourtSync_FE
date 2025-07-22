import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Building2,
    DollarSign,
    Save,
    Upload,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    Image as ImageIcon,
    Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SuccessMessage } from '../ui/SuccessMessage';
import { createCourt, CreateCourtRequest, CreateCourtPriceTimeRange } from '../../api/facility/facilityApi';
import { UseUploadFirebase } from '../../features/uploadImage/hooks/useUploadFirebase';

interface AddCourtModalProps {
    isOpen: boolean;
    onClose: () => void;
    facilityId: number;
    onCourtAdded: () => void;
    facilityOpeningTime: string;
    facilityClosingTime: string;
}

interface PriceConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    dayType: '1' | '2'; // 1 = weekday, 2 = weekend
    defaultStartTime: string;
    defaultEndTime: string;
    price: number;
}

export const AddCourtModal: React.FC<AddCourtModalProps> = ({
    isOpen,
    onClose,
    facilityId,
    onCourtAdded,
    facilityOpeningTime,
    facilityClosingTime
}) => {
    const [courtName, setCourtName] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Default price configurations matching facility operating hours (must cover full facility hours with no gaps)
    const [priceConfigs, setPriceConfigs] = useState<PriceConfig[]>([
        {
            id: 'weekday_morning',
            label: 'Weekday Morning',
            icon: Sunrise,
            dayType: '1',
            defaultStartTime: facilityOpeningTime, // Use actual facility opening time
            defaultEndTime: '12:00:00',
            price: 200000
        },
        {
            id: 'weekday_afternoon',
            label: 'Weekday Afternoon',
            icon: Sun,
            dayType: '1',
            defaultStartTime: '12:00:00', // Must match previous endTime exactly
            defaultEndTime: facilityClosingTime, // Use actual facility closing time
            price: 250000
        },
        {
            id: 'weekend_morning',
            label: 'Weekend/Holiday Morning',
            icon: Sunrise,
            dayType: '2',
            defaultStartTime: facilityOpeningTime, // Use actual facility opening time
            defaultEndTime: '12:00:00',
            price: 300000
        },
        {
            id: 'weekend_afternoon',
            label: 'Weekend/Holiday Afternoon',
            icon: Sunset,
            dayType: '2',
            defaultStartTime: '12:00:00', // Must match previous endTime exactly
            defaultEndTime: facilityClosingTime, // Use actual facility closing time
            price: 350000
        }
    ]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const updatePriceConfig = (id: string, field: keyof PriceConfig, value: string | number) => {
        // Convert time format from HH:mm to HH:mm:ss for API compatibility
        let processedValue = value;
        if ((field === 'defaultStartTime' || field === 'defaultEndTime') && typeof value === 'string') {
            // If time input gives HH:mm format, convert to HH:mm:ss
            if (value && value.length === 5 && !value.includes(':00', 5)) {
                processedValue = `${value}:00`;
            }
        }

        setPriceConfigs(prev => prev.map(config =>
            config.id === id ? { ...config, [field]: processedValue } : config
        ));
    };

    // Handle image selection
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type (match Firebase upload requirements)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only JPEG, PNG, GIF, and WebP image files are allowed');
                return;
            }

            // Validate file size (max 5MB - same as Firebase upload)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError('Image size must be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setError('');
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Firebase upload function
    const uploadImage = async (file: File): Promise<string> => {
        try {
            // Use Firebase upload functionality
            const url = await UseUploadFirebase(file, () => { });
            return url;
        } catch (error: any) {
            console.error('Firebase upload error:', error);

            // Provide user-friendly error messages
            if (error.message.includes('Firebase Storage is not configured')) {
                throw new Error('Upload service is not configured. Please contact support.');
            } else if (error.message.includes('File type') && error.message.includes('not supported')) {
                throw new Error('Only image files (JPG, PNG, GIF, WebP) are allowed.');
            } else if (error.message.includes('File size too large')) {
                throw new Error('Image size must be less than 5MB.');
            } else if (error.message.includes('quota-exceeded')) {
                throw new Error('Upload quota exceeded. Please try again later.');
            } else if (error.message.includes('unauthorized')) {
                throw new Error('Upload failed: Unauthorized access.');
            } else if (error.message.includes('retry-limit-exceeded')) {
                throw new Error('Upload failed due to network issues. Please check your connection and try again.');
            } else {
                throw new Error(error.message || 'Upload failed. Please try again.');
            }
        }
    };

    const validateForm = (): boolean => {
        if (!courtName.trim()) {
            setError('Court name is required');
            return false;
        }

        if (!selectedImage) {
            setError('Court image is required');
            return false;
        }

        // Backend validation requirements - use actual facility times

        // Check we have both weekday and weekend ranges
        const weekdayRanges = priceConfigs.filter(config => config.dayType === '1').sort((a, b) => a.defaultStartTime.localeCompare(b.defaultStartTime));
        const weekendRanges = priceConfigs.filter(config => config.dayType === '2').sort((a, b) => a.defaultStartTime.localeCompare(b.defaultStartTime));

        if (weekdayRanges.length === 0 || weekendRanges.length === 0) {
            setError('Must have both weekday and weekend price ranges');
            return false;
        }

        // Validate each day type separately
        for (const [dayType, ranges, dayName] of [
            ['1', weekdayRanges, 'weekday'],
            ['2', weekendRanges, 'weekend']
        ] as const) {

            // Check prices are valid
            for (const config of ranges) {
                if (config.price <= 0) {
                    setError(`Price for ${config.label} must be greater than 0`);
                    return false;
                }

                // Check start time != end time
                if (config.defaultStartTime === config.defaultEndTime) {
                    setError(`Start time cannot equal end time for ${config.label}`);
                    return false;
                }
            }

            // Check first range starts at facility opening time
            if (ranges[0].defaultStartTime !== facilityOpeningTime) {
                setError(`First ${dayName} range must start at facility opening time (${facilityOpeningTime})`);
                return false;
            }

            // Check last range ends at facility closing time
            if (ranges[ranges.length - 1].defaultEndTime !== facilityClosingTime) {
                setError(`Last ${dayName} range must end at facility closing time (${facilityClosingTime})`);
                return false;
            }

            // Check no gaps between ranges (end time of previous = start time of next)
            for (let i = 0; i < ranges.length - 1; i++) {
                if (ranges[i].defaultEndTime !== ranges[i + 1].defaultStartTime) {
                    setError(`Gap detected in ${dayName} ranges between ${ranges[i].label} and ${ranges[i + 1].label}. End time must equal next start time.`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Upload image first
            let imageUrl = '';
            if (selectedImage) {
                setSuccessMessage('Uploading image...');
                try {
                    imageUrl = await uploadImage(selectedImage);
                    setSuccessMessage('Image uploaded successfully! Creating court...');
                } catch (uploadError: any) {
                    console.error('Image upload failed:', uploadError);
                    setError(uploadError.message || 'Failed to upload image. Please try again.');
                    return;
                }
            }

            // Transform price configs to API format
            const courtPriceTimeRanges: CreateCourtPriceTimeRange[] = priceConfigs.map(config => ({
                dayType: config.dayType,
                startTime: config.defaultStartTime,
                endTime: config.defaultEndTime,
                price: config.price
            }));

            const courtData: CreateCourtRequest = {
                facilityId: facilityId,
                courtName: courtName.trim(),
                imageUrl: imageUrl,
                courtPriceTimeRanges
            };

            console.log('Creating court with data:', courtData);
            console.log('Price time ranges:', JSON.stringify(courtPriceTimeRanges, null, 2));

            const result = await createCourt(courtData);

            if (result.success) {
                setSuccessMessage('Court created successfully!');
                setTimeout(() => {
                    onCourtAdded();
                    handleClose();
                }, 1500);
            } else {
                setError(result.message || 'Failed to create court');
            }
        } catch (error: any) {
            console.error('Error creating court:', error);

            // More specific error handling
            if (error.message?.includes('Firebase')) {
                setError('Upload service error. Please try again or contact support.');
            } else if (error.message?.includes('Network')) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError('An error occurred while creating the court. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setCourtName('');
            setSelectedImage(null);
            setImagePreview('');
            setError('');
            setSuccessMessage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Reset price configs to default using actual facility times
            setPriceConfigs([
                {
                    id: 'weekday_morning',
                    label: 'Weekday Morning',
                    icon: Sunrise,
                    dayType: '1',
                    defaultStartTime: facilityOpeningTime,
                    defaultEndTime: '12:00:00',
                    price: 200000
                },
                {
                    id: 'weekday_afternoon',
                    label: 'Weekday Afternoon',
                    icon: Sun,
                    dayType: '1',
                    defaultStartTime: '12:00:00',
                    defaultEndTime: facilityClosingTime,
                    price: 250000
                },
                {
                    id: 'weekend_morning',
                    label: 'Weekend/Holiday Morning',
                    icon: Sunrise,
                    dayType: '2',
                    defaultStartTime: facilityOpeningTime,
                    defaultEndTime: '12:00:00',
                    price: 300000
                },
                {
                    id: 'weekend_afternoon',
                    label: 'Weekend/Holiday Afternoon',
                    icon: Sunset,
                    dayType: '2',
                    defaultStartTime: '12:00:00',
                    defaultEndTime: facilityClosingTime,
                    price: 350000
                }
            ]);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-gradient-to-br from-slate-800/95 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 w-full max-w-4xl max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative p-6 border-b border-slate-600/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-mint-400/10 to-transparent rounded-full blur-2xl"></div>

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        className="w-14 h-14 bg-gradient-to-br from-mint-500/30 to-blue-500/20 rounded-2xl flex items-center justify-center border border-mint-500/20"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5, type: "spring" }}
                                    >
                                        <Building2 className="w-7 h-7 text-mint-400" />
                                    </motion.div>
                                    <div className="space-y-1">
                                        <motion.h2
                                            className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Create New Court
                                        </motion.h2>
                                        <motion.p
                                            className="text-slate-400 text-sm font-medium"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Add a new court to your facility
                                        </motion.p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleClose}
                                    className="relative group p-2.5 rounded-xl bg-slate-700/40 hover:bg-red-500/20 border border-slate-600/50 hover:border-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <X className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-300"></div>
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error/Success Messages */}
                                <ErrorMessage message={error} show={!!error} />
                                <SuccessMessage message={successMessage} show={!!successMessage} />

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Court Name *</label>
                                        <input
                                            type="text"
                                            value={courtName}
                                            onChange={(e) => setCourtName(e.target.value)}
                                            className="w-full p-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white placeholder-slate-500"
                                            placeholder="Enter court name..."
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Court Image *</label>

                                        {/* Image Upload Area */}
                                        {!imagePreview ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-32 bg-slate-700/50 border-2 border-dashed border-slate-600/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-mint-500/50 hover:bg-slate-700/70 transition-all duration-300"
                                            >
                                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                <p className="text-slate-400 text-sm text-center">
                                                    Click to upload court image<br />
                                                    <span className="text-xs">PNG, JPG up to 5MB</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Court preview"
                                                    className="w-full h-32 object-cover rounded-xl border-2 border-slate-600/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Price Configuration */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                        <DollarSign className="w-5 h-5 text-mint-400" />
                                        <span>Price Configuration (4 Types)</span>
                                    </h3>

                                    <div className="bg-gradient-to-r from-blue-900/40 to-slate-800/40 rounded-xl p-4 mb-4 border border-blue-700/30 shadow-lg">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-500/20 p-1.5 rounded-lg mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                </svg>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-blue-300">Scheduling Rules</h4>
                                                <ul className="text-sm text-slate-300 space-y-1.5">
                                                    <li className="flex items-start">
                                                        <span className="inline-block w-4 text-blue-400 mr-1">•</span>
                                                        <span>Time ranges must cover entire facility operating hours ({facilityOpeningTime.slice(0, 5)}-{facilityClosingTime.slice(0, 5)})</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="inline-block w-4 text-blue-400 mr-1">•</span>
                                                        <span>No gaps allowed: End time of one range = Start time of next range</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="inline-block w-4 text-blue-400 mr-1">•</span>
                                                        <span>Must have both weekday and weekend ranges</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="inline-block w-4 text-blue-400 mr-1">•</span>
                                                        <span>Start time cannot equal end time within same range</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {priceConfigs.map((config) => {
                                            const IconComponent = config.icon;
                                            return (
                                                <div
                                                    key={config.id}
                                                    className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50 space-y-4"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-mint-500/20 rounded-lg flex items-center justify-center">
                                                            <IconComponent className="w-5 h-5 text-mint-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{config.label}</h4>
                                                            <p className="text-xs text-slate-400">
                                                                {config.dayType === '1' ? 'Weekdays' : 'Weekends/Holidays'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-400 mb-2">
                                                                Start Time
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={config.defaultStartTime.substring(0, 5)}
                                                                onChange={(e) => updatePriceConfig(config.id, 'defaultStartTime', e.target.value)}
                                                                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:border-mint-500 focus:outline-none text-white text-sm"
                                                                disabled={isLoading}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-400 mb-2">
                                                                End Time
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={config.defaultEndTime.substring(0, 5)}
                                                                onChange={(e) => updatePriceConfig(config.id, 'defaultEndTime', e.target.value)}
                                                                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:border-mint-500 focus:outline-none text-white text-sm"
                                                                disabled={isLoading}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-2">
                                                            Price (VND/h)
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={config.price}
                                                                onChange={(e) => updatePriceConfig(config.id, 'price', parseInt(e.target.value) || 0)}
                                                                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:border-mint-500 focus:outline-none text-white"
                                                                min="0"
                                                                step="10000"
                                                                disabled={isLoading}
                                                            />
                                                            <div className="absolute inset-y-0 right-3 flex items-center">
                                                                <span className="text-slate-400 text-sm">VND/h</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600/50">
                                    <Button
                                        type="button"
                                        onClick={handleClose}
                                        variant="secondary"
                                        disabled={isLoading}
                                        className="px-6 py-3"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={isLoading}
                                        icon={Save}
                                        className="px-6 py-3 bg-gradient-to-r from-mint-500 to-blue-500 hover:from-mint-600 hover:to-blue-600"
                                    >
                                        Create Court
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 