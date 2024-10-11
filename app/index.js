const express = require("express");
const app = express();
const ContactRoutes = require("./routes/ContactRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/v1/contacts", ContactRoutes);

module.exports = app;