import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "${process.env.REACT_APP_API_URL}/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();

    if (s === "delivered")
      return "bg-green-100 text-green-700";
    if (s === "pending")
      return "bg-yellow-100 text-yellow-700";
    if (s === "returned")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";
  };

  const isWithinReturnWindow = (createdAt) => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const diffDays =
      (now - orderDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-600">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const delivered =
                order.status?.toLowerCase() ===
                "delivered";

              const canReturn =
                delivered &&
                isWithinReturnWindow(
                  order.createdAt
                );

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>
                      <p className="font-semibold text-gray-800 tracking-wide">
                        #
                        {order._id
                          .slice(-6)
                          .toUpperCase()}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="px-6 py-5 space-y-6">
                    {order.items.map((item, index) => {
                      const productId =
                        item.product?._id ||
                        item.product;

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-start border-b pb-4 last:border-none"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={
                                item.image
                                  ? item.image.startsWith(
                                      "http"
                                    )
                                    ? item.image
                                    : `${process.env.REACT_APP_API_URL}/${item.image.replace(
                                        /^\/+/,
                                        ""
                                      )}`
                                  : "https://via.placeholder.com/60"
                              }
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />

                            <div>
                              <p className="font-medium text-gray-800">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-500 mb-2">
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </p>

                              {delivered && (
                                <div className="flex gap-4 flex-wrap">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/product/${productId}`
                                      )
                                    }
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    Write Review
                                  </button>

                                  {canReturn && (
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/request-return/${order._id}/${productId}`
                                        )
                                      }
                                      className="text-sm text-purple-600 hover:underline"
                                    >
                                      Return / Replacement
                                    </button>
                                  )}

                                  {!canReturn && (
                                    <span className="text-xs text-gray-400">
                                      Return window closed
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="font-semibold text-gray-800">
                            ₹
                            {item.price *
                              item.quantity}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <p className="text-lg font-bold text-blue-600">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}