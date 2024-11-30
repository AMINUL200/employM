import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './page/Login'
import Navbar from './page/Navbar'
import Dashboard from './page/Dashboard'
import CreateEmployee from './page/CreateEmployee'
import EmployList from './page/EmployList'
import EditEmployee from './page/EditEmployee'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/Appcontext';

const App = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();



  return (
    <div>
      <ToastContainer />
      {token && <Navbar />}
      <Routes>

        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} />


        {/* Protected Routes */}
        {token && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-employee" element={<CreateEmployee />} />
            <Route path="/employee-list" element={<EmployList />} />
            <Route path="/employee/:emId" element={<EditEmployee />} />
          </>
        )}
      </Routes>

    </div>
  )
}

export default App
