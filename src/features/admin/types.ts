export type AdminSidebarOption =
  | 'create-facility-owner'
  | 'manage-facility'
  | 'manage-user';

export const ADMIN_SIDEBAR_OPTIONS: { key: AdminSidebarOption; label: string }[] = [
  { key: 'create-facility-owner', label: 'Create Facility Owner' },
  { key: 'manage-facility', label: 'Manage Facility' },
  { key: 'manage-user', label: 'Manage User' },
];

export interface AdminSidebarProps {
  selectedOption: AdminSidebarOption;
  onSelect: (option: AdminSidebarOption) => void;
}
