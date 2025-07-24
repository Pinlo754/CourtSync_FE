export type StaffSidebarOption = 'Tạo đặt sân'
  | 'Check-in sân'
  | 'Báo cáo vấn đề';

export const STAFF_SIDEBAR_OPTIONS: { key: StaffSidebarOption; label: string }[] = [
  { key: 'Tạo đặt sân', label: 'Tạo đặt sân' },
  { key: 'Check-in sân', label: 'Check-in sân' },
  { key: 'Báo cáo vấn đề', label: 'Báo cáo vấn đề' },
];

export interface StaffSidebarProps {
  selectedOption: StaffSidebarOption;
  onSelect: (option: StaffSidebarOption) => void;
}