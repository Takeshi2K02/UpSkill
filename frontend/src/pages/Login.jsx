import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleLogin = () => {
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
              console.log("✅ Login Success:", data);

              sessionStorage.setItem("jwtToken", data.token);
              sessionStorage.setItem("facebookAccessToken", data.facebookAccessToken);
              sessionStorage.setItem("facebookId", data.user.id);
              sessionStorage.setItem("role", data.user.role); // ➡️ Store role
              login(data.user, data.token);

              // ➡️ Redirect based on role
              if (data.user.role === "ADMIN") {
                navigate("/admin-dashboard");
              } else {
                navigate("/");
              }
            });
        } else {
          console.log("❌ Login failed:", response);
        }
      },
      { scope: "public_profile" }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200">
      <div className="bg-white/90 backdrop-blur-md px-10 py-12 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Welcome to <span className="text-indigo-600">UpSkill</span>
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Connect your Facebook to get started
        </p>
        <button
          onClick={handleLogin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold text-base transition-all shadow-sm hover:shadow-md"
        >
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;