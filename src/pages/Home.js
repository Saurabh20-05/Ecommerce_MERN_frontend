import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProductModal from "../components/ProductModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const role = user?.user?.role;

    if (role === "admin") {
      navigate("/admin", { replace: true });
    }

    if (role === "vendor") {
      navigate("/vendor", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "${process.env.REACT_APP_API_URL}/api/products"
        );
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">
        {error}
      </div>
    );
  }

  const total = products.length;

  return (
    <div className="w-full">
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img
          src="/images/BANNER.png"
          alt="Klutch Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10"></div>

        <div className="relative z-10 flex items-center h-full px-10 md:px-20">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Klutch
            </h1>

            <h2 className="text-2xl md:text-3xl mb-4">
              Your Style, Your Way
            </h2>

            <p className="text-lg text-gray-200 mb-6">
              Discover premium fashion, electronics, and lifestyle essentials curated for modern living.
            </p>

            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900">
        <div className="text-center mb-16 px-10">
          <h2 className="text-3xl font-bold text-white">
            Shop By Category
          </h2>
          <p className="text-gray-400 mt-3">
            Explore our top product categories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-10">
          {[
            {
              title: "Electronics",
              subtitle: "Latest gadgets and tech",
              image:
                "https://images.unsplash.com/photo-1498049794561-7780e7231661"
            },
            {
              title: "Fashion",
              subtitle: "Trendy styles for everyone",
              image:
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
            },
            {
              title: "Home & Living",
              subtitle: "Make your home beautiful",
              image:
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            }
          ].map((cat, index) => (
            <div
              key={index}
              className="relative h-[420px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold">
                  {cat.title}
                </h3>
                <p className="text-lg text-gray-200 mt-2">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-100 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-3xl font-bold text-center mb-16">
            Latest Products
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="bg-gray-50 rounded-2xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-60 object-cover"
                />

                <div className="p-6">
                  <h3 className="font-semibold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-blue-600 font-bold mb-4">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-gray-200 text-center py-2 rounded-lg"
                    >
                      Reviews
                    </Link>

                    {user?.user?.role === "customer" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product._id);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-800">
        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-4 gap-8">
          {[
            { title: "Free Shipping", desc: "On orders above ₹1000" },
            { title: "Easy Returns", desc: "30-day return policy" },
            { title: "Secure Payment", desc: "100% secure checkout" },
            { title: "24/7 Support", desc: "Dedicated support team" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition text-center"
            >
              <h4 className="font-semibold text-lg mb-3">
                {item.title}
              </h4>
              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-200 py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center px-10">
          <h3 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h3>

          <p className="mb-8 text-gray-700">
            Stay updated with latest products and offers.
          </p>

          <div className="flex justify-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 w-80 rounded-l-lg border"
            />

            <button className="bg-red-500 text-white px-6 py-3 rounded-r-lg hover:bg-red-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-white font-bold mb-4">Klutch</h4>
            <p className="text-sm">
              Modern multi-vendor marketplace platform.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/my-returns" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-white transition">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <a
              href="mailto:support@klutch.com"
              className="hover:text-white transition text-sm"
            >
              support@klutch.com
            </a>
          </div>
        </div>

        <div className="text-center text-sm mt-12 pt-6 border-t border-gray-700">
          © {new Date().getFullYear()} Klutch. All rights reserved.
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}