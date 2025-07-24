import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { useEffect, useState } from "react";
import { User } from "../../types/user";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = sessionStorage.getItem("loggedUser");
    const loggedUser = userString ? JSON.parse(userString) : null;
    setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex h-20 w-full justify-between pb-1">
      {/* Logo */}
      <div className="flex justify-center items-center h-full">
        <Link to="/">
          <img
            src={logo}
            className="rounded-full ml-2 mt-4 h-[160px]"
            alt="logo"
          />
        </Link>
      </div>

      <div className="flex justify-between items-center text-2xl text-center h-full gap-6">
        {user ? (
          <>
            {(user.role === "4" || user.role === "1") && (
              <Link
                to="/profile"
                className="flex items-center hover:text-gray-600 transition-colors"
              >
                <p className="flex justify-center items-center">Profile</p>
                <img
                  src={avatar}
                  alt="profile"
                  className="rounded-full ml-2 h-[40px]"
                />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="hover:text-gray-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-600 transition-colors">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
