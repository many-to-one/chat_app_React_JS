import { useState, useEffect } from 'react';
import axios from 'axios';
import appConfig from '../config/Config';

const UseRegister = (body) => {

    // const body = {username, email, password} 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    try {
        setLoading(true);
        const response = axios.post(
            `${appConfig.BASE_URL}/auth/sign_up`, 
            body,
            appConfig.headers
        )
        setData(response.data)
    } catch (error) {
        setError(error)
    } finally {
        setLoading(false);
    }

    return { data, loading, error };

}

export default UseRegister;