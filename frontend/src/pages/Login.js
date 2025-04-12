/* global FB */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '2440182359680143',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });

      FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const checkLoginState = () => {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  };

  const handleFBLogin = () => {
    FB.login(checkLoginState, { scope: 'public_profile' });
  };

  const statusChangeCallback = (response) => {
    if (response.status === 'connected') {
      fetch('http://localhost:8080/api/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: response.authResponse.accessToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem('jwtToken', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        });
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h1 className="login-title">Welcome to UpSkill</h1>
        <p className="login-subtitle">Log in with your Facebook account to continue</p>
        <button className="login-button" onClick={handleFBLogin}>
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;