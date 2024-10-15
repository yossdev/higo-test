const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customerController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - customer_id
 *         - name
 *         - age
 *         - gender
 *       properties:
 *         customer_id:
 *           type: integer
 *           description: The unique ID of the customer
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the customer
 *           example: John Doe
 *         age:
 *           type: integer
 *           description: The age of the customer
 *           example: 29
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: The gender of the customer
 *           example: male
 *         profession:
 *           type: string
 *           description: The profession of the customer
 *           example: Doctor
 *         annual_income:
 *           type: number
 *           format: float
 *           description: The annual income of the customer
 *           example: 120000.00
 *         spending_score:
 *           type: number
 *           format: float
 *           description: The spending score of the customer
 *           example: 75.0
 */

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get a list of customers
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get("/", customerController.getAllCustomers);

// router.get("/:id", customerController.getCustomerById);

// router.post("/", customerController.createCustomer);

// router.put("/:id", customerController.updateCustomer);

// router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
