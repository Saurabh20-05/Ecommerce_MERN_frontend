import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function ProductReviews() {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const productRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`
      );

      const reviewRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reviews/${id}`
      );

      setProduct(productRes.data);
      setReviews(reviewRes.data);

      if (user) {
        const orderRes = await axios.get(
          "${process.env.REACT_APP_API_URL}/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const delivered = orderRes.data.some(order =>
          order.status === "delivered" &&
          order.items.some(
            item => item.product?.toString() === id
          )
        );

        setCanReview(delivered);
      }
    } catch (error) {
      console.error("Error loading product reviews:", error);
    } finally {
      setLoading(false);
    }
  };
    fetchData();
  }, [id]);

  

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Write something");
      return;
    }

    try {
      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/reviews",
        {
          productId: id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">
        Product Reviews
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row gap-8">
        <img
          src={`${process.env.REACT_APP_API_URL}${product.image}`}
          alt={product.name}
          className="w-56 h-56 object-contain bg-gray-100 rounded-xl"
        />

        <div>
          <h2 className="text-2xl font-bold">
            {product.name}
          </h2>

          <p className="text-blue-600 text-xl font-semibold mt-2">
            ₹{product.price}
          </p>

          <div className="mt-6">
            <h3 className="text-4xl font-bold">
              {average}
            </h3>

            <div className="text-yellow-500 text-2xl">
              {"★".repeat(Math.round(average))}
              {"☆".repeat(5 - Math.round(average))}
            </div>

            <p className="text-gray-500 mt-2">
              {reviews.length} reviews
            </p>
          </div>
        </div>
      </div>

      {canReview && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Write a Review
          </h2>

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            className="border p-2 rounded mb-4"
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your review..."
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          No reviews yet.
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl shadow p-6 mb-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">
                {review.user?.name || "User"}
              </h4>

              <div className="text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>

            <p className="mt-2 text-gray-600">
              {review.comment}
            </p>
          </div>
        ))
      )}
    </div>
  );
}