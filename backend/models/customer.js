const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  CustomerID: { type: Number, required: true, unique: true },
  Gender: { type: String, enum: ["Male", "Female"], required: true },
  Age: { type: Number, required: true },
  AnnualIncome: { type: Number, required: true },
  SpendingScore: { type: Number, min: 0, max: 100, required: true },
  Profession: { type: String, required: true },
  WorkExperience: { type: Number, required: true },
  FamilySize: { type: Number, required: true },
});

module.exports = mongoose.model("Customer", customerSchema);
