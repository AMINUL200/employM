import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';


const EmployeeList = () => {
    const { backendUrl, token, getEmployData } = useContext(AppContext);
    const { employData } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10); // Items per page
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const navigate = useNavigate();

    // Search filter with null checks
    const filteredEmployees = employData.filter((employee) => {
        if (!employee) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            (employee.name?.toLowerCase().includes(searchLower) || '') ||
            (employee.designation?.toLowerCase().includes(searchLower) || '') ||
            (employee.gender?.toLowerCase().includes(searchLower) || '') ||
            (employee.createDate?.toLowerCase().includes(searchLower) || '')
        );
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage); // Updated to use filteredEmployees
    const paginatedEmployees = filteredEmployees.slice( // Updated to use filteredEmployees
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Sorting logic should still be applied to filteredEmployees
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const order = sortConfig.direction === 'ascending' ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    });


    // Handle page change
    const handlePageChange = (direction) => {
        setCurrentPage((prevPage) => {
            if (direction === 'next' && prevPage < totalPages) {
                return prevPage + 1;
            } else if (direction === 'prev' && prevPage > 1) {
                return prevPage - 1;
            }
            return prevPage;
        });
    };


    const handleDelete = async (id) => {
        try {

            const { data } = await axios.delete(`${backendUrl}/api/${id}`, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getEmployData();
            } else {
                toast.error(data.message);
            }


        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row justify-end items-center mb-4">
                <h2 className="text-lg font-bold mr-12">Total Count: {filteredEmployees.length}</h2>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2 md:mt-0"
                    onClick={() => navigate('/create-employee')}
                >
                    Create Employee
                </button>
            </div>
            <div className="mb-4 flex justify-end items-center">
                <label htmlFor="search" className='mr-2 font-bold'>Search</label>
                <input
                    type="text"
                    id='search'
                    placeholder="Enter Search Keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[19rem] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table Wrapper */}
            {paginatedEmployees.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Unique Id</th>
                                <th className="px-4 py-2 border">Image</th>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Mobile No</th>
                                <th className="px-4 py-2 border">Designation</th>
                                <th className="px-4 py-2 border">Gender</th>
                                <th className="px-4 py-2 border">Course</th>
                                <th className="px-4 py-2 border">Create Date</th>
                                <th className="px-4 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees.map((employee, index) => (
                                <tr key={employee.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border text-center">
                                        {index + 1 + (currentPage - 1) * rowsPerPage}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <img
                                            src={employee.image}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full mx-auto"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">{employee.name}</td>
                                    <td className="px-4 py-2 border">
                                        <a href={`mailto:${employee.email}`} className="text-blue-500 underline">
                                            {employee.email}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 border">{employee.mobile}</td>
                                    <td className="px-4 py-2 border">{employee.designation}</td>
                                    <td className="px-4 py-2 border">{employee.gender}</td>
                                    <td className="px-4 py-2 border">
                                        {Array.isArray(employee.courses) ? employee.courses.join(', ') : employee.courses}
                                    </td>
                                    <td className="px-4 py-2 border">{employee.createDate}</td>
                                    <td className="px-4 py-2 border text-center">
                                        <button className="text-blue-500 hover:underline mr-2" onClick={() => navigate(`/employee/${employee._id}`)}>Edit</button>
                                        <button className="text-red-500 hover:underline" onClick={() => handleDelete(employee._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center mt-8 text-gray-500">
                    No employees found matching the search criteria.
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                <button
                    className={`px-4 py-2  rounded-lg hover:bg-gray-400 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500   text-white'}`}
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="px-4 mt-2 md:mt-0">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`px-4 py-2  rounded-lg hover:bg-gray-400 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500   text-white'}`}
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EmployeeList;
