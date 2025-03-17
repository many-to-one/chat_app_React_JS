import { useState, useEffect } from 'react';
import axios from 'axios';
import appConfig from '../config/Config';

const UseLogin = (body) => {

    // const body = {username, password} 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    try {
        setLoading(true);
        const response = axios.post(
            `${appConfig.BASE_URL}/auth/login`, 
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
            }
        )
        setData(response.data)
    } catch (error) {
        setError(error)
    } finally {
        setLoading(false);
    }

    return { data, loading, error };

}

export default UseLogin;