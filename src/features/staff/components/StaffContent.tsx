import React, { useState, useEffect } from 'react';
import { StaffSidebarOption } from '../types';
import StaffSidebar from '../../../components/sections/StaffSidebar';
import { ReportIssueForm } from '../../staffReport/components/ReportIssueForm';
import CheckinCustomer from '../../staffCheckin/components/CheckinCustomer';
import { BookingStaffForm } from '../../staffBooking/components/BookingStaffForm';


export const StaffContent: React.FC = () => {
  // Lấy giá trị từ localStorage nếu có, nếu không thì dùng mặc định
  const getInitialOption = () => {
    const saved = sessionStorage.getItem('staff-selected-option');
    return (saved as StaffSidebarOption) || 'Tạo đặt sân';
  };
  const [selectedOption, setSelectedOption] = useState<StaffSidebarOption>(getInitialOption);

  // Lưu vào localStorage mỗi khi selectedOption thay đổi
  useEffect(() => {
    sessionStorage.setItem('staff-selected-option', selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex h-full min-h-screen">
      <StaffSidebar selectedOption={selectedOption} onSelect={setSelectedOption} />
      <div className="flex-1 p-8">
        {/* Hiển thị nội dung tương ứng với lựa chọn */}
        {selectedOption === 'Check-in sân' && <CheckinCustomer />}
        {selectedOption === 'Báo cáo vấn đề' && <ReportIssueForm />}
        {selectedOption === 'Tạo đặt sân' && <BookingStaffForm />}
      </div>
    </div>
  );
}