import { useEffect, useState } from "react";
import axios from "axios";
import { getStatusColor } from "../../utils/statusColor";
import toast from "react-hot-toast";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, search, orders]);

  const fetchOrders = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      const { data } = await axios.get(
        "${process.env.REACT_APP_API_URL}/api/orders/vendor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(
        (o) =>
          o._id.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const updateStatus = async (orderId, newStatus) => {
    if (newStatus === "Update") return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/vendor/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order updated successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error updating order");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>

        <input
          type="text"
          placeholder="Search Order ID or Customer"
          className="border p-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-4">#{order._id.slice(-4)}</td>

                <td className="p-4">
                  {new Date(order.createdAt).toDateString()}
                </td>

                <td className="p-4">{order.user?.name}</td>

                <td className="p-4 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <select
                    className="border p-1 rounded"
                    defaultValue="Update"
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option disabled>Update</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function OrderModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-2/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>

        <table className="w-full mb-4 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.orderItems || order.items)?.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  {item.product?.name || item.name}
                </td>
                <td className="p-2">
                  {item.qty || item.quantity}
                </td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">
                  ₹{(item.qty || item.quantity) * item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right font-bold text-lg">
          Total: ₹{order.totalAmount}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}