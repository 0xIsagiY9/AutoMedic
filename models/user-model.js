import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    trim: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'patient', 'doctor'],
    default: 'user',
  },

  // ------------------------------------------ Specified for Patient ------------------------------------------
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Links patient to a doctor
  },

  // ------------------------------------------ Specified for Doctors ------------------------------------------
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  ],
});

userSchema.pre('save', async function (next) {
  //1) Onry this function if the Password is Modified
  if (!this.isModified('password')) return next();
  //2) Hash the Password
  this.password = await bcrypt.hash(this.password, 10);
  //3) Set The passwordChangedAt if password is Modified
  if (!this.isModified) {
    this.passwordChangedAt = Date.now() - 1000;
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
