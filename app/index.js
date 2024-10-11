const express = require("express");
const app = express();
const ContactRoutes = require("./routes/ContactRoutes");

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.status(200).json({
    message: "test"
  })
})
app.use("/contacts", ContactRoutes);

module.exports = app;