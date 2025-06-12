import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";

/**
 * Header Component
 * Component này tạo ra thanh điều hướng chính của ứng dụng
 * Bao gồm logo, các liên kết điều hướng và avatar người dùng
 */
const Header = () => {
  return (
    // Container chính của header với chiều cao cố định và căn chỉnh các phần tử
    <div className="flex h-20 w-full justify-between">
      {/* Phần chứa logo bên trái */}
      <div className="flex justify-center items-center h-full">
        <Link to="/">
          <img src={logo} className="rounded-full ml-2 mt-4 h-[160px]" alt="logo" />
        </Link>
      </div>

      {/* Phần chứa menu điều hướng bên phải */}
      <div className="flex justify-between items-center text-2xl text-center h-full gap-6">
        {/* Link tìm sân */}
        <Link to="/find-court" className="hover:text-gray-600 transition-colors">
          Find court
        </Link>
        {/* Đường phân cách */}
        <div className="w-[2px] h-[20%] bg-[black]" />
        {/* Link lịch sử đặt sân */}
        <Link to="/booking-history" className="hover:text-gray-600 transition-colors">
          Booking history
        </Link>
        {/* Đường phân cách */}
        <div className="w-[1px] h-[20%] bg-[black]" />
        {/* Link profile với avatar */}
        <Link to="/profile" className="flex items-center hover:text-gray-600 transition-colors">
          <p className="flex justify-center items-center">Profile</p>
          <img
            src={avatar}
            alt="profile"
            className="rounded-full ml-2 h-[40px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header; 