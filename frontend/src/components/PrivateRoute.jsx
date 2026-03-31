import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;