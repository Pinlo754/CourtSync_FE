import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Hash, Settings, Eye, Edit, Sparkles, Image } from 'lucide-react';

interface Facility {
  id: string;
  facilityName: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  imageUrls?: string[];
}

interface FacilityCardProps {
  facility: Facility;
  index: number;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, index }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/facility-detail/${facility.id}`);
  };

  // Get the first image URL or use a fallback
  const imageUrl = facility.imageUrls && facility.imageUrls.length > 0 
    ? facility.imageUrls[0] 
    : '/src/assets/facility.jpg';

  return (
    <motion.div
      className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-mint-500/50 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mint-500/10 to-transparent rounded-full blur-2xl group-hover:from-mint-500/20 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl group-hover:from-blue-500/20 transition-all duration-500" />

      {/* Facility Image */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden rounded-t-3xl">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={facility.facilityName} 
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/facility.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800/60">
            <Image className="w-12 h-12 text-slate-600" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Facility ID Badge */}
      <div className="absolute -top-0 -left-0 z-20">
        <div className="bg-gradient-to-br from-mint-500/40 to-mint-600/60 backdrop-blur-sm border-r border-b border-mint-400/30 rounded-br-2xl rounded-tl-3xl px-4 py-2 group-hover:from-mint-500/60 group-hover:to-mint-600/80 transition-all duration-300 shadow-lg">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-mint-100" />
            <span className="font-mono text-mint-50 font-bold text-sm tracking-wider">
              {facility.id}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mt-32">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-mint-500/20 to-mint-600/20 rounded-2xl border border-mint-500/30">
              <Sparkles className="w-6 h-6 text-mint-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-mint-300 transition-colors duration-300 line-clamp-1 flex-1 mr-3">
                  {facility.facilityName}
                </h3>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-sm ${facility.status === 'active'
                  ? 'bg-green-500/20 border border-green-500/40'
                  : 'bg-red-500/20 border border-red-500/40'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${facility.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                    } animate-pulse`} />
                  <span className={`text-xs font-semibold whitespace-nowrap ${facility.status === 'active' ? 'text-green-300' : 'text-red-300'
                    }`}>
                    {facility.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-300 font-medium">{facility.address}</p>
              <p className="text-slate-400 text-sm">{facility.city}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-mint-500/20 to-mint-600/20 hover:from-mint-500/30 hover:to-mint-600/30 text-mint-300 py-3 px-6 rounded-2xl border border-mint-500/30 hover:border-mint-500/50 transition-all duration-300 font-semibold text-sm group/btn"
          >
            <div className="flex items-center justify-center space-x-2">
              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span>Manage Courts</span>
            </div>
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-mint-500/0 via-mint-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};