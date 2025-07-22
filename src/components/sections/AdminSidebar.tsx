import React from 'react';
import { ADMIN_SIDEBAR_OPTIONS, AdminSidebarProps, AdminSidebarOption } from '../../features/admin/types';

const AdminSidebar: React.FC<AdminSidebarProps> = ({ selectedOption, onSelect }) => {
  return (
    <aside className="w-64 h-full bg-white border-r flex flex-col py-8 px-4 shadow-md">
      <h2 className="text-xl font-bold mb-8 text-center">Admin Menu</h2>
      <nav className="flex flex-col gap-2">
        {ADMIN_SIDEBAR_OPTIONS.map(option => (
          <button
            key={option.key}
            className={`text-left px-4 py-2 rounded transition font-medium ${
              selectedOption === option.key
                ? 'bg-blue-600 text-white shadow'
                : 'hover:bg-blue-100 text-gray-700'
            }`}
            onClick={() => onSelect(option.key as AdminSidebarOption)}
          >
            {option.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 