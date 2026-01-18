require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");

const employees = [
  {
    name: "John Doe",
    department: "IT",
    salary: 75000,
    joinDate: new Date("2020-01-15"),
    performanceScore: 8.5,
    email: "john@company.com",
    position: "Developer",
  },
  {
    name: "Jane Smith",
    department: "Sales",
    salary: 65000,
    joinDate: new Date("2019-03-20"),
    performanceScore: 9.2,
    email: "jane@company.com",
    position: "Sales Manager",
  },
  {
    name: "Mike Johnson",
    department: "IT",
    salary: 80000,
    joinDate: new Date("2018-06-10"),
    performanceScore: 9.0,
    email: "mike@company.com",
    position: "Senior Developer",
  },
  {
    name: "Sarah Williams",
    department: "HR",
    salary: 60000,
    joinDate: new Date("2021-02-01"),
    performanceScore: 7.8,
    email: "sarah@company.com",
    position: "HR Manager",
  },
  {
    name: "Tom Brown",
    department: "Sales",
    salary: 70000,
    joinDate: new Date("2020-08-15"),
    performanceScore: 8.8,
    email: "tom@company.com",
    position: "Sales Executive",
  },
  {
    name: "Emily Davis",
    department: "IT",
    salary: 72000,
    joinDate: new Date("2019-11-20"),
    performanceScore: 8.3,
    email: "emily@company.com",
    position: "Developer",
  },
  {
    name: "Robert Wilson",
    department: "Finance",
    salary: 85000,
    joinDate: new Date("2017-05-10"),
    performanceScore: 9.5,
    email: "robert@company.com",
    position: "Finance Manager",
  },
  {
    name: "Lisa Anderson",
    department: "HR",
    salary: 58000,
    joinDate: new Date("2022-01-15"),
    performanceScore: 7.5,
    email: "lisa@company.com",
    position: "HR Executive",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Employee.deleteMany({});
    console.log("Cleared existing employees");

    await Employee.insertMany(employees);
    console.log("Database seeded with", employees.length, "employees");

    mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDB();
