import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/Appcontext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../component/Loader';

const EditEmployee = () => {
  const { emId } = useParams();
  const { token, backendUrl, isLoading, setIsLoading } = useContext(AppContext);

  const [employInfo, setEmployInfo] = useState(null); 
  const [formData, setFormData] = useState({}); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch employee details
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/${emId}`, {
        headers: { token },
      });
      if (data.success) {
        setEmployInfo(data.employee);
        // Initialize formData with employee data
        setFormData({
          name: data.employee.name || '',
          email: data.employee.email || '',
          mobile: data.employee.mobile || '',
          designation: data.employee.designation || '',
          gender: data.employee.gender || '',
          courses: data.employee.courses || [],
          image: null,
        });
      } else {
        toast.error('Failed to fetch employee data');
      }
    } catch (error) {
      toast.error('Error fetching employee data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [emId]);

  // Handle input changes (general and course changes)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (JPG or PNG)
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValidType) {
        toast.error('Only JPG and PNG images are allowed');
        e.target.value = null; 
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  // Handle course changes
  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      courses: checked
        ? [...prevData.courses, value] 
        : prevData.courses.filter((c) => c !== value), 
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'courses') {
        updateData.append(key, JSON.stringify(value)); 
      } else {
        updateData.append(key, value);
      }
    });

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/${emId}`,
        updateData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || 'Employee updated successfully');
        fetchEmployee(); // Refresh employee data after update
      } else {
        toast.error(data.message || 'Failed to update employee');
      }
    } catch (error) {
      toast.error('Error updating employee');
    } finally {
      setIsLoading(false);
      navigate('/employee-list')
    }
  };

  if (loading || !employInfo) return <p>Loading...</p>; 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Edit Employee
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={employInfo.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={employInfo.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Mobile:</label>
            <input
              type="text"
              name="mobile"
              defaultValue={employInfo.mobile}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Designation:</label>
            <select
              name="designation"
              value={employInfo.designation} 
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Gender:</label>
            <select
              name="gender"
              defaultValue={employInfo.gender}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Courses:</label>
            <div className="space-y-2">
              {['MCA', 'BCA', 'BSC'].map((course) => (
                <div key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value={course}
                    checked={formData.courses.includes(course)} 
                    onChange={handleCourseChange}
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-gray-600">{course}</label>
                </div>
              ))}

            </div>
          </div>


          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Image:</label>
            {employInfo.image && (
              <img
                src={employInfo.image}
                alt="Employee"
                className="h-20 w-20 rounded-full object-cover mb-4"
              />
            )}
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className={`flex justify-center items-center w-full  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'cursor-not-allowed bg-gray-300 py-4 ' : 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4'}`}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : ' Update Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
