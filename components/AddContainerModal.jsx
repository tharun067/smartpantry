"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

function AddContainerModal({ isOpen, onClose, onSubmit, householdId }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    currentWeight: 0,
    maxWeight: 1000,
    minWeight: 100,
    alertWeight: 200,
    unit: "g",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, productId: data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let productId = formData.productId;

      if (!productId) {
        const productResponse = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.productName, category: formData.category }),
        });
        const productData = await productResponse.json();
        productId = productData._id;
      }

      const containerData = { ...formData, productId, householdId };
      await onSubmit(containerData);
      onClose();
    } catch (error) {
      setError("Failed to add container" || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Container</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select name="productId" value={formData.productId} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">-- Add new product --</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {!formData.productId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Product Name</label>
                <input type="text" name="productName" placeholder="Enter product name" className="w-full p-2 border rounded-md" value={formData.productName} onChange={handleChange} required />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight</label>
                <input type="number" name="currentWeight" value={formData.currentWeight} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded-md" required>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="items">Items</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Weight</label>
                <input type="number" name="maxWeight" value={formData.maxWeight} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Weight</label>
                <input type="number" name="minWeight" value={formData.minWeight} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Weight</label>
                <input type="number" name="alertWeight" value={formData.alertWeight} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {loading ? "Adding..." : "Add Container"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContainerModal;
