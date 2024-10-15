const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const Customer = require("../models/customer");
const mongoDbConn = require("../db/mongo");

async function seedCustomer() {
  await mongoDbConn();

  try {
    const count = await Customer.countDocuments();
    if (count === 0) {
      console.log("Importing CSV data...");

      const customers = [];

      // Read CSV and accumulate data
      await new Promise((resolve, reject) => {
        fs.createReadStream("./seeders/Customers.csv")
          .pipe(csv())
          .on("data", (row) => {
            const customer = new Customer({
              CustomerID: +row.CustomerID,
              Gender: row.Gender,
              Age: +row.Age,
              AnnualIncome: +row.AnnualIncome,
              SpendingScore: +row.SpendingScore,
              Profession: row.Profession || "Unknown",
              WorkExperience: +row.WorkExperience,
              FamilySize: +row.FamilySize,
            });
            customers.push(customer);
          })
          .on("end", resolve)
          .on("error", reject);
      });

      await Customer.insertMany(customers);

      console.log("CSV data successfully imported.");
    } else {
      console.log("Data already exists in the database.");
    }
  } catch (error) {
    console.error("Seeding error due to:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedCustomer().catch(console.dir);
