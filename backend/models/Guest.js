import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  phoneNumber: String,
  tableNumber: {
    type: Number,
    ref: 'Table'
  },
  dietaryRestrictions: String,
  plus_one: Boolean,
  checked_in: {
    type: Boolean,
    default: false
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Guest', guestSchema);
