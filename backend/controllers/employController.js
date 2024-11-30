import employeeModel from "../models/EmployModel.js";
import { v2 as cloudinary } from "cloudinary";

// Api to get  all employee information:

const getAllEmployData = async (req, res) => {
    try {

        const employees = await employeeModel.find({});
        return res.json({ success: true, employees });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to get employee information:

const getEmployInfo = async (req, res) => {
    const { emId } = req.params;

    try {
        const employee = await employeeModel.findById(emId);

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        return res.json({ success: true, employee });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to update employee information:

const updateEmployData = async (req, res) => {

    const { emId } = req.params;
    const { name, email, mobile, designation, gender, courses } = req.body;
    const imageFile = req.file
    try {

        const employee = await employeeModel.findOne({ _id: emId });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        if (name) employee.name = name;
        if (email) employee.email = email;
        if (mobile) employee.mobile = mobile;
        if (designation) employee.designation = designation;
        if (gender) employee.gender = gender;
        // Check if courses are provided and ensure it's an array
        if (courses) {
            const courseArray = Array.isArray(courses) ? courses : JSON.parse(courses || '[]');
            employee.courses = courseArray;
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                folder: 'update_employee_images',
            });

            employee.image = imageUpload.secure_url;

        }

        const updateEmployee = await employee.save();

        return res.json({ success: true, message: 'Employee updated successfully' });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to Delete Employee:
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate inputs
        if (!id) {
            return res.status(400).json({ success: false, message: 'Please provide employee ID' });
        }

        // Find and delete employee by ID
        const deletedEmployee = await employeeModel.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        return res.json({ success: true, message: 'Employee deleted successfully' });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

export { getAllEmployData, deleteEmployee, getEmployInfo, updateEmployData };