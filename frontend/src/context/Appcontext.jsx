import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();

const appContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [employData, setEmployData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



    const getEmployData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/employee-list', { headers: { token } });

            if (data.success) {
                setEmployData(data.employees);
                
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err);
            console.error(err);
        }
    }

    const value = {
        backendUrl,
        token,
        setToken,
        employData,
        getEmployData,
        isLoading,
        setIsLoading,
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }else{
            getEmployData();
        }
    }, [token, navigate]);


    useEffect(() => {
        getEmployData();
    }, []);



    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default appContextProvider;