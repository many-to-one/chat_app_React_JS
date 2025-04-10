import React, { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";
import appConfig from '../config/Config';
import Cookies from 'js-cookie';

const WebsocketContext = createContext();
const WS_URL = appConfig.WS_URL

const WebsocketProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState({});
  const [userStatusAll, setUserStatusAll] = useState({});
  const [errorAll, setErrorAll] = useState(null);

  const Sock = ({ chatUserId, userId, accessToken }) => {
    const websocket = useWebSocket(`${WS_URL}/${userId}/${chatUserId}/${encodeURIComponent(Cookies.get('access_token'))}`, {
      shouldReconnect: () => true, // Auto-reconnect on disconnection
      onError: (event) => setError(event),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        // console.log(`Sock onMessage data`, data);
        // setUserStatus(data)
      },
      onClose: () => {
        console.log("WebSocket disconnected", userId);
        // You can send a message to the server or handle it locally
        const data = {
          "message": "disconnected",
          "disconnected": userId,
          "from": chatUserId,
        }
        setUserStatus(data)
      },
  
    });
    return websocket; 
  };


  const SockAll = ({ chatUserId, userId, accessToken }) => {
    const websocket = useWebSocket(`${WS_URL}/${userId}/${encodeURIComponent(Cookies.get('access_token'))}`, {
      shouldReconnect: () => true, // Auto-reconnect on disconnection
      onError: (event) => setErrorAll(event),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        // console.log(`Sock onMessage data`, data);
        // setUserStatus(data)
      },
      onClose: () => {
        console.log("WebSocket disconnected", userId);
        // You can send a message to the server or handle it locally
        const data = {
          "message": "disconnected",
          "disconnected": userId,
          "from": chatUserId,
        }
        setUserStatusAll(data)
      },
  
    });
    return websocket; 
  };

  

  return (
    <WebsocketContext.Provider value={{ 
        Sock, 
        socket,
        error,
        userStatus,
        SockAll,
        userStatusAll,
        errorAll

      }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export { WebsocketContext, WebsocketProvider };
