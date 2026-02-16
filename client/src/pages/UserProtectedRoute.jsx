import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  return children;
}

export default UserProtectedRoute;
