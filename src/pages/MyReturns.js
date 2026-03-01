import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MyReturns() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchReturns = async () => {
      try {
        const { data } = await axios.get(
          "${process.env.REACT_APP_API_URL}/api/returns/my",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [user]);

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          My Returns & Replacements
        </h1>

        {requests.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            No return requests found.
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl shadow"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Request #{req._id.slice(-4)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted on{" "}
                      {new Date(req.createdAt).toDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm ${statusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="flex gap-6 p-6">
                  <img
                    src={
                      req.image
                        ? req.image.startsWith("http")
                          ? req.image
                          : `${process.env.REACT_APP_API_URL}/${req.image.replace(
                              /^\/+/,
                              ""
                            )}`
                        : "https://via.placeholder.com/120"
                    }
                    alt=""
                    className="w-28 h-28 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
                      {req.productName}
                    </h4>

                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Type:</strong> {req.type}
                      </p>
                      <p>
                        <strong>Reason:</strong> {req.reason}
                      </p>
                    </div>

                    {req.adminComment && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg border">
                        <p className="font-semibold text-sm mb-1">
                          Vendor Comment
                        </p>
                        <p className="text-sm text-gray-600">
                          {req.adminComment}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 border-l-2 border-blue-500 pl-4 text-sm">
                      <p className="font-semibold">
                        Request Submitted
                      </p>
                      <p className="text-gray-500">
                        {new Date(req.createdAt).toString()}
                      </p>

                      {req.updatedAt &&
                        req.updatedAt !== req.createdAt && (
                          <>
                            <p className="font-semibold mt-4">
                              Status Updated
                            </p>
                            <p className="text-gray-500">
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
        )}
      </div>
    </div>
  );
}