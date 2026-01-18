const express = require("express");
require("dotenv").config();
const connect = require("./services/mongoConnect");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

connect();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
