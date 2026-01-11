import { useState } from "react";
import "./AdminLogin.css";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Login:", email, password);
    alert("Login clicked (API next step)");
  };
return (
  <div className="admin-login-container">
    <div className="admin-login-card">
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
);
}

export default AdminLogin;
