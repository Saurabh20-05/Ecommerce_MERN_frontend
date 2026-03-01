import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(
        "${process.env.REACT_APP_API_URL}/api/cart",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put(
        "${process.env.REACT_APP_API_URL}/api/cart/update",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCart(data);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Removed from cart");
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const placeOrder = async () => {
    try {
      const { data } = await axios.post(
        "${process.env.REACT_APP_API_URL}/api/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Order placed successfully");
      navigate(`/order-success/${data._id}`);

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-10 text-center text-xl">
        Cart is empty
      </div>
    );
  }

  const total = cart.items.reduce(
    (acc, item) =>
      acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-10">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${item.product.image}`}
              alt={item.product.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-xl font-semibold">
                {item.product.name}
              </h2>

              <p className="text-blue-600 font-bold text-lg mt-2">
                ₹{item.product.price}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Subtotal: ₹
                {item.product.price * item.quantity}
              </p>

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity - 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-gray-200"
                >
                  -
                </button>

                <span className="text-lg font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity + 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  removeItem(item.product._id)
                }
                className="w-full bg-red-500 hover:bg-red-600 text-white mt-6 py-2 rounded-lg"
              >
                Remove from Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-12">
        <h2 className="text-2xl font-bold mb-4">
          Order Summary
        </h2>

        <div className="flex justify-between text-lg">
          <span>Total:</span>
          <span className="font-bold">₹{total}</span>
        </div>

        <button
          onClick={placeOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}