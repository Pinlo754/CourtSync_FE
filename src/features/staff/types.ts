export type StaffSidebarOption =
  | 'check-in-customer'
  | 'report-issue';

export const STAFF_SIDEBAR_OPTIONS: { key: StaffSidebarOption; label: string }[] = [
  { key: 'check-in-customer', label: 'Check In Customer' },
  { key: 'report-issue', label: 'Report Issue' },
];

export interface StaffSidebarProps {
  selectedOption: StaffSidebarOption;
  onSelect: (option: StaffSidebarOption) => void;
}