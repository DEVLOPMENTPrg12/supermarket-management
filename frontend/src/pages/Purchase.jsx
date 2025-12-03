import React, { useState, useEffect } from "react";
import axios from "axios";

// Assuming you have Heroicons installed for icons; if not, you can install it via npm install @heroicons/react
import { PlusIcon, TrashIcon, DocumentPlusIcon, PencilIcon } from "@heroicons/react/24/outline";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([{ product: "", quantity: 1, price: 0 }]);
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [note, setNote] = useState("");
  const [editingPurchaseId, setEditingPurchaseId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch data
  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchases", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (purchase) => {
    setEditingPurchaseId(purchase._id);
    setSupplier(purchase.supplier?._id || "");
    setStatus(purchase.status || "unpaid");
    setNote(purchase.note || "");
    setItems(
      purchase.items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.price,
      }))
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPurchaseId) return;

    const formattedItems = items.map((i) => ({
      ...i,
      subtotal: i.quantity * i.price,
    }));

    try {
      await axios.put(
        `http://localhost:5000/api/purchases/${editingPurchaseId}`,
        {
          supplier,
          items: formattedItems,
          totalAmount: calculateTotal(),
          status,
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPurchases();

      // reset form
      setEditingPurchaseId(null);
      setSupplier("");
      setItems([{ product: "", quantity: 1, price: 0 }]);
      setStatus("unpaid");
      setNote("");
    } catch (err) {
      console.error(err);
      alert("Error updating purchase!");
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
  }, []);

  // Items operations
  const addItem = () =>
    setItems([...items, { product: "", quantity: 1, price: 0 }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setItems(newItems);
  };

  // Total calculation
  const calculateTotal = () => {
    return items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedItems = items.map((i) => ({
      ...i,
      subtotal: i.quantity * i.price,
    }));

    try {
      await axios.post(
        "http://localhost:5000/api/purchases",
        {
          supplier,
          items: formattedItems,
          totalAmount: calculateTotal(),
          status,
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPurchases();

      // reset
      setSupplier("");
      setItems([{ product: "", quantity: 1, price: 0 }]);
      setStatus("unpaid");
      setNote("");

    } catch (err) {
      console.error(err);
      alert("Error creating purchase!");
    }
  };

  const handleFormSubmit = (e) => {
    if (editingPurchaseId) {
      handleUpdate(e);
    } else {
      handleSubmit(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/purchases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPurchases();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800">Purchase Management</h1>
        </div>

        {/* Create/Edit Purchase Form */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <DocumentPlusIcon className="h-6 w-6 mr-2" />
            {editingPurchaseId ? "Edit Purchase" : "Create New Purchase"}
          </h2>

          <form onSubmit={handleFormSubmit}>
            {/* Supplier */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700 mb-2">Supplier</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </div>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700 mb-2">Note</label>
              <textarea
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any notes (optional)"
                rows={3}
              ></textarea>
            </div>

            {/* Items */}
            <h3 className="text-lg font-medium text-green-800 mb-4">Items</h3>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Product</label>
                  <select
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Choose product</option>
                    {products.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Price</label>
                  <input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}

            {/* Add Item Button */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Item
              </button>
            </div>

            {/* Total */}
            <div className="text-xl font-bold mb-4 text-green-800">
              Total: {calculateTotal()} MAD
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <DocumentPlusIcon className="h-5 w-5 mr-2" />
              {editingPurchaseId ? "Update Purchase" : "Create Purchase"}
            </button>
          </form>
        </div>

        {/* Purchases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {purchases.map((p, index) => (
                  <tr key={p._id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{p.supplier?.name}</td>
                    <td className="px-6 py-4 text-sm text-green-600">
                      {p.items.map((item) => (
                        <div key={item.product._id} className="mb-1">
                          <span className="font-medium">{item.product.name}</span> - Qty: {item.quantity}, Price: {item.price} MAD
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-900">{p.totalAmount} MAD</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : p.status === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
