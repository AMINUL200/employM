import mongoose from 'mongoose';
import moment from 'moment';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  createDate: {
    type: String,
    default: () => moment().format('DD-MMM-YYYY'),
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate .png or .jpg extensions (case insensitive)
        return /\.(jpg|png)$/i.test(value);
      },
      message: 'Image must be a PNG or JPG file',
    },
  },
});

const employeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default employeeModel;
