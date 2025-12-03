import React, { useState, useEffect } from "react";
import axios from "axios";

// Assuming you have Heroicons installed for icons; if not, you can install it via npm install @heroicons/react
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    balance: 0,
  });

  const token = localStorage.getItem("token");

  // ---------------- FETCH SUPPLIERS ----------------
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ---------------- CRUD ----------------
  const handleSaveSupplier = async () => {
    try {
      if (editSupplier) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/suppliers/${editSupplier._id}`,
          editSupplier,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/suppliers",
          newSupplier,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowModal(false);
      setEditSupplier(null);
      setNewSupplier({
        name: "",
        phone: "",
        email: "",
        address: "",
        company: "",
        balance: 0,
      });
      fetchSuppliers();
    } catch (err) {
      console.log(err);
      alert("Error saving supplier");
    }
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers();
    } catch (err) {
      console.log(err);
      alert("Error deleting supplier");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-3xl font-bold text-green-800">Supplier Management</h1>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Supplier
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {suppliers.map((s, index) => (
                  <tr key={s._id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{s.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{s.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{s.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 font-semibold">{s.balance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
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

        {/* Modal */}
        {showModal && (
          <SupplierModal
            supplier={editSupplier || newSupplier}
            setSupplier={editSupplier ? setEditSupplier : setNewSupplier}
            onClose={() => {
              setShowModal(false);
              setEditSupplier(null);
            }}
            onSave={handleSaveSupplier}
            title={editSupplier ? "Edit Supplier" : "Add New Supplier"}
          />
        )}
      </div>
    </div>
  );
};

export default Supplier;

// ----------------- SUPPLIER MODAL -----------------
const SupplierModal = ({ supplier, setSupplier, onClose, onSave, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
          <label className="block text-sm font-medium text-green-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Supplier Name"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.name}
            onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Phone</label>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.phone}
            onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.email}
            onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Address</label>
          <input
            type="text"
            placeholder="Address"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.address}
            onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Company</label>
          <input
            type="text"
            placeholder="Company Name"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.company}
            onChange={(e) => setSupplier({ ...supplier, company: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Balance</label>
          <input
            type="number"
            placeholder="Balance"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={supplier.balance}
            onChange={(e) => setSupplier({ ...supplier, balance: e.target.value })}
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
