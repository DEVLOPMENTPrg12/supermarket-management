// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // ❌ لا تقرأ user مباشرة — ربما null — خاص نتحقق منه أولا
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // 1️⃣ ماكاينش token → رجع للّوجين
  if (!token) return <Navigate to="/login" replace />;

  // 2️⃣ ماكاينش user → رجع للّوجين
  if (!user) return <Navigate to="/login" replace />;

  // 3️⃣ الدور غير مسموح به → رجع للّوجين
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ كلشي OK
  return children;
};

export default PrivateRoute;
