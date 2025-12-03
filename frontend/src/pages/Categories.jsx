import React, { useState, useEffect } from "react";
import API from "../services/api";

// Assuming you have Heroicons installed for icons; if not, you can install it via npm install @heroicons/react
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newCategory, setNewCategory] = useState({ name: "" });
  const [editCategory, setEditCategory] = useState({ _id: "", name: "" });

  const token = localStorage.getItem("token");

  // ---------------- FETCH ----------------
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories", { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching categories!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- ADD ----------------
  const handleAddCategory = async () => {
    if (!newCategory.name) return alert("Please enter category name!");
    try {
      await API.post("/categories", newCategory, { headers: { Authorization: `Bearer ${token}` } });
      setShowAddModal(false);
      setNewCategory({ name: "" });
      fetchCategories();
    } catch (err) {
      console.log(err);
      alert("Error adding category!");
    }
  };

  // ---------------- EDIT ----------------
  const openEditModal = (c) => {
    setEditCategory({ _id: c._id, name: c.name });
    setShowEditModal(true);
  };

  const handleEditCategory = async () => {
    if (!editCategory.name) return alert("Please enter category name!");
    try {
      await API.put(`/categories/${editCategory._id}`, editCategory, { headers: { Authorization: `Bearer ${token}` } });
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      console.log(err);
      alert("Error updating category!");
    }
  };

  // ---------------- DELETE ----------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (err) {
      console.log(err);
      alert("Error deleting category!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-3xl font-bold text-green-800">Category Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {categories.map((c, index) => (
                  <tr key={c._id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(c._id)}
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

        {/* Modals */}
        {showAddModal && (
          <CategoryModal
            title="Add New Category"
            category={newCategory}
            setCategory={setNewCategory}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddCategory}
          />
        )}

        {showEditModal && (
          <CategoryModal
            title="Edit Category"
            category={editCategory}
            setCategory={setEditCategory}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditCategory}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;

// ----------------- CATEGORY MODAL -----------------
const CategoryModal = ({ title, category, setCategory, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-green-200">
        <h2 className="text-xl font-bold text-green-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-green-400 hover:text-green-600 transition-colors duration-150"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Category Name</label>
          <input
            type="text"
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 p-6 border-t border-green-200 bg-green-50">
        <button
          className="px-4 py-2 bg-green-200 hover:bg-green-300 text-green-700 font-medium rounded-lg transition-colors duration-200"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
