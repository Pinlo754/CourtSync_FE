import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { Court, CourtPricing } from '../../api/facility/facilityApi';

interface CourtCardProps {
    court: Court;
    index: number;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, index }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price) + '/h';
    };

    const getStatusColor = (status: Court['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'maintenance':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusText = (status: Court['status']) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'inactive':
                return 'Inactive';
            case 'maintenance':
                return 'Maintenance';
            default:
                return 'Unknown';
        }
    };

    const getPriceTypeText = (priceType: CourtPricing['priceType']) => {
        switch (priceType) {
            case 'weekday_morning':
                return 'Weekday Morning';
            case 'weekday_afternoon':
                return 'Weekday Afternoon';
            case 'weekend_morning':
                return 'Weekend/Holiday Morning';
            case 'weekend_afternoon':
                return 'Weekend/Holiday Afternoon';
            default:
                return 'Unknown';
        }
    };

    const getPriceTypeIcon = (priceType: CourtPricing['priceType']) => {
        switch (priceType) {
            case 'weekday_morning':
                return Sunrise;
            case 'weekday_afternoon':
                return Sun;
            case 'weekend_morning':
                return Sunrise;
            case 'weekend_afternoon':
                return Sunset;
            default:
                return Sun;
        }
    };

    const formatTimeRange = (startTime: string, endTime: string) => {
        return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-600/50 hover:border-mint-500/30 transition-all duration-500 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            {/* Court Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={court.images[0] || '/src/assets/court1.jpg'}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 backdrop-blur-sm border ${getStatusColor(court.status)}`}>
                        <div className={`w-2 h-2 rounded-full ${court.status === 'active' ? 'bg-green-400' : court.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
                        <span>{getStatusText(court.status)}</span>
                    </div>
                </div>

                {/* Court ID Badge */}
                <div className="absolute top-4 left-4">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-white">
                        Court #{court.id}
                    </div>
                </div>
            </div>

            {/* Court Details */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{court.name}</h3>
                </div>

                {/* Pricing Information */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-mint-400" />
                        <span>Pricing</span>
                    </h4>
                    <div className="space-y-2">
                        {court.pricing.length > 0 ? court.pricing.map((pricing, idx) => {
                            const IconComponent = getPriceTypeIcon(pricing.priceType);
                            return (
                                <div key={pricing.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-mint-500/20 rounded-lg flex items-center justify-center">
                                            <IconComponent className="w-4 h-4 text-mint-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {getPriceTypeText(pricing.priceType)}
                                            </p>
                                            <p className="text-slate-400 text-xs">
                                                {formatTimeRange(pricing.startTime, pricing.endTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-mint-400 font-semibold">
                                            {formatPrice(pricing.price)}
                                        </p>

                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/30 text-center">
                                <p className="text-slate-400 text-sm">No pricing available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}; 