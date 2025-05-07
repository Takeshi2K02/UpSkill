import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Facebook Login
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "2440182359680143",
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };

    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    FB.login(
      (response) => {
        if (response.status === "connected") {
          const accessToken = response.authResponse.accessToken;

          fetch("http://localhost:8080/api/auth/facebook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("\u2705 Facebook Login Success:", data);
              sessionStorage.setItem("jwtToken", data.token);
              sessionStorage.setItem("facebookAccessToken", data.facebookAccessToken);
              sessionStorage.setItem("facebookId", data.user.id);
              sessionStorage.setItem("role", data.user.role);
              login(data.user, data.token);
              navigate(data.user.role === "ADMIN" ? "/admin-dashboard" : "/");
            });
        } else {
          console.log("\u274C Facebook Login failed:", response);
        }
      },
      { scope: "public_profile" }
    );
  };

  const handleUsernameLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("jwtToken", data.token);
        sessionStorage.setItem("role", data.user.role);
        sessionStorage.setItem("username", data.user.username || data.user.name);
        login(data.user, data.token);
        navigate(data.user.role === "ADMIN" ? "/admin-dashboard" : "/");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200">
      <div className="bg-white/90 backdrop-blur-md px-10 py-12 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
          Welcome to <span className="text-indigo-600">UpSkill</span>
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full mt-4 px-4 py-3 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-xl transition-all duration-200"
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
        <button
          onClick={handleUsernameLogin}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          Login
        </button>

        <p className="text-gray-400 my-4 text-sm font-medium">or</p>

        <button
          onClick={handleFacebookLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-base w-full shadow-md transition-all"
        >
          Login with Facebook
        </button>

        <p className="mt-6 text-sm font-medium">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;