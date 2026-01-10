import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Starfield from "../components/Starfield.jsx";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        formData
      );

      // auto-login after signup
      login(res.data.token, res.data.user);

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background */}
      <Starfield />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div
          className="
            w-full
            max-w-[92%]
            sm:max-w-sm
            md:max-w-md
            lg:max-w-md
            p-4 sm:p-6 md:p-8
            rounded-xl
            border border-white/40
            shadow-[0_0_40px_rgba(100,200,255,0.35)]
          "
        >
          {/* Header */}
          <h1 className="text-center text-lg sm:text-xl tracking-widest text-blue-300">
            SHOPIFY
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center ">
            Create Account
          </h2>
          <p className="text-center text-white/60 mb-4">
            Join the cosmic community
          </p>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-3">
              {error}
            </p>
          )}

          {/* Google Signup */}
          <button
            className="
              w-full py-3 sm:py-2 mb-2
              rounded-md
              border border-white/50
              hover:bg-white/10
              transition font-medium
            "
          >
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="mx-3 text-white/50 text-sm">OR</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-white/80">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-2 rounded-md
                           bg-transparent border border-white/50
                           focus:outline-none focus:border-blue-400
                           placeholder-white/40"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-white/80">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-2 rounded-md
                           bg-transparent border border-white/50
                           focus:outline-none focus:border-blue-400
                           text-white"
                required
              >
                <option value="" className="bg-black/30">
                  Select category
                </option>
                <option value="shopkeeper" className="bg-black">
                  Shopkeeper
                </option>
                <option value="freelancer" className="bg-black">
                  Freelancer
                </option>
                <option value="business-owner" className="bg-black">
                  Business Owner
                </option>
                <option value="other" className="bg-black">
                  Other
                </option>
              </select>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-white/80">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-2 rounded-md
                           bg-transparent border border-white/50
                           focus:outline-none focus:border-blue-400
                           placeholder-white/40"
                required
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-white/80">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-2 rounded-md
                           bg-transparent border border-white/50
                           focus:outline-none focus:border-blue-400
                           placeholder-white/40"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm mb-1 text-white/80">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-2 rounded-md
                           bg-transparent border border-white/50
                           focus:outline-none focus:border-blue-400
                           placeholder-white/40"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full py-3 sm:py-2
                rounded-md
                bg-blue-500 hover:bg-blue-600
                transition font-semibold
                shadow-lg
              "
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-right mt-6 text-white/70">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
