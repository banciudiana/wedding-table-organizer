import Guest from '../models/Guest.js';

export const findGuestByName = async (name) => {
  try {
    const guest = await Guest.findOne({ 
      name: { $regex: name, $options: 'i' } 
    });
    return guest;
  } catch (error) {
    throw error;
  }
};

export const getAllGuests = async () => {
  try {
    return await Guest.find().sort({ name: 1 });
  } catch (error) {
    throw error;
  }
};

export const createGuest = async (guestData) => {
  try {
    const guest = new Guest(guestData);
    return await guest.save();
  } catch (error) {
    throw error;
  }
};

export const updateGuest = async (id, guestData) => {
  try {
    return await Guest.findByIdAndUpdate(id, guestData, { new: true });
  } catch (error) {
    throw error;
  }
};

export const deleteGuest = async (id) => {
  try {
    return await Guest.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};
