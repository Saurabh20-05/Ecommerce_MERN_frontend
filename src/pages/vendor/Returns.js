import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function VendorReturns() {
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const { data } = await axios.get(
        "${process.env.REACT_APP_API_URL}/api/returns/admin/all",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setReturns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, comment) => {
    if (!status) {
      alert("Please select a status first");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/returns/${id}`,
        {
          status,
          adminComment: comment || "",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setComments((prev) => ({
        ...prev,
        [id]: {},
      }));

      fetchReturns();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const count = (status) =>
    returns.filter((r) => r.status === status).length;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
        Returns & Replacements
      </h2>

      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-5 text-center mb-8">
        {["Pending", "Processing", "Approved", "Rejected", "Completed"].map(
          (status) => (
            <div key={status}>
              <p className="font-semibold">{status}</p>
              <p className="text-2xl">{count(status)}</p>
            </div>
          )
        )}
      </div>

      {returns.map((req) => (
        <div
          key={req._id}
          className="bg-white rounded-xl shadow mb-8"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div>
              <h3 className="font-bold text-lg">
                Request #{req._id.slice(-4)}
              </h3>
              <p className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(req.createdAt).toDateString()}
              </p>
            </div>

            <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              {req.status}
            </span>
          </div>

          <div className="flex p-6 gap-8">
            <div className="w-1/2 flex gap-4">
              <img
                src={
                  req.image
                    ? `${process.env.REACT_APP_API_URL}/${req.image.replace(
                        /^\/+/,
                        ""
                      )}`
                    : "https://via.placeholder.com/100"
                }
                className="w-28 h-28 object-cover rounded"
                alt=""
              />

              <div>
                <h4 className="font-semibold text-lg">
                  {req.productName}
                </h4>

                <p>
                  <strong>Customer:</strong>{" "}
                  {req.user?.name}
                </p>

                <p>
                  <strong>Quantity:</strong> 1
                </p>

                <p>
                  <strong>Price:</strong> ₹99999
                </p>
              </div>
            </div>

            <div className="w-1/2">
              <p className="font-semibold mb-2">
                Request Details
              </p>

              <p>
                <strong>Type:</strong> {req.type}
              </p>

              <p>
                <strong>Reason:</strong> {req.reason}
              </p>

              <div className="flex gap-4 mt-4">
                <select
                  value={comments[req._id]?.status || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [req._id]: {
                        ...comments[req._id],
                        status: e.target.value,
                      },
                    })
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Select Action</option>
                  <option value="Processing">Processing</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                  <option value="Completed">Complete</option>
                </select>

                <input
                  type="text"
                  placeholder="Add a comment (optional)"
                  value={comments[req._id]?.comment || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [req._id]: {
                        ...comments[req._id],
                        comment: e.target.value,
                      },
                    })
                  }
                  className="border px-3 py-2 rounded flex-1"
                />

                <button
                  onClick={() =>
                    updateStatus(
                      req._id,
                      comments[req._id]?.status,
                      comments[req._id]?.comment
                    )
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
                  disabled={!comments[req._id]?.status}
                >
                  Update
                </button>
              </div>

              <div className="mt-6 border-l-2 border-blue-500 pl-4">
                <p className="font-semibold">
                  Request Submitted
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(req.createdAt).toString()}
                </p>

                {req.updatedAt &&
                  req.updatedAt !== req.createdAt && (
                    <>
                      <p className="font-semibold mt-4">
                        Status Updated
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(req.updatedAt).toString()}
                      </p>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}