import React, { useState, useEffect } from 'react';
import { AdminSidebarOption } from '../types';
import AdminSidebar from '../../../components/sections/AdminSidebar';
import { CreateFacilityForm } from '../../manageFacility/components/CreateFacilityForm';
import { ManageFacility } from '../../manageFacility/components/ManageFacility';


export const AdminContent: React.FC = () => {
  // Lấy giá trị từ sessionStorage nếu có, nếu không thì dùng mặc định
  const getInitialOption = () => {
    const saved = sessionStorage.getItem('admin-selected-option');
    return (saved as AdminSidebarOption) || 'Tạo chủ cơ sở';
  };
  const [selectedOption, setSelectedOption] = useState<AdminSidebarOption>(getInitialOption);

  // Lưu vào sessionStorage mỗi khi selectedOption thay đổi
  useEffect(() => {
    sessionStorage.setItem('admin-selected-option', selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex h-full min-h-screen">
      <AdminSidebar selectedOption={selectedOption} onSelect={setSelectedOption} />
      <div className="flex-1 p-8">
        {/* Hiển thị nội dung tương ứng với lựa chọn */}
        {selectedOption === 'Tạo chủ cơ sở' && <CreateFacilityForm />}
        {selectedOption === 'Quản lý cơ sở' && <ManageFacility />}
        {selectedOption === 'Quản lý người dùng' && <div>Quản lý User</div>}
      </div>
    </div>
  );
}