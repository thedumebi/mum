require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./models");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const categoryRoutes = require("./routes/category.routes");
const uploadRoute = require("./routes/upload.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoute);

//Make uploads folder static
app.use("/backend/uploads", express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "..", "/frontend/build")));

  app.get("/", (req, res) => {
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
    console.error(err);
  });
