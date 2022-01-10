const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/cartegoryRoutes");
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require("./src/routes/orderRouter");
const brandRoutes = require("./src/routes/brandRoutes");
const importRoutes = require("./src/routes/importRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const productTypeRoutes = require("./src/routes/productTypeRoutes");
const authorize = require("./src/common/authorization/authorization-middleware");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;

var conn = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const swaggerOptions = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "API God",
      description: "Chúa tể API <p>Role Admin: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTUsIm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJhZG1pbm5AZ21haWwuY29tIiwicGhvbmUiOiIwMzIzNTU0MzQzIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjM4NDI5OTQyfQ.YfsjDeoPKvhY2GEoTOql6L_RHtQywVK5MB2MOjPfhRY</p>",
      version: "1.0.0",
      termsOfService: "",
      contact: {
        name: "Hoang Viet Thai",
        email: "vietthai2099@gmail.com",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0",
      },
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    basePath: "/api",
    securityDefinitions: {
      Bearer: { type: "apiKey", name: "Authorization", in: "header" },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/image", express.static("src/image"));

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  req.conn = conn;
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/order", authorize(), orderRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/import", importRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/productType", productTypeRoutes);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

module.exports = app;
