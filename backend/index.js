const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("./configs/swagger");
const mongoDbConn = require("./db/mongo");
const customerRoutes = require("./routes/v1/customerRoutes");
const customer = require("./models/customer");
const {
  createCustomer,
  getGenderSummary,
  getPaginatedCustomers,
  updateCustomerById,
  deleteCustomerById,
  getProfessionCountByGender,
  getMeanSpendingScoreByAgeAndGender,
  getMeanAnnualIncomeByProfession,
  getSummaryStatistics,
} = require("./db/query");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.NEXT_URI,
  })
);
app.use(express.json());

// Database connection
mongoDbConn();

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_URI,
    methods: ["GET", "POST"],
    allowedHeaders: ["application/json"],
  },
  path: "/express-socket",
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1/customers", customerRoutes);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("addCustomer", async (payload) => {
    try {
      const page = payload.page;
      const size = payload.size;
      delete payload.page;
      delete payload.size;
      await createCustomer(payload);
      const data = await getPaginatedCustomers(page, size);
      socket.emit("dataTableResp", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  });

  socket.on("updateCustomer", async (payload) => {
    try {
      const data = await updateCustomerById(payload.id, payload.body);
      if (!data) {
        socket.emit("updatedCustomer", {
          success: false,
          message: "Customer Not Found!",
        });
        return;
      }

      socket.emit("updatedCustomer", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
      socket.emit("updatedCustomer", { success: false, error: error.message });
    }
  });

  socket.on("deleteCustomer", async (payload) => {
    try {
      const rowDeleted = await deleteCustomerById(payload.id);
      if (rowDeleted === 0) {
        socket.emit("deletedCustomer", { success: true, message: "" });
        return;
      }

      socket.emit("deletedCustomer", { success: true, id: payload.id });
    } catch (error) {
      console.error("Error:", error);
    }
  });

  socket.on("dataTable", async (payload) => {
    try {
      const data = await getPaginatedCustomers(payload.page, payload.size);
      socket.emit("dataTableResp", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  });

  const genderSummary = async () => {
    try {
      const data = await getGenderSummary();
      socket.emit("countGender", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  genderSummary();

  const professionByGenderSummary = async () => {
    try {
      const data = await getProfessionCountByGender();
      socket.emit("countProfessionByGender", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  professionByGenderSummary();

  const meanSpendingScoreByAgeAndGender = async () => {
    try {
      const data = await getMeanSpendingScoreByAgeAndGender();
      socket.emit("meanSpendingScoreByAgeAndGender", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  meanSpendingScoreByAgeAndGender();

  const summaryStatistics = async () => {
    try {
      const data = await getSummaryStatistics();
      socket.emit("summaryStatistics", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  summaryStatistics();

  const meanAnnualIncomeByProfession = async () => {
    try {
      const data = await getMeanAnnualIncomeByProfession();
      socket.emit("meanAnnualIncomeByProfession", { success: true, data });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  meanAnnualIncomeByProfession();

  const changeStream = customer.watch();
  changeStream.on("change", () => {
    genderSummary();
    professionByGenderSummary();
    meanSpendingScoreByAgeAndGender();
    meanAnnualIncomeByProfession();
    summaryStatistics();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
