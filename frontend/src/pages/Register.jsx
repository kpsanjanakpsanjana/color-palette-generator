import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, []);

  const handleRegister = () => {
    const user = { email, password };

    // Save user
    localStorage.setItem("user", JSON.stringify(user));

    // Go to login page
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
      
    </div>
  );
}

export default Register;