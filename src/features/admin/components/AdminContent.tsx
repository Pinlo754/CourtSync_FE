import React, { useState, useEffect } from 'react';
import { AdminSidebarOption } from '../types';
import AdminSidebar from '../../../components/sections/AdminSidebar';
import { CreateFacilityForm } from '../../manageFacility/components/CreateFacilityForm';
import { ManageFacility } from '../../manageFacility/components/ManageFacility';


export const AdminContent: React.FC = () => {
  // Lấy giá trị từ localStorage nếu có, nếu không thì dùng mặc định
  const getInitialOption = () => {
    const saved = localStorage.getItem('admin-selected-option');
    return (saved as AdminSidebarOption) || 'create-facility-owner';
  };
  const [selectedOption, setSelectedOption] = useState<AdminSidebarOption>(getInitialOption);

  // Lưu vào localStorage mỗi khi selectedOption thay đổi
  useEffect(() => {
    localStorage.setItem('admin-selected-option', selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex h-full min-h-screen">
      <AdminSidebar selectedOption={selectedOption} onSelect={setSelectedOption} />
      <div className="flex-1 p-8">
        {/* Hiển thị nội dung tương ứng với lựa chọn */}
        {selectedOption === 'create-facility-owner' && <CreateFacilityForm />}
        {selectedOption === 'manage-facility' && <ManageFacility />}
        {selectedOption === 'manage-user' && <div>Quản lý User</div>}
      </div>
    </div>
  );
}