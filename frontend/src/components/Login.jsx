import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { ShoppingCartIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  console.log("🔹 Submitting login with:", { email, password });

  try {
    const res = await API.post("/auth/login", { email, password });
    console.log("✅ Login response:", res.data);

    // store token
    localStorage.setItem("token", res.data.token);
    console.log("🔹 Token stored:", res.data.token);

    // store user
    const userData = {
      id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("🔹 User stored:", userData);

    // redirect based on role
    if (userData.role === "admin") {
      console.log("🔹 Redirecting to admin dashboard");
      navigate("/admin/dashboard");
    } else {
      console.log("🔹 Redirecting to user dashboard");
      navigate("/user/dashboard");
    }

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    console.log("❌ LOGIN ERROR RESPONSE:", err.response?.data);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl border border-green-200 p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCartIcon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 ml-3">Supermarket</h1>
          </div>

          <h2 className="text-xl text-center font-semibold text-green-700 mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-green-600">
              Forgot your password?{" "}
              <a href="#" className="font-medium hover:text-green-800">
                Reset it here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
