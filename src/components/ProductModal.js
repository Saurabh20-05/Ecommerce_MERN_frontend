import React from "react";
import { useNavigate } from "react-router-dom";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <img
            src={`${process.env.REACT_APP_API_URL}${product.image}`}
            alt={product.name}
            className="max-h-[400px] object-contain"
          />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {product.name}
            </h2>

            <p className="text-red-500 text-xl font-semibold mb-4">
              ₹{product.price}
            </p>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onAddToCart(product._id)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              View Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;