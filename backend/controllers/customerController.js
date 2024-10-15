const Customer = require("../models/customer");

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getCustomerById = async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id);
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.status(200).json(customer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createCustomer = async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res.status(201).json(customer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.updateCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.status(200).json(customer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.deleteCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndDelete(req.params.id);
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.status(200).json(customer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
