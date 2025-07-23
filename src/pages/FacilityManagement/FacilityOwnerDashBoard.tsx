import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, Users, Settings, BarChart3, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CreateFacilityModal } from '../../features/FacilityManagement/CreateFacilityModal';
import { FacilityCard } from '../../features/FacilityManagement/FacilityCard';
import { SuccessMessage } from '../../components/ui/SuccessMessage';
import { getMyFacilities, Facility } from '../../api/facility/facilityApi';

export const FacilityOwnerDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch facilities from API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyFacilities();
        setFacilities(data);
      } catch (err: any) {
        console.error('Error loading facilities:', err);
        setError(err.response?.data?.message || 'Không thể tải danh sách facility');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const stats = [
    { label: 'Total Facilities', value: facilities.length, icon: Building2, color: 'mint' },
    { label: 'Active Courts', value: facilities.reduce((sum, f) => sum + f.courtsCount, 0), icon: BarChart3, color: 'blue' },
    { label: 'Staff Members', value: 12, icon: Users, color: 'green' },
    { label: 'Monthly Revenue', value: '$15,420', icon: BarChart3, color: 'purple' }
  ];

  const handleCreateFacility = async (facilityData: any) => {
    // Close modal first
    setShowCreateModal(false);

    // Show success message
    setSuccessMessage(`Facility "${facilityData.facilityName}" đã được tạo thành công!`);
    setError(null);

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    // Refresh facilities list from API
    try {
      setIsLoading(true);
      const updatedFacilities = await getMyFacilities();
      setFacilities(updatedFacilities);
    } catch (err: any) {
      console.error('Error refreshing facilities:', err);
      setError('Tạo facility thành công nhưng không thể tải lại danh sách');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Facility Management</h1>
            <p className="text-slate-300">Manage your badminton facilities and staff</p>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-mint-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Facility</span>
          </motion.button>
        </div>


        {/* Success Message */}
        <SuccessMessage message={successMessage || ''} show={!!successMessage} />

        {/* Facilities Grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Facilities</h2>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                className="flex items-center space-x-3 text-mint-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Đang tải facilities...</span>
              </motion.div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <motion.button
                onClick={() => window.location.reload()}
                className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Thử lại
              </motion.button>
            </div>
          ) : (
            /* Facilities Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility, index) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  index={index}
                />
              ))}

              {/* Add New Facility Card */}
              <motion.div
                className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-dashed border-slate-600/50 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-mint-500/50 transition-all duration-300"
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: facilities.length * 0.1 }}
              >
                <Plus className="w-12 h-12 text-slate-500 mb-4" />
                <p className="text-slate-400 text-center">Add New Facility</p>
              </motion.div>

              {/* Empty State */}
              {facilities.length === 0 && (
                <motion.div
                  className="col-span-full bg-slate-800/30 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Building2 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Chưa có facility nào</h3>
                  <p className="text-slate-400 mb-6">Hãy tạo facility đầu tiên để bắt đầu quản lý sân badminton của bạn!</p>
                  <motion.button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-mint-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Tạo Facility Đầu Tiên</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Create Facility Modal */}
        <CreateFacilityModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFacility}
        />
      </div>
    </DashboardLayout>
  );
};