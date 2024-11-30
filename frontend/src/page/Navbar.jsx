import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext';

const Navbar = () => {
    const {setToken} = useContext(AppContext)
    const navigate = useNavigate();

    const logout = () => {
        navigate('/login'); 
        setToken(null);  
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        
    }

    return (
        <nav className="bg-gray-500 text-white shadow-lg px-7">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Left Side */}
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {/* Logo */}
                        <span className="text-xl font-bold">Logo</span>
                    </div>
                    <ul className="ml-14 flex space-x-4">
                        {/* Links */}
                        <li onClick={() => navigate('/dashboard')}  className="cursor-pointer hover:text-gray-200">
                            Home
                        </li>
                        <li onClick={() => navigate('/employee-list')}  className="cursor-pointer hover:text-gray-200">
                            Employee List
                        </li>
                    </ul>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Username */}
                    <span className="font-medium mr-16">{localStorage.getItem('name')}</span>
                    {/* Logout Button */}
                    <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-600" onClick={() => logout()}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
