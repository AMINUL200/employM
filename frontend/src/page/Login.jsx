import React, { useContext, useState } from 'react'
import { AppContext } from '../context/Appcontext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../component/Loader';

const Login = () => {

    const { setToken, backendUrl,  isLoading, setIsLoading } = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            const {data} = await axios.post(backendUrl + '/api/admin/login', {username, password})

            if(data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', username);
                setToken(data.token);
                navigate('/dashboard');
            }else{
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }finally{
            setIsLoading(false);
        }

    }



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-600"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`flex justify-center items-center w-full  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'cursor-not-allowed bg-gray-300 py-4 ' : 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader/> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
