import express from 'express';
import { addEmployee, adminLogin } from '../controllers/adminController.js';
import authAdmin from '../middlewares/AuthAdmin.js';
import upload from '../middlewares/multer.js';



const adminRoute = express.Router();

adminRoute.post('/login', adminLogin);
adminRoute.post('/add-employee',upload.single('image'), authAdmin, addEmployee)


export default adminRoute;