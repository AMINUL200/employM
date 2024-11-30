import React, { useContext, useState } from 'react';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../component/Loader';

const CreateEmployee = () => {
  const { token, backendUrl, isLoading, setIsLoading, } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      courses: checked
        ? [...prevData.courses, value] 
        : prevData.courses.filter((course) => course !== value),
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      // Check if at least one course is selected
      if (!Array.isArray(formData.courses) || formData.courses.length === 0) {
        return toast.error("Please select at least one course");
      }

      if (!formData.image) {
        return toast.error("Please select an image")
      }


      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('courses', JSON.stringify(formData.courses));
      formDataToSend.append('image', formData.image);

    

      const { data } = await axios.post(backendUrl + '/api/admin/add-employee', formDataToSend, { headers: { token } })

      if (data.success) {
        toast.success(data.message);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          courses: [],
          image: null,
        });
        document.getElementById('image').value = null;
      } else {
        toast.error(data.message);
      }

    } catch (e) {
      toast.error(e.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Employee</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter Name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter Email"
              required
            />
          </div>

          {/* Mobile No */}
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
              Mobile No
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter Mobile Number"
              required
            />
          </div>

          {/* Designation */}
          <div className="mb-4">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-600">
              Designation
            </label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <div className="flex items-center mt-1 space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
          </div>

          {/* Courses */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Course</label>
            <div className="flex items-center mt-1 space-x-4">
              {['MCA', 'BCA', 'BSC'].map((course) => (
                <label key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    value={course}
                    checked={formData.courses.includes(course)}
                    onChange={handleCheckboxChange}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">{course}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-600">
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`flex justify-center items-center w-full  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'cursor-not-allowed bg-gray-300 py-4 ' : 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4'}`}
              disabled={isLoading}
            >
              {isLoading ? <Loader/> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
