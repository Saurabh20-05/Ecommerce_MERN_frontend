import { Link } from "react-router-dom";

export default function VendorDashboard() {
  return (
    <div className="space-y-10">

      <div>
        <h2 className="text-3xl font-bold">
          Vendor Dashboard
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your store from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <Link
          to="/vendor/add"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold mb-2">
            ➕ Add Product
          </h3>
          <p className="text-gray-500 text-sm">
            Add a new product to your store.
          </p>
        </Link>

        <Link
          to="/vendor/products"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold mb-2">
            📦 View Products
          </h3>
          <p className="text-gray-500 text-sm">
            Manage existing products.
          </p>
        </Link>

        <Link
          to="/vendor/orders"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold mb-2">
            🛒 Orders
          </h3>
          <p className="text-gray-500 text-sm">
            View and update customer orders.
          </p>
        </Link>

      </div>

    </div>
  );
}