import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    enum: ["farmer", "vendor"],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    minlength: [2, 'Location must be at least 2 characters'],
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
