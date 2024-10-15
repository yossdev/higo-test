const Customer = require("../../models/customer");

const createCustomer = async (payload) => {
  try {
    const lastRecord = await Customer.findOne().sort({ CustomerID: -1 });
    const customer = new Customer({
      CustomerID: lastRecord.CustomerID + 1,
      Gender: payload.Gender,
      Age: +payload.Age,
      AnnualIncome: +payload.AnnualIncome,
      SpendingScore: +payload.SpendingScore,
      Profession: payload.Profession || "Unknown",
      WorkExperience: +payload.WorkExperience,
      FamilySize: +payload.FamilySize,
    });
    await customer.save();
  } catch (error) {
    throw error;
  }
};

const getGenderSummary = async () => {
  try {
    const summary = await Customer.aggregate([
      {
        $group: {
          _id: "$Gender", // Group by the gender field
          count: { $sum: 1 }, // Count each occurrence
        },
      },
    ]);
    return summary;
  } catch (error) {
    throw error;
  }
};

const getPaginatedCustomers = async (page = 0, limit = 10) => {
  try {
    const skip = page * limit;

    const customers = await Customer.find().skip(skip).limit(limit).exec();

    const totalCustomers = await Customer.countDocuments();

    return {
      totalPages: Math.ceil(totalCustomers / limit),
      customers,
      currentPage: page,
      totalCustomers,
    };
  } catch (error) {
    throw error;
  }
};

const updateCustomerById = async (id, updateData) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData }, // The update data (fields to change)
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return undefined;
    }

    return updatedCustomer;
  } catch (error) {
    throw error;
  }
};

const deleteCustomerById = async (id) => {
  try {
    const result = await Customer.deleteOne({ _id: id });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
};

const getProfessionCountByGender = async () => {
  try {
    const result = await Customer.aggregate([
      {
        $group: {
          _id: "$Profession",
          male: {
            $sum: { $cond: [{ $eq: ["$Gender", "Male"] }, 1, 0] },
          },
          female: {
            $sum: { $cond: [{ $eq: ["$Gender", "Female"] }, 1, 0] },
          },
        },
      },
      // Format the result
      {
        $project: {
          _id: 0, // Remove the default _id field
          profession: "$_id", // Rename _id to profession
          male: 1, // Include male count
          female: 1, // Include female count
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const getMeanSpendingScoreByAgeAndGender = async () => {
  try {
    const result = await Customer.aggregate([
      {
        $group: {
          _id: {
            age: "$Age",
          },
          male: {
            $avg: {
              $cond: [{ $eq: ["$Gender", "Male"] }, "$SpendingScore", null],
            },
          },
          female: {
            $avg: {
              $cond: [{ $eq: ["$Gender", "Female"] }, "$SpendingScore", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          age: "$_id.age",
          male: { $round: ["$male", 2] },
          female: { $round: ["$female", 2] },
        },
      },
      {
        $sort: { age: 1 }, // Sort by age in ascending order
      },
    ]);

    return result.map((v) => {
      return { ...v, age: v.age.toString() };
    });
  } catch (error) {
    throw error;
  }
};

const getMeanAnnualIncomeByProfession = async () => {
  try {
    const result = await Customer.aggregate([
      {
        $group: {
          _id: "$Profession",
          mean: {
            $avg: "$AnnualIncome",
          },
        },
      },
      {
        $project: {
          _id: 0,
          profession: "$_id", // Rename _id to profession
          mean: {
            $round: ["$mean", 2], // Round to 2 decimal places
          },
        },
      },
      {
        $sort: { profession: 1 },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const getSummaryStatistics = async () => {
  try {
    const result = await Customer.aggregate([
      {
        $group: {
          _id: null, // No grouping key, aggregate all documents
          totalCustomers: { $sum: 1 }, // Count total number of customers
          totalProfessions: { $addToSet: "$Profession" }, // Add unique professions
          meanAge: { $avg: "$Age" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCustomers: 1,
          totalProfessions: { $size: "$totalProfessions" }, // Count the size of unique professions array
          meanAge: { $round: ["$meanAge", 2] },
        },
      },
    ]);

    return result.length > 0
      ? result[0]
      : {
          totalCustomers: 0,
          totalProfessions: 0,
          meanAge: 0,
        };
  } catch (error) {
    console.error("Error in aggregation:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  createCustomer,
  getPaginatedCustomers,
  getGenderSummary,
  updateCustomerById,
  deleteCustomerById,
  getProfessionCountByGender,
  getMeanSpendingScoreByAgeAndGender,
  getMeanAnnualIncomeByProfession,
  getSummaryStatistics,
};
