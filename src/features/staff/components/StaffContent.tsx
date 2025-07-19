import React, { useState, useEffect } from 'react';
import { StaffSidebarOption } from '../types';
import StaffSidebar from '../../../components/sections/StaffSidebar';
import { ReportIssueForm } from '../../staffReport/components/ReportIssueForm';
import CheckinCustomer from '../../staffCheckin/components/CheckinCustomer';


export const StaffContent: React.FC = () => {
  // Lấy giá trị từ localStorage nếu có, nếu không thì dùng mặc định
  const getInitialOption = () => {
    const saved = localStorage.getItem('staff-selected-option');
    return (saved as StaffSidebarOption) || 'check-in-customer';
  };
  const [selectedOption, setSelectedOption] = useState<StaffSidebarOption>(getInitialOption);

  // Lưu vào localStorage mỗi khi selectedOption thay đổi
  useEffect(() => {
    localStorage.setItem('staff-selected-option', selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex h-full min-h-screen">
      <StaffSidebar selectedOption={selectedOption} onSelect={setSelectedOption} />
      <div className="flex-1 p-8">
        {/* Hiển thị nội dung tương ứng với lựa chọn */}
        {selectedOption === 'check-in-customer' && <CheckinCustomer />}
        {selectedOption === 'report-issue' && <ReportIssueForm />}
      </div>
    </div>
  );
}