require("dotenv").config();
const express = require("express");
const app = express();
const { connectDatabase } = require("./src/config/database");
connectDatabase();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const router = require('./src/routers/router');
app.use("/", router);

app.listen(process.env.PORT, () => {
    console.log(`------connecting port: ${process.env.PORT}`);
});