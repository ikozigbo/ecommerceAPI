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
const blogRouter = require("./routes/blogRoutes");
const prodcategoryRouter = require("./routes/productCategoryRoutes");
const blogcategoryRouter = require("./routes/blogCatRoutes");
const brandRouter = require("./routes/brandRoutes");
const enqRouter = require("./routes/enqRoutes");
const colorRouter = require("./routes/colorRoutes");
const couponRouter = require("./routes/couponRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
const PORT = process.env.Port || 4041;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/prodcategory", prodcategoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enqRouter);
//error handlers
app.use(notFound);
app.use(errorHandler);

//listen
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
