import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import PrivateRoute from "./components/PrivateRoute";

const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return !isLoggedIn ? children : <Navigate to="/home" />;
};

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/register" />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <PrivateRoute>
            <Gallery />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/register" />} />

    </Routes>
  );
}

export default App;