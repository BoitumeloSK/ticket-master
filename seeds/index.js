const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const Event = require("../models/event.js");
const Purchase = require("../models/purchase.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ticket-masterDB");

async function seedData() {
  const password = await bcrypt.hash("test123", 10);
  User.insertMany([
    {
      name: "John Doe",
      email: "user@email.com",
      password: password,
      role: "user",
    },
    {
      name: "Jane Ross",
      email: "admin@email.com",
      password: password,
      role: "admin",
    },
    {
      name: "Thando Sithole",
      email: "organiser1@email.com",
      password: password,
      role: "organiser",
    },
    {
      name: "Lerato Shezi",
      email: "organiser2@email.com",
      password: password,
      role: "organiser",
    },
  ]).then((data) => {
    Event.insertMany([
      {
        UserId: data[2]._id,
        name: "Kunye",
        description: "An outdoor music festival for hosue lovers",
        eventDate: "2023-06-12 12pm-11pm",
        location: "Moses Mabhida Stadium, Durban",
        totalTickets: 15,
        ticketPrice: 30000,
        posted: true,
        ticketSales: true,
      },
      {
        UserId: data[3]._id,
        name: "Buddy Hikes",
        description:
          "A 2 mountain a weekend hiking experience up Lion's Head and Chapman's peak.Drinks and snacks will be provided.",
        eventDate: "TBA",
        location: "Meeting at The Labia, Cape Town",
        totalTickets: 5,
        ticketPrice: 10000,
        posted: true,
        ticketSales: true,
      },
      {
        UserId: data[2]._id,
        name: "Slowed Cooked Sundays",
        description: "A indoor good music, good food, and good people vibe.",
        eventDate: "TBA",
        location: "TBA",
        totalTickets: 10,
        ticketPrice: 15000,
        posted: false,
        ticketSales: false,
      },
    ])
      .then((data2) => {
        Purchase.insertMany([
          {
            UserId: data[0]._id,
            EventId: data2[0]._id,
            tickets: 2,
            totalCost: 60000,
          },
          {
            UserId: data[3]._id,
            EventId: data2[0]._id,
            tickets: 1,
            totalCost: 30000,
          },
        ]);
      })
      .then((data3) => {
        console.log("Database seeded");
      });
  });
}

seedData();
