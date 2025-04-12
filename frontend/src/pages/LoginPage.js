/* global FB */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
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
    FB.login(checkLoginState, { scope: 'public_profile' }); // No email to avoid scope error
  };

  const statusChangeCallback = (response) => {
    if (response.status === 'connected') {
      console.log('✅ Logged in', response.authResponse);

      fetch('http://localhost:8080/api/auth/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.authResponse.accessToken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('🛡️ Backend response:', data);

          // ✅ Save JWT + user in sessionStorage
          sessionStorage.setItem('jwtToken', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        });
    } else {
      console.log('❌ Not logged in');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Facebook Login</h2>
      <button onClick={handleFBLogin}>Login with Facebook</button>
    </div>
  );
};

export default LoginPage;