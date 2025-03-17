import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import {AuthContext} from '../context/AuthContext';


const BASE_URL = `http://localhost:8005`


const isAccessTokenExpired = (accessToken) => {
  try {
      // Decoding the access token and checking if it has expired
      const decodedToken = jwtDecode(accessToken);
      return decodedToken.exp < Date.now() / 1000;
  } catch (err) {
      return true;
  }
};


// // Function to refresh the access token using the refresh token
// const getRefreshToken = async (refreshToken) => {

//   const response = await axios.post(`${BASE_URL}/auth/refresh_token?refresh_token=${refreshToken}`);
//   // console.log('getRefreshToken', response)
//   return response.data;

// };


// const setCredentials = async (access_token, refresh_token) => {

//   Cookies.set('access_token', access_token, {
//       // expires: 1,  // Access token expires in 1 day
//       secure: true,
//   });

//   Cookies.set('refresh_token', refresh_token, {
//       // expires: 7,  // Refresh token expires in 7 days
//       secure: true,
//   });

// }


const useApi = () => {

  const {getRefreshToken} = useContext(AuthContext);

  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');
  // console.log('useAxios - accessToken', accessToken);
  // console.log('useAxios - refreshToken', refreshToken);

  // Create an Axios instance with base URL and access token in the headers
  const axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Add an interceptor to the Axios instance
  axiosInstance.interceptors.request.use(async (req) => {
      // Check if the access token is expired
      if (!isAccessTokenExpired(accessToken)) {
          return req; // If not expired, return the original request
      }

      // If the access token is expired, refresh it
      const response = await getRefreshToken();
      console.log('getRefreshToken---', response)

      // await setCredentials(response.access_token, response.refresh_token)

      // Update the request's 'Authorization' header with the new access token
      req.headers.Authorization = `Bearer ${response.access_token}`;
      return req; // Return the updated request
  });

  return axiosInstance; // Return the custom Axios instance
};

export default useApi;
