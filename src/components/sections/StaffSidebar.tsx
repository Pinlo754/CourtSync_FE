import React from "react";
import {
  STAFF_SIDEBAR_OPTIONS,
  StaffSidebarProps,
  StaffSidebarOption,
} from "../../features/staff/types";
import { useAuthContext } from "../../features/auth/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const StaffSidebar: React.FC<StaffSidebarProps> = ({
  selectedOption,
  onSelect,
}) => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-full bg-white border-r flex flex-col py-8 px-4 shadow-md">
      <h2 className="text-xl font-bold mb-8 text-center">Menu nhân viên</h2>
      <nav className="flex flex-col gap-2">
        {STAFF_SIDEBAR_OPTIONS.map((option) => (
          <button
            key={option.key}
            className={`text-left px-4 py-2 rounded transition font-medium ${
              selectedOption === option.key
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-blue-100 text-gray-700"
            }`}
            onClick={() => onSelect(option.key as StaffSidebarOption)}
          >
            {option.label}
          </button>
        ))}
      </nav>
      <div className="mt-20 ml-4 border-t border-gray-200 pt-4">
        <button
          className="w-full flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
