import Table from '../models/Table.js';

// Search guest by name across all tables
export const findGuestByName = async (name) => {
  try {
    const result = await Table.aggregate([
      { $unwind: '$guests' },
      { 
        $match: { 
          'guests.name': { $regex: name, $options: 'i' } 
        } 
      },
      { $limit: 1 }
    ]);

    if (result.length === 0) {
      return null;
    }

    const table = result[0];
    return {
      name: table.guests.name,
      tableNumber: table.tableNumber,
      dietary: table.guests.dietary,
      notes: table.guests.notes
    };
  } catch (error) {
    throw error;
  }
};

export const getTableByNumber = async (tableNumber) => {
  try {
    return await Table.findOne({ tableNumber });
  } catch (error) {
    throw error;
  }
};

export const getAllTables = async () => {
  try {
    return await Table.find().sort({ tableNumber: 1 });
  } catch (error) {
    throw error;
  }
};

export const createTable = async (tableData) => {
  try {
    const table = new Table(tableData);
    return await table.save();
  } catch (error) {
    throw error;
  }
};

export const updateTable = async (tableNumber, tableData) => {
  try {
    return await Table.findOneAndUpdate(
      { tableNumber },
      tableData,
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const addGuestToTable = async (tableNumber, guestData) => {
  try {
    return await Table.findOneAndUpdate(
      { tableNumber },
      { $push: { guests: guestData } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const removeGuestFromTable = async (tableNumber, guestName) => {
  try {
    return await Table.findOneAndUpdate(
      { tableNumber },
      { $pull: { guests: { name: guestName } } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};
