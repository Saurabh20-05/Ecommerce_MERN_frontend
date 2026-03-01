import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-10 py-4 flex justify-between items-center border-b">
      <Link
        to={role === "vendor" ? "/vendor" : "/"}
        className="flex flex-col leading-tight"
      >
        <span className="text-2xl font-bold text-blue-600 tracking-wide">
          Klutch
        </span>
        <span className="text-xs text-gray-500">
          Vendor Marketplace
        </span>
      </Link>

      <div className="flex gap-8 items-center text-sm font-medium text-gray-700">
        {role === "customer" && (
          <>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>

            <Link to="/cart" className="hover:text-blue-600 transition">
              Cart
            </Link>

            <Link to="/orders" className="hover:text-blue-600 transition">
              Orders
            </Link>

            <Link
              to="/my-returns"
              className="hover:text-blue-600 transition"
            >
              Returns
            </Link>
          </>
        )}

        {role === "vendor" && (
          <Link to="/vendor" className="hover:text-blue-600 transition">
            Vendor Panel
          </Link>
        )}

        {role === "admin" && (
          <Link to="/admin" className="hover:text-blue-600 transition">
            Admin Panel
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:text-blue-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-sm"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition shadow-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}