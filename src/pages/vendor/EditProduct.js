import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`
      );

      setForm({
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
      });

    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("stock", form.stock);

      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Product updated successfully");
      navigate("/vendor/products");

    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mt-6 mb-2">
          Edit Product
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-10 mt-6">

          <form onSubmit={handleSubmit} className="space-y-8">

            <div>
              <label className="block font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-lg p-4"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full border rounded-lg p-4"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Description
              </label>
              <textarea
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded-lg p-4"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                className="w-full border rounded-lg p-4"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-3">
                Change Image (optional)
              </label>

              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
                className="w-full"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg"
              >
                Update Product
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}