//create express
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
require("dotenv").config();

//setup routes
const bookRoutes = require("./routes/books");

const app = express();
//middleware logic to parse json
app.use(express.json());
app.use(morgan("dev"));

app.use("/books", bookRoutes);

//connecting mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is successfully connected "))
  .catch((err) => console.log("DB, ERROR", err));

//setup server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * first is to write server.js and declare express and setup server
 * then next step is to declaring all necessary requirements for this project routes and middlewares
 * then now we have to write code logic for respective folders
 */
