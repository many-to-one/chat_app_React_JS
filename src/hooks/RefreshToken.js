import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import appConfig from '../config/Config';

export const getRefreshToken = async () => {

    const response = await axios.post(`${appConfig.BASE_URL}/auth/refresh_token?refresh_token=${appConfig.refreshToken}`);
    // console.log('getRefreshToken', response)
    return response.data;
  
  };