import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      FB.init({
        appId: "2440182359680143",
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });

    //   FB.getLoginStatus(function (response) {
    //     console.log("Facebook login status:", response);
    //   });
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

          // Send to backend
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
              login(data.user, data.token); // ✅ Use context login
              navigate("/"); // ✅ Use router
            });
        } else {
          console.log("❌ Login failed:", response);
        }
      },
      { scope: "public_profile" }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to UpSkill</h1>
        <p className="text-gray-600 mb-8">Login with Facebook to continue</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium text-lg transition"
        >
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;