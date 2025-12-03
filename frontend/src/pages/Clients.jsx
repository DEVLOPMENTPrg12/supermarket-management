import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const API = "http://localhost:5000/api";
const token = localStorage.getItem("adminToken"); // تأكد أن token موجود

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ---------------- Fetch clients ----------------
  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API}/clients`, config);
      setClients(res.data);
    } catch (err) {
      console.log(err.response?.data || err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error("Error fetching clients!");
      }
    }
  };

  useEffect(() => {
    console.log(token);
    fetchClients();
  }, []);

  // ---------------- Add / Update client ----------------
  const handleSubmit = async () => {
    try {
      const payload = { name, email, phone, address };

      if (editingId) {
        await axios.put(`${API}/clients/${editingId}`, payload, config);
        toast.success("Client updated successfully!");
      } else {
        await axios.post(`${API}/clients`, payload, config);
        toast.success("Client added successfully!");
      }

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setEditingId(null);
      fetchClients();
    } catch (err) {
      console.log(err.response?.data || err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Error saving client";
      toast.error(errorMessage);
    }
  };

  // ---------------- Edit client ----------------
  const handleEdit = (client) => {
    setEditingId(client._id);
    setName(client.name || "");
    setEmail(client.email || "");
    setPhone(client.phone || "");
    setAddress(client.address || "");
  };

  // ---------------- Delete client ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/clients/${id}`, config);
      toast.success("Client deleted successfully!");
      fetchClients();
    } catch (err) {
      console.log(err.response?.data || err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error("Error deleting client!");
      }
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800">Client Management</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <PlusIcon className="h-6 w-6 mr-2" />
            {editingId ? "Edit Client" : "Add New Client"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Client Name"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Client Email"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Phone</label>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Address</label>
              <input
                type="text"
                placeholder="Client Address"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={handleSubmit}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {editingId ? "Update Client" : "Add Client"}
            </button>
            {editingId && (
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setAddress("");
                }}
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {clients.map((c, index) => (
                  <tr key={c._id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">{c.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{c.email || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{c.phone || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{c.address || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
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
      <ToastContainer />
    </div>
  );
};

export default Clients;
