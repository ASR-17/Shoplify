import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Starfield from "../components/Starfield.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff } from "lucide-react"; // ✅ add

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ add
  const [error, setError] = useState("");

  // ✅ normalize base URL (remove trailing slash)
  const RAW_BASE =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
  const BASE_URL = RAW_BASE.replace(/\/$/, "");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <Starfield />

      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 rounded-xl border border-white/40 shadow-[0_0_40px_rgba(100,200,255,0.35)]"
        >
          <h1 className="text-center text-xl tracking-widest mb-2 text-blue-300">
            SHOPIFY
          </h1>

          <h2 className="text-3xl font-semibold text-center mb-6">
            Welcome Back
          </h2>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-transparent border border-white/50"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>

            {/* ✅ wrapper for icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // ✅ toggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-12 rounded-md bg-transparent border border-white/50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 font-semibold">
            Login
          </button>

          <p className="text-sm text-center mt-4 text-white/70">
            Don’t have access?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Contact Admin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
