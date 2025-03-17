// import logo from './logo.svg';
import './App.css';
import './style/chat.css';

// function App() {
//   return (
//     <div className="App">
//       <p>Home</p>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebsocketProvider } from './context/WebsocketContext';
// import {WebsocketContext} from './context/WebsocketContext'
// import NavBar from './components/NavBar';
// import AllUsers from './components/AllUsers';
// import ChatPage from './components/ChatPage';
import Register from './views/Register';
import Login from './views/Login';
import AllUsers from './views/AllUsers';
import Chat from './views/Chat';

const App = () => {
  return (
    <AuthProvider>
     <WebsocketProvider>
        <BrowserRouter>
          <Routes>
            {/* <NavBar /> */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AllUsers />} />
              <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </WebsocketProvider>
    </AuthProvider>
  );
};

export default App;
