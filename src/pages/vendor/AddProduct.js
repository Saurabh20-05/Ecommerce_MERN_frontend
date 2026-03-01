import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      formData.append("image", image);

      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Product added successfully");
      navigate("/vendor/products");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mt-6 mb-2">
          Vendor Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Add new products to your store.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            ➕ Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Product Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter product price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Product Description
              </label>
              <textarea
                rows="5"
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-3">
                Product Image
              </label>

              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                  required
                />

                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer text-blue-600 font-medium"
                >
                  📤 Choose Image
                </label>

                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPG, JPEG, PNG
                </p>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition"
              >
                ⬆ Upload Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}