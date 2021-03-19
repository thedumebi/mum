require("dotenv").config();
const express = require("express");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const db = require("./models");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("database connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
