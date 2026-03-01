import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function OrderSuccess() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setOrder(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!order)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">

      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mb-6">
        ✓
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Order Confirmed!
      </h1>

      <p className="text-gray-600 mb-8">
        Thank you for your purchase
      </p>

      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-3xl">

        <p className="mb-2">
          <strong>Order ID:</strong> {order._id}
        </p>

        <p className="mb-6">
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <h2 className="text-xl font-semibold mb-4">
          Order Items
        </h2>

        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 mb-4 border-b pb-4"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${item.image}`}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-blue-600">
                ₹{item.price}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="text-right font-bold text-lg mt-4">
          Total Amount: ₹{order.totalAmount}
        </div>

      </div>

      <div className="flex gap-6 mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View Orders
        </button>
      </div>

    </div>
  );
}