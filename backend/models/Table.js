import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  guests: [{
    name: {
      type: String,
      required: true
    },
    email: String,
    phoneNumber: String,
    dietary: String,
    notes: String,
    seatingPosition: String
  }],
  capacity: {
    type: Number,
    default: 8
  },
  location: String,
  special: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Table', tableSchema);
