import mongoose, { mongo } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must enter his name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    default: Date.now(),
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  role: {
    type: String,
    enum: ['user', 'patient', 'doctor'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'User must have a Password'],
    trim: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
    required: function () {
      return this.isNew;
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
  },

  /**
   * ***************************************************** Doctor Specific Fileds *****************************************************
   */
  doctorInfo: {
    type: {
      specialty: {
        type: String,
        required: function () {
          return this.role === 'doctor';
        },
      },
      hospital: String,
      patients: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    required: function () {
      return this.role === 'doctor';
    },
  },

  /**
   * ***************************************************** Doctor Specific Fileds *****************************************************
   */
  patientInfo: {
    type: {
      medicalHistory: String,
      primaryDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String,
      },
    },
    required: function () {
      return this.role === 'patient';
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);
  // Set passwordChangedAt if password is modified (not on new document)
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
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
