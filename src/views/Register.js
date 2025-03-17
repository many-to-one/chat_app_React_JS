import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import UseRegister from '../auth/UseRegister';
import appConfig from '../config/Config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);

// Define the hook at the top level of the component
// const { data, loading, error, setBody } = UseRegister('/api/register', 'POST');

const handleSubmit = async (e) => {
  e.preventDefault();
  const body = { username, email, password };
//   setBody(body);

  try {
    setLoading(true);
    const response = await axios.post(
        `${appConfig.BASE_URL}/auth/sing_up`, 
        body,
        {
            headers: {
              'Content-Type': 'application/json',
            },
          }
    )
    console.log('Register response ---', response, `${appConfig.BASE_URL}/auth/sing_up`,);
    console.log('Register loading ---', loading);
    console.log('Register error ---', error);
    setData(response.data)
} catch (error) {
    setError(error)
} finally {
    setLoading(false);
    navigate('/')
}
};

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const body = { username, email, password }
//       const { data, loading, error } = UseRegister(body);
//       console.log('Register data ---', data);
//       console.log('Register loading ---', loading);
//       console.log('Register error ---', error);
//     //   setUser(data);
//     } catch (error) {
//       console.error('Registration error', error);
//     }
//   };

  return (
    <div>
      <h2>Register</h2>
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
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
