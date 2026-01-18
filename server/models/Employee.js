const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  salary: Number,
  joinDate: Date,
  performanceScore: Number,
  email: String,
  position: String,
});
module.exports = mongoose.model("Employee", employeeSchema);
