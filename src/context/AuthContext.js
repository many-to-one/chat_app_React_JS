import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import appConfig from '../config/Config';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(Cookies.get('access_token'));
  const [loading, setLoading] = useState(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get('/api/current_user');
  //       setUser(response.data);
  //     } catch (error) {
  //       console.log('Not logged in');
  //     }
  //   };
  //   fetchUser();
  // }, []);


  const login = async (body) => {

    setLoading(true);
    try {
      const response = await axios.post(
        `${appConfig.BASE_URL}/auth/login`,  
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          }
      )
      return response
    } catch (error) {
      return error
    }

  }


  const getRefreshToken = async () => {

    const response = await axios.post(`${appConfig.BASE_URL}/auth/refresh_token?refresh_token=${appConfig.refreshToken}`);
    // response['online'] = true;
    console.log('getRefreshToken', response)
    
    Cookies.set('access_token', response.data.access_token, {
          // expires: 1,  // Access token expires in 1 day
          secure: true,
      });
    
      // Cookies.set('refresh_token', response.data.refresh_token, {
      //     // expires: 7,  // Refresh token expires in 7 days
      //     secure: true,
      // });

      return response.data;
  
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        setUser, 
        getRefreshToken, 
        accessToken,
        loading, 
        setLoading,
        login,
       }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
// export const useAuth = () => useContext(AuthContext);
