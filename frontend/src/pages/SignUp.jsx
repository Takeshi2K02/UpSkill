import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account created! Please login.");
        navigate("/login");
      } else {
        alert("Sign-up failed: " + data.message);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white/90 backdrop-blur-md px-10 py-12 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
          Create an Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full mt-2 px-4 py-3 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-xl transition-all duration-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 px-4 py-3 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-xl transition-all duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mt-4 px-4 py-3 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-xl transition-all duration-200"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          Sign Up
        </button>

        <p className="mt-6 text-sm font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;