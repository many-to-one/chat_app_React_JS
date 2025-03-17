import React, { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";
import appConfig from '../config/Config';

const WebsocketContext = createContext();
const WS_URL = appConfig.WS_URL

const WebsocketProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  const Sock = ({ chatUserId, userId, accessToken }) => {
    const websocket = useWebSocket(`${WS_URL}${chatUserId}/${userId}?token=${accessToken}`, {
      shouldReconnect: () => true, // Auto-reconnect on disconnection
      onError: (event) => setError(event),
    });
    return websocket; 
  };


  // useEffect(() => {
  //   if (config) {
  //     const { chatUserId, userId, accessToken } = config;
  //     const websocket = useWebSocket(`${WS_URL}${chatUserId}/${userId}?token=${accessToken}`, {
  //       shouldReconnect: () => true,
  //     });
  //     setSocket(websocket); // Store the WebSocket data in the context
  //   }
  // }, [config]); // Re-run when config changes
  

  return (
    <WebsocketContext.Provider value={{ Sock, socket, error }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export { WebsocketContext, WebsocketProvider };
