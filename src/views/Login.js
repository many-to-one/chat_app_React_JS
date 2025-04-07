import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import useApi from '../api_calls/UseApi';
import UseLogin from '../auth/UseLogin';
import { useNavigate } from 'react-router-dom';
import appConfig from '../config/Config';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axios_ = useApi();
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
  
    try {
      setLoading(true);
      const response = await login(body)
      
      console.log('Login response ---', response);
      console.log('Login loading ---', loading);
      console.log('Login error ---', error);
      setData(response.data)
      Cookies.set('access_token', response.data.access_token); // { expires: 1 } Expires in 1 day
      Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 }); // Expires in 7 day
      setLoading(false);
      navigate('/')
  } catch (error) {
      setError(error)
  } 
  // finally {
  //     setLoading(false);
  //     navigate('/')
  // }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
