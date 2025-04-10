import React, { useEffect, useState, useContext } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";
import UseApi from '../api_calls/UseApi';
import axios from 'axios';
import Cookies from 'js-cookie';
import useApi from '../api_calls/UseApi';
import { useNavigate } from 'react-router-dom';
import Users from '../components/Users';
import {AuthContext} from '../context/AuthContext';
import {WebsocketContext} from '../context/WebsocketContext';
import appConfig from '../config/Config'
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const WS_URL = appConfig.WS_URL
const BASE_URL = appConfig.BASE_URL

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const accessToken = Cookies.get('access_token');
  const axios_ = useApi();
  const navigate = useNavigate();

  const {SockAll, errorAll, userStatusAll, setUserStatusAll} = useContext(WebsocketContext);
  const {getRefreshToken} = useContext(AuthContext);

  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.id

  const fetchData = async () => {
    
    try {
      const response = await axios_.get('/users/all_users')
      setUsers(response.data);
      console.log('AllUsers', response);
    } catch (error) {
      console.log('AllUsers-error', error);
      navigate('/login');
    }

  }

  useEffect(() => {
    fetchData();
  }, [])



  //   ###################### WEBSOCKET THIS CHAT LOGIC ######################
    const { sendMessage, lastMessage, lastJsonMessage, readyState } = SockAll({userId,});
  
    useEffect(() => {
      handleWebSocketError(errorAll);
    }, [errorAll])
  
    const handleWebSocketError = (event) => {
      console.error("WebSocket Error:", event);
      getRefreshToken()
      // window.location.reload();
    };
  
    const connectionStatus = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Connected",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Disconnected",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];
  
    useEffect(() => {
      console.log('connectionStatus', connectionStatus)
    }, [readyState])
     //   ###################### END OF WEBSOCKET THIS CHAT LOGIC ######################


  return (
    <Users users={users} />
  );
};

export default AllUsers;
