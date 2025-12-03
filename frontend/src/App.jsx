import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users"; // ⬅ مهم بزاف

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route 
  path="/admin/dashboard" 
  element={
    <PrivateRoute allowedRoles={["admin"]}>
      <Dashboard />
    </PrivateRoute>
  } 
/>


        <Route 
          path="/admin/users" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Users />
            </PrivateRoute>
          } 
        />

        {/* User dashboard */}
        <Route 
          path="/user/dashboard" 
          element={
            <PrivateRoute allowedRoles={["user","admin"]}>
              <h1>User Dashboard</h1>
            </PrivateRoute>
          } 
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
