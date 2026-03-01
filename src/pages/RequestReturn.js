import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function RequestReturn() {
  const { orderId, productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderItem, setOrderItem] = useState(null);
  const [type, setType] = useState("Replacement");
  const [reason, setReason] = useState("");
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/returns/${orderId}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOrderItem(data.orderItem);
        setExistingRequest(data.returnRequest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, productId, user]);

  const submitHandler = async () => {
    if (!reason.trim()) {
      return toast.error("Please enter reason");
    }

    try {
      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/returns",
        {
          orderId,
          productId,
          type,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Return request submitted");
      navigate("/my-returns");
    } catch (err) {
      toast.error("Failed to submit");
    }
  };

  if (loading) return null;

  if (!orderItem) {
    return (
      <div className="p-10 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">
          Request Return / Replacement
        </h1>

        <div className="flex gap-6 items-start border-b pb-6">
          <img
            src={
              orderItem.image
                ? orderItem.image.startsWith("http")
                  ? orderItem.image
                  : `${process.env.REACT_APP_API_URL}/${orderItem.image.replace(
                      /^\/+/,
                      ""
                    )}`
                : "https://via.placeholder.com/100"
            }
            alt=""
            className="w-28 h-28 object-cover rounded-lg"
          />

          <div>
            <h2 className="text-xl font-semibold">
              {orderItem.name}
            </h2>

            <p className="text-gray-500">
              Order ID: #{orderId.slice(-6).toUpperCase()}
            </p>

            <p>Quantity: {orderItem.quantity}</p>
            <p>Price: ₹{orderItem.price}</p>
          </div>
        </div>

        {existingRequest && (
          <div className="mt-6 bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold mb-2">
              Your Return Request
            </h3>

            <p>
              <strong>Type:</strong> {existingRequest.type}
            </p>

            <p className="mt-1">
              <strong>Status:</strong>{" "}
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                {existingRequest.status}
              </span>
            </p>

            <p className="mt-2">
              <strong>Reason:</strong> {existingRequest.reason}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">
              Request Type
            </h3>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Refund"
                  checked={type === "Refund"}
                  onChange={() => setType("Refund")}
                />
                Return for Refund
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Replacement"
                  checked={type === "Replacement"}
                  onChange={() => setType("Replacement")}
                />
                Request Replacement
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Reason for Request
            </h3>

            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Explain your issue..."
            />
          </div>

          <button
            onClick={submitHandler}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}