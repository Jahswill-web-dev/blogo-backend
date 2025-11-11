// swagger-autogen.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "BlogO API",
    description: "Auto-generated API documentation for the BlogO backend.",
    version: "1.0.0",
  },
  host: "localhost:4000", // 👈 your local backend port
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.ts"]; // 👈 your main Express entry

const swaggerAutogenInstance = swaggerAutogen({ openapi: "3.0.0" });
swaggerAutogenInstance(outputFile, endpointsFiles, doc);
