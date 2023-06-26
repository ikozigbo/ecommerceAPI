const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
require("./configs/dbconnect");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
const PORT = process.env.Port || 4041;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
