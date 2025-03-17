import Cookies from 'js-cookie';

const appConfig = {
    // BASE_URL: 'https://chat.sellior.pl',
    BASE_URL: 'http://localhost:8005',
    WS_URL: 'ws://localhost:8005/ws/',
    headers: {
        'Content-Type': 'application/json',
    },

    accessToken: Cookies.get('access_token'),
    refreshToken: Cookies.get('refresh_token'),

  };
  
  export default appConfig;
  