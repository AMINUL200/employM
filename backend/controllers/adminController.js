import validator from "validator";
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import employeeModel from "../models/EmployModel.js";
import moment from 'moment'; 


// Api for admin Login :
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate inputs
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both username and password' });
        }

        if (username === process.env.ADMIN_USER_NAME && password === process.env.ADMIN_PASSWORD) {
            // Create JWT token
            const token = jwt.sign(username + password, process.env.JWT_SECRET_KEY);
            return res.json({ success: true, message: 'Admin logged in successfully', token });
        } else {
            return res.json({ success: false, message: "Invalid email or password for ADMIN Login" });
        }
    } catch (e) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to create employees:

const addEmployee = async (req, res) => {
    try {

        const { name, email, mobile, designation, gender, courses } = req.body;
        const imageFile = req.file

        // Validate inputs
        if (!name || !email || !mobile || !designation || !gender || !courses) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        const isFind = await employeeModel.findOne({ email: email });
        if (isFind) {
            return res.json({ success: false, message: "Email already exists" });
        }

        // Process courses
        const courseArray = Array.isArray(courses) ? courses : JSON.parse(courses || '[]');
        if (courseArray.length === 0) {
            return res.json({ success: false, message: "Please provide at least one course" });
        }
         // Get the current date
         const formattedDate = moment().format('DD-MMM-YYYY');

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                folder: 'employee_images',
            });
            const imageUrl = imageUpload.secure_url;
            // create new employee in database
            const newEmployee = new employeeModel({
                name,
                email,
                mobile,
                designation,
                gender,
                courses: courseArray,
                createDate: formattedDate,
                image: imageUrl,
            });
            
            await newEmployee.save();
            return res.json({ success: true, message: 'Employee created successfully' });
        }else{
            return res.json({ success: false, message: "Please upload an image" });
        }

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}







export { adminLogin, addEmployee };