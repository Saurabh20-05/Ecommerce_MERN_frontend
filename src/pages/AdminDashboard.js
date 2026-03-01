import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    customers: 0,
    vendors: 0,
    products: 0,
  });

  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const [summary, vendorData, customerData] = await Promise.all([
          axios.get("${process.env.REACT_APP_API_URL}/api/admin/summary", config),
          axios.get("${process.env.REACT_APP_API_URL}/api/admin/vendors", config),
          axios.get("${process.env.REACT_APP_API_URL}/api/admin/customers", config),
        ]);

        setStats(summary.data);
        setVendors(vendorData.data);
        setCustomers(customerData.data);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user]);

  const removeUser = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/remove-user/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setVendors((prev) => prev.filter((v) => v._id !== id));
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-10 py-10">
        <h2 className="text-3xl font-bold mb-10">
          Admin Dashboard
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Customers" value={stats.customers} />
          <StatCard title="Vendors" value={stats.vendors} />
          <StatCard title="Products" value={stats.products} />
        </div>

        <VendorTable
          users={vendors}
          removeUser={removeUser}
        />

        <CustomerTable
          users={customers}
          removeUser={removeUser}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 mb-2">{title}</p>
      <h3 className="text-4xl font-bold text-blue-600">
        {value}
      </h3>
    </div>
  );
}

function VendorTable({ users, removeUser }) {
  return (
    <div className="bg-white rounded-2xl shadow mb-12 overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-semibold">Vendors</h3>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Joined</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => removeUser(user._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No vendors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CustomerTable({ users, removeUser }) {
  return (
    <div className="bg-white rounded-2xl shadow mb-10 overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-semibold">Customers</h3>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Joined</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => removeUser(user._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}