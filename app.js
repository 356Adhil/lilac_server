const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
// config env
config();

const app = express();

// Enable CORS
app.use(cors());

// route files
const countries = require("./routes/countries");

// mount routers
app.use("/countries", countries);

const PORT = process.env.PORT || 8040;
app.listen(PORT, console.log(`port is running ${PORT}`));
