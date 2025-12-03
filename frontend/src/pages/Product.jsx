import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Assuming you have Heroicons installed for icons; if not, you can install it via npm install @heroicons/react
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, DocumentArrowDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from "react-toastify";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(""); // global search

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: 0,
    image: "",
    SKU: "",
    status: "active",
    brand: "",
    tags: [],
  });
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: 0,
    image: "",
    SKU: "",
    status: "active",
    brand: "",
    tags: [],
  });

  const token = localStorage.getItem("token");

  // ------------------ PAGINATION ------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ------------------ FETCH ------------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      alert("Error Fetch Products!");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.csv";
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Products List", 14, 15);

    const tableColumn = ["Name", "Description", "Price", "Quantity", "Category", "SKU", "Status", "Brand", "Tags"];
    const tableRows = [];

    // khlli kolchi f filteredProducts (ma t5dm slice)
    filteredProducts.forEach((p) => {
      const productData = [
        p.name,
        p.description,
        p.price,
        p.quantity,
        p.category?.name,
        p.SKU,
        p.status,
        p.brand,
        p.tags?.join(", "),
      ];
      tableRows.push(productData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 10 },
    });

    doc.save("products.pdf");
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ------------------ FILTERED & PAGINATED ------------------
  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();

    // check search
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.SKU && p.SKU.toLowerCase().includes(term)) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(term)));

    // check low stock toggle
    const matchesLowStock = !showLowStockOnly || p.quantity < 5;

    // combine both conditions
    return matchesSearch && matchesLowStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginateProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  };

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // ------------------ CRUD ------------------
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category)
      return alert("Please fill required fields!");
   try {
  await axios.post("http://localhost:5000/api/products", newProduct, { headers:{ Authorization: `Bearer ${token}` } });
  toast.success("Product added successfully!");
  setShowAddModal(false);
  fetchProducts();
  setNewProduct({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: 0,
    image: "",
    SKU: "",
    status: "active",
    brand: "",
    tags: [],
  });
} catch (err) {
  console.log(err);
  const errorMessage = err.response?.data?.message || "Error adding product!";
  toast.error(errorMessage);
}

  };

  const openEditModal = (p) => {
    setEditProduct({
      _id: p._id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category?._id || p.category,
      quantity: p.quantity || 0,
      image: p.image || "",
      SKU: p.SKU || "",
      status: p.status || "active",
      brand: p.brand || "",
      tags: p.tags || [],
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async () => {
    try {
  await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct, { headers: { Authorization: `Bearer ${token}` } });
  toast.success("Product updated successfully!");
  setShowEditModal(false);
  fetchProducts();
} catch (err) {
  console.log(err);
  const errorMessage = err.response?.data?.message || "Error updating product!";
  toast.error(errorMessage);
}

  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
  await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  toast.success("Product deleted successfully!");
  fetchProducts();
} catch (err) {
  console.log(err);
  const errorMessage = err.response?.data?.message || "Error deleting product!";
  toast.error(errorMessage);
}

  };

  // ------------------ RENDER ------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-3xl font-bold text-green-800">Product Management</h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showLowStockOnly
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
              }`}
            >
              {showLowStockOnly ? <EyeSlashIcon className="h-5 w-5 mr-2" /> : <EyeIcon className="h-5 w-5 mr-2" />}
              {showLowStockOnly ? "Show All Products" : "Show Low Stock Only"}
            </button>
            
            <button
              onClick={exportCSV}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {paginateProducts().map((p, index) => (
                  <tr key={p._id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 font-semibold">{p.price} DH</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 flex items-center gap-2">
                      {p.quantity}
                      {p.quantity < 5 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.image}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.SKU}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.tags?.join(", ")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
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

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mt-6">
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-green-200 hover:bg-green-300 text-green-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-green-600 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-green-200 hover:bg-green-300 text-green-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <ProductModal
            product={newProduct}
            setProduct={setNewProduct}
            categories={categories}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddProduct}
            title="Add New Product"
          />
        )}
        {showEditModal && (
          <ProductModal
            product={editProduct}
            setProduct={setEditProduct}
            categories={categories}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditProduct}
            title="Edit Product"
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </div>
  );
};

export default Product;








// ----------------- PRODUCT MODAL -----------------
const ProductModal = ({ product, setProduct, categories, onClose, onSave, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <input
            type="text"
            placeholder="Product Description"
            className="w-full p-2 border rounded"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Product Price"
            className="w-full p-2 border rounded"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Quantity in stock"
            className="w-full p-2 border rounded"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: e.target.value })
            }
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Image URL</label>
          <input
            type="text"
            placeholder="Product Image URL"
            className="w-full p-2 border rounded"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">SKU</label>
          <input
            type="text"
            placeholder="SKU"
            className="w-full p-2 border rounded"
            value={product.SKU}
            onChange={(e) => setProduct({ ...product, SKU: e.target.value })}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={product.status}
            onChange={(e) => setProduct({ ...product, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Brand</label>
          <input
            type="text"
            placeholder="Brand"
            className="w-full p-2 border rounded"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags</label>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full p-2 border rounded"
            value={product.tags.join(", ")}
            onChange={(e) =>
              setProduct({ ...product, tags: e.target.value.split(",").map((t) => t.trim()) })
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

