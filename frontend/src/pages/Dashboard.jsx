import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { 
  HomeIcon, 
  UserGroupIcon, 
  ShoppingCartIcon, 
  TagIcon,       
  BellIcon, 
  UserCircleIcon,
  TruckIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Components for sections
import Users from "./Users";
import Product from "./Product";
import Categories from "./Categories"; 
import Supplier from "./Supplie"; 
import Purchases from "./Purchase";
import Sales from "./Sales"; 
import Clients from "./Clients";
import Reports from "./Reports";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalSales: 0 });
  const [salesChart, setSalesChart] = useState({ labels: [], datasets: [] });
  const [stockChart, setStockChart] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);


  useEffect(() => {
    fetchDashboard();
    fetchSalesChart();
    fetchStockChart();
  }, []);

 const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token"); // token li t7t f login

    const res = await axios.get(
      "http://localhost:5000/api/admin/dashboard",
      {
        headers: { Authorization: `Bearer ${token}` } // hna token
      }
    );

    setStats(res.data.stats);
  } catch (err) {
    console.error(err);
  }
};


  const fetchSalesChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/chart/sales");
      setSalesChart({
        labels: res.data.labels,
        datasets: [
          {
            label: "Revenue ($)",
            data: res.data.data,
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 2,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStockChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/chart/stock");
      setStockChart({
        labels: res.data.labels,
        datasets: [
          {
            label: "Stock",
            data: res.data.data,
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 2,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-green-700 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-green-600 to-green-700 text-white transition-all duration-300 shadow-xl`}>
        <div className="p-4 border-b border-green-500 flex items-center justify-between">
          <h1 className="text-xl font-bold">{sidebarOpen ? "Supermarket" : "SM"}</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-green-500 rounded-lg transition-colors duration-200">
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveSection("dashboard")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "dashboard" ? "bg-green-500" : ""}`}>
            <HomeIcon className="h-5 w-5" /> {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button onClick={() => setActiveSection("products")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "products" ? "bg-green-500" : ""}`}>
            <ShoppingCartIcon className="h-5 w-5" /> {sidebarOpen && <span>Products</span>}
          </button>

          <button onClick={() => setActiveSection("categories")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "categories" ? "bg-green-500" : ""}`}>
            <TagIcon className="h-5 w-5" /> {sidebarOpen && <span>Categories</span>}
          </button>

          <button onClick={() => setActiveSection("suppliers")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "suppliers" ? "bg-green-500" : ""}`}>
            <TruckIcon className="h-5 w-5" /> {sidebarOpen && <span>Suppliers</span>}
          </button>

          <button onClick={() => setActiveSection("purchases")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "purchases" ? "bg-green-500" : ""}`}>
            <ShoppingCartIcon className="h-5 w-5" /> {sidebarOpen && <span>Purchases</span>}
          </button>

          <button onClick={() => setActiveSection("sales")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "sales" ? "bg-green-500" : ""}`}>
            <ShoppingCartIcon className="h-5 w-5" /> {sidebarOpen && <span>Sales</span>}
          </button>
          <button 
  onClick={() => setActiveSection("clients")} 
  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "clients" ? "bg-green-500" : ""}`}>
  <UserGroupIcon className="h-5 w-5" /> {sidebarOpen && <span>Clients</span>}
</button>
<button 
  onClick={() => setActiveSection("reports")} 
  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "reports" ? "bg-green-500" : ""}`}>
  <TagIcon className="h-5 w-5" /> {sidebarOpen && <span>Reports</span>}
</button>


          <button onClick={() => setActiveSection("users")} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-green-500 w-full transition-colors duration-200 ${activeSection === "users" ? "bg-green-500" : ""}`}>
            <UserGroupIcon className="h-5 w-5" /> {sidebarOpen && <span>Users</span>}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

...

<header className="bg-white shadow-lg border-b border-green-200 p-4 flex justify-between items-center">
  <h2 className="font-semibold text-green-800 text-lg">Admin Panel</h2>

  <div className="flex items-center space-x-5 relative">
    <button className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200">
      <BellIcon className="h-7 w-7 text-green-600" />
    </button>

    {/* PROFILE DROPDOWN */}
    <div className="relative">
      <button
        className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
        onClick={() => setProfileOpen(!profileOpen)}
      >
        <UserCircleIcon className="h-10 w-10 text-green-700" />
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-xl border border-green-200 py-3 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-semibold text-green-800">Bilal ALALLAM</p>
            <p className="text-sm text-gray-600">alallambilal13@gmail.com</p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-1"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  </div>
</header>

        {/* Content */}
        <main className="p-6 space-y-6 overflow-y-auto bg-gradient-to-br from-green-50 to-green-100">
          {activeSection === "dashboard" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-xl rounded-xl p-6 border-l-8 border-green-500 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-600 font-medium">Total Users</p>
                      <h3 className="text-3xl font-bold text-green-800 mt-1">{stats.totalUsers}</h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-xl rounded-xl p-6 border-l-8 border-green-500 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <ShoppingCartIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-600 font-medium">Total Products</p>
                      <h3 className="text-3xl font-bold text-green-800 mt-1">{stats.totalProducts}</h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-xl rounded-xl p-6 border-l-8 border-green-500 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <TagIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-600 font-medium">Total Sales</p>
                      <h3 className="text-3xl font-bold text-green-800 mt-1">{stats.totalSales}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-green-200">
                  <h2 className="text-lg font-semibold mb-4 text-green-800">Sales Chart (Last 7 Days)</h2>
                  <Line data={salesChart} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl border border-green-200">
                  <h2 className="text-lg font-semibold mb-4 text-green-800">Stock Chart</h2>
                  <Bar data={stockChart} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "products" && <Product />}
          {activeSection === "categories" && <Categories />}
          {activeSection === "suppliers" && <Supplier />}
          {activeSection === "purchases" && <Purchases />}
          {activeSection === "sales" && <Sales />}
          {activeSection === "clients" && <Clients />}
                    {activeSection === "reports" && <Reports/>}

          {activeSection === "users" && <Users />}
        </main>
      </div>
    </div>
  );
}
