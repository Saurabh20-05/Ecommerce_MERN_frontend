import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/vendor") {
      return location.pathname === "/vendor";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  const linkStyle = (path) =>
    `px-5 py-2.5 rounded-full text-base font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-white text-blue-600 shadow-md"
        : "text-blue-100 hover:bg-blue-500 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl sticky top-0 z-50 border-b border-blue-400/20">
        <div className="w-full px-12 py-5 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-wide">
              Vendor Portal
            </h1>
          </div>

          <div className="flex gap-6">
            <Link to="/vendor" className={linkStyle("/vendor")}>
              Dashboard
            </Link>

            <Link to="/vendor/add" className={linkStyle("/vendor/add")}>
              Add Product
            </Link>

            <Link
              to="/vendor/products"
              className={linkStyle("/vendor/products")}
            >
              Products
            </Link>

            <Link
              to="/vendor/orders"
              className={linkStyle("/vendor/orders")}
            >
              Orders
            </Link>

            <Link
              to="/vendor/reviews"
              className={linkStyle("/vendor/reviews")}
            >
              Reviews
            </Link>

            <Link
              to="/vendor/returns"
              className={linkStyle("/vendor/returns")}
            >
              Returns
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-6">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-12">
        <Outlet />
      </div>
    </div>
  );
}