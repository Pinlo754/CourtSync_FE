export type AdminSidebarOption =
  | 'Tạo chủ cơ sở'
  | 'Quản lý cơ sở'
  | 'Quản lý người dùng';

export const ADMIN_SIDEBAR_OPTIONS: { key: AdminSidebarOption; label: string }[] = [
  { key: 'Tạo chủ cơ sở', label: 'Tạo chủ cơ sở' },
  { key: 'Quản lý cơ sở', label: 'Quản lý cơ sở' },
  { key: 'Quản lý người dùng', label: 'Quản lý người dùng' },
];

export interface AdminSidebarProps {
  selectedOption: AdminSidebarOption;
  onSelect: (option: AdminSidebarOption) => void;
}
