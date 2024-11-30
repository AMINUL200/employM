import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import adminRoute from './routes/AdminRout.js';
import connectCloudinary from './config/cloudinary.js';
import employRoute from './routes/EmployRout.js';



const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
connectCloudinary();





// Middleware
app.use(cors());
app.use(express.json());



app.use('/api/admin', adminRoute);
app.use('/api', employRoute)


app.get('/', (req, res) => {
    res.send('Hello, This is the API for Employ Management System');
});

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
})