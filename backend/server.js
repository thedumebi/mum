require("dotenv").config();
const path = require("path");
const db = require("./models");
const express = require("express");
const faqRoutes = require("./routes/faq.routes");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const salesRoutes = require("./routes/sales.routes");
const uploadRoute = require("./routes/upload.routes");
const carouselRoutes = require("./routes/carousel.routes");
const categoryRoutes = require("./routes/category.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/faqs", faqRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/carousel", carouselRoutes);
app.use("/api/categories", categoryRoutes);

//Make uploads folder static
app.use("/backend/uploads", express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "..", "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/frontend/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running ...");
  });
}

// middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
db.sequelize
  .sync()
  .then(() => {
    console.log("database connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error({ err });
  });
