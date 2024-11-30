import express from 'express';
import { deleteEmployee, getAllEmployData, getEmployInfo, updateEmployData } from '../controllers/employController.js';
import authAdmin from '../middlewares/AuthAdmin.js';
import upload from '../middlewares/multer.js';


const employRoute = express.Router();

employRoute.get('/employee-list', authAdmin, getAllEmployData);
employRoute.get('/:emId', authAdmin, getEmployInfo);
employRoute.put('/:emId', authAdmin, upload.single('image'), updateEmployData);
employRoute.delete('/:id', authAdmin, deleteEmployee);


export default employRoute;