import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const VendorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.token) return;
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        "${process.env.REACT_APP_API_URL}/api/reviews/vendor",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setReviews(data);

      if (data.length > 0) {
        const total = data.reduce(
          (acc, r) => acc + r.rating,
          0
        );
        setAverage((total / data.length).toFixed(1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortedReviews = [...reviews]
    .filter((r) =>
      filter === "all" ? true : r.rating === Number(filter)
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Product Reviews
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-5xl font-bold text-blue-600">
              {reviews.length}
            </h2>
            <p className="text-gray-500 mt-2">
              Total Reviews
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-5xl font-bold text-yellow-500">
              {average}
            </h2>
            <p className="text-gray-500 mt-2">
              Average Rating
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm text-gray-500">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border p-3 rounded-lg mt-1"
            >
              <option value="newest">
                Newest First
              </option>
              <option value="oldest">
                Oldest First
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Filter By Rating
            </label>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="w-full border p-3 rounded-lg mt-1"
            >
              <option value="all">
                All Ratings
              </option>
              <option value="5">
                5 Stars
              </option>
              <option value="4">
                4 Stars
              </option>
              <option value="3">
                3 Stars
              </option>
              <option value="2">
                2 Stars
              </option>
              <option value="1">
                1 Star
              </option>
            </select>
          </div>
        </div>

        {sortedReviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        ) : (
          sortedReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${review.product?.image}`}
                    alt="product"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {review.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        review.createdAt
                      ).toDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold mb-1">
                {review.user?.name}
              </h4>

              <div className="text-yellow-500 text-lg mb-2">
                {"★".repeat(review.rating)}
              </div>

              <p className="text-gray-600">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorReviews;