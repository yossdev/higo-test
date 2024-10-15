// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express API Documentation",
      version: "1.0.0",
      description: "API Documentation for Express App",
      contact: {
        name: "Developer",
        email: "developer@example.com",
      },
    },
    servers: [
      {
        url: process.env.EXPRESS_URI,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/v1/*.js"], // Path to the API routes
};

module.exports = swaggerOptions;
