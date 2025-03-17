import React, { useState, useEffect, useRef, useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import appConfig from '../config/Config'
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useApi from "../api_calls/UseApi";
import {AuthContext} from '../context/AuthContext';
import {WebsocketContext} from '../context/WebsocketContext';
import Cookies from 'js-cookie';
import Users from "../components/Users";

// const WS_URL = "ws://localhost:8080"; // Replace with your WebSocket server URL
const WS_URL = appConfig.WS_URL
const BASE_URL = appConfig.BASE_URL

const Chat = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const [userId, seUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(Cookies.get('access_token'))

  const axios = useApi();
  const {getRefreshToken} = useContext(AuthContext);
  const {Sock, error} = useContext(WebsocketContext);

  const location = useLocation();
  const chatUserId = location.state.userId;
  const chatUsername = location.state.username;
  const users = location.state.users;

  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.id

  // useEffect(() => {
  //   console.log('appConfig.accessToken ---------', Cookies.get('access_token'))
  //   const decodedToken = jwtDecode(accessToken);
  //   seUserId(decodedToken.id)
  //   // const userId = decodedToken.id
  // }, [accessToken])

  // console.log('Chat--userId', userId, chatUserId)
  // console.log('Chat--users', users)

  const chatHistory = async () => {
    setMessageHistory([])
    const response = await axios.get(`${BASE_URL}/chat/get_chat?sender_id=${Number(userId)}&receiver_id=${Number(chatUserId)}&count=${100}`)
    console.log('Chat--response', response)
    if (response.data.length !== 0) {
        setMessageHistory(response.data[0].messages.reverse())
    }
  }

  useEffect(() => {
    chatHistory();
  }, [userId, chatUserId])


//   ###################### WEBSOCKET THIS CHAT LOGIC ######################

  // const { sendMessage, lastMessage, lastJsonMessage, readyState } = useWebSocket(`${WS_URL}${chatUserId}/${userId}?token=${accessToken}`, {
  //   shouldReconnect: () => true, // Auto-reconnect on disconnection
  //   onError: (event) => handleWebSocketError(event),
  // });

  const { sendMessage, lastMessage, lastJsonMessage, readyState } = Sock({
    chatUserId,
    userId,
    accessToken,
  });

  useEffect(() => {
    handleWebSocketError(error);
  }, [error])

  const handleWebSocketError = (event) => {
    console.error("WebSocket Error:", event);
    getRefreshToken()
  };

  //   ###################### END OF WEBSOCKET THIS CHAT LOGIC ######################


  useEffect(() => {
    if (lastMessage !== null) {
        const parsedData = JSON.parse(lastMessage.data);
        console.log(`Got a new message: ${parsedData.message}`)
    //   setMessageHistory((prev) => [...prev, parsedData]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log('Chat--userId', userId, chatUserId)
      console.log('lastJsonMessage userId', lastJsonMessage["user_id"])
      console.log('lastJsonMessage receiver_id', lastJsonMessage["receiver_id"])
      console.log("Parsed JSON message received:", lastJsonMessage);
      if ( lastJsonMessage["user_id"] === chatUserId && lastJsonMessage["receiver_id"] === userId ) {
        setMessageHistory((prev) => [...prev, lastJsonMessage]);
      } else if ( lastJsonMessage["user_id"] === userId && lastJsonMessage["receiver_id"] === chatUserId ) {
        setMessageHistory((prev) => [...prev, lastJsonMessage]);
      }
    }
  }, [lastJsonMessage]);


  const handleSendMessage = () => {
    sendMessage(JSON.stringify({ 
        message: newMessage,
        sender_id: userId,
        receiver_id: chatUserId,
    }));
    setNewMessage(""); // Clear input field after sending
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom every time `messageHistory` changes
  }, [messageHistory]);

  return (

    <div className="flexRowCenter">

      <Users users={users} />

      <div className="chat-container">
        <div>{chatUsername} {connectionStatus}</div>
          <div className="message-list">
              {messageHistory.map((message, index) => (
                  <div 
                      className={message.user_id === userId ? "message user-message" : "message chatUser-message"} 
                      key={index}
                  >
                      {message.message}
                  </div>
              ))}
              <div ref={messageEndRef}></div>
          </div>

          <div className="chat-input">
              <textarea
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message"
              />
              <button onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN}>
                  Send
              </button>
          </div>

      </div>

    </div>

  );
};

export default Chat;
