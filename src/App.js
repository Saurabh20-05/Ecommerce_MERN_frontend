import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess";
import ProductReviews from "./pages/ProductReviews";
import Footer from "./components/Footer";

import RequestReturn from "./pages/RequestReturn";
import MyReturns from "./pages/MyReturns";

import ProtectedRoute from "./components/ProtectedRoute";

import VendorLayout from "./components/VendorLayout";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorProducts from "./pages/vendor/Products";
import VendorOrders from "./pages/vendor/Orders";
import VendorReviews from "./pages/vendor/Reviews";
import VendorReturns from "./pages/vendor/Returns";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";

function AppContent() {
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith("/vendor");

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#fff",
          },
        }}
      />

      {!isVendorRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductReviews />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute role="customer">
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request-return/:orderId/:productId"
          element={
            <ProtectedRoute role="customer">
              <RequestReturn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-returns"
          element={
            <ProtectedRoute role="customer">
              <MyReturns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/*"
          element={
            <ProtectedRoute role="vendor">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="reviews" element={<VendorReviews />} />
          <Route path="returns" element={<VendorReturns />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;