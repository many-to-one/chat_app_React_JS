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
  const [lastMess, setLastMess] = useState({});
  const [chatUserId, setChatUserId] = useState('');
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
    const { sendMessage, lastMessage, lastJsonMessage, readyState } = SockAll({userId});
  
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


    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         const parsedData = JSON.parse(lastMessage.data);
    //         // console.log(`Got a new message: ${parsedData.sender_id}`)
    //         console.log(`Got a new message: ${parsedData.message}`)
    //     //   setMessageHistory((prev) => [...prev, parsedData]);
    //     }
    //   }, [lastMessage]);

    useEffect(() => {
        if (lastJsonMessage !== null) {
          console.log("Parsed JSON message received:", lastJsonMessage);
          if ( lastJsonMessage["info"] === "new_message" ) {
            console.log('new message', lastJsonMessage["message"])
            setLastMess({'message': lastJsonMessage["message"], receiver_id: lastJsonMessage["user_id"]})
            // setChatUserId(lastJsonMessage["receiver_id"])
            // setMessageHistory((prev) => [...prev, lastJsonMessage]);
          }
          //   setMessageHistory((prev) => [...prev, lastJsonMessage]);
          // } else if ( lastJsonMessage["user_id"] === userId && lastJsonMessage["receiver_id"] === chatUserId ) {
          //   setMessageHistory((prev) => [...prev, lastJsonMessage]);
          // } else if ( lastJsonMessage["is active"] === chatUserId ) {
          //   console.log('is active', lastJsonMessage["is active"])
          //   messageHistory.forEach(message => {
          //     if (message.user_id === chatUserId && message.read === false) {
          //       message.read = true; // Mark the message as read
          //     }
          //     // console.log('message', message);
          //   });
          // }
        }
      }, [lastJsonMessage]);

     //   ###################### END OF WEBSOCKET THIS CHAT LOGIC ######################


  return (
    <Users users={users} lastMess={lastMess} />
  );
};

export default AllUsers;
