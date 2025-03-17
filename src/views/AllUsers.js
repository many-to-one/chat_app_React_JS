import React, { useEffect, useState } from 'react';
import UseApi from '../api_calls/UseApi';
import axios from 'axios';
import Cookies from 'js-cookie';
import useApi from '../api_calls/UseApi';
import { useNavigate } from 'react-router-dom';
import Users from '../components/Users';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const accessToken = Cookies.get('access_token');
  const axios_ = useApi();
  const navigate = useNavigate();

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


  return (
    <Users users={users} />
  );
};

export default AllUsers;
