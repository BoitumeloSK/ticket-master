const Purchase = require("../models/purchase");
const Event = require("../models/event");
const JWT = require("jsonwebtoken");
require("dotenv").config();

function getAllPurchases(req, res) {
  Purchase.find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error });
    });
}

function getPurchases(req, res) {
  const { id } = req.params;
  Purchase.find({ id }).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `No purchases found for user.`,
      });
    }
    const { userId } = JWT.verify(
      req.header("x-auth-token"),
      process.env.SECRET
    );

    if (userId != id) {
      return res.status(400).json({
        success: false,
        error: `Not authorised to view user purchases`,
      });
    }

    return res.status(200).json({ success: true, data: data });
  });
}

function createPurchase(req, res) {
  const { EventId, tickets } = req.body;

  Event.findById(EventId).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Event with id ${EventId} does not exist`,
      });
    }
    const token = req.header("x-auth-token");
    const { userId } = JWT.verify(token, process.env.SECRET);

    if (data.UserId == userId) {
      return res.status(400).json({
        success: false,
        error: "You cannot purchase tickets as the event poster",
      });
    }

    if (data.posted == false || data.ticketSales == false) {
      return res.status(200).json({
        success: false,
        error: `Tickets not up for sale yet for this event`,
      });
    }

    let totalCost = tickets * data.ticketPrice;
    let ticketCount = data.totalTickets - tickets;

    Event.findByIdAndUpdate(EventId, {
      $set: { totalTickets: ticketCount },
    }).then((data) => {
      Purchase.create({ UserId: id, EventId, tickets, totalCost })
        .then((data) => {
          return res.status(200).json({ success: true, data });
        })
        .catch((error) => {
          return res.status(400).json({ success: false, error });
        });
    });
  });
}

function cancelPurchase(req, res) {
  const { id } = req.params;
  let deletePurchase = false;
  Purchase.findById(id).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Purchase with id ${id} does not exist`,
      });
    }
    const { userId, role } = JWT.verify(
      req.header("x-auth-token"),
      process.env.SECRET
    );

    if (data.UserId == userId) {
      deletePurchase = true;
    } else {
      if (role == "admin") {
        deletePurchase = true;
      }
    }

    if (!deletePurchase) {
      return res.status(400).json({
        success: false,
        error: "User not authorised to delete purchase",
      });
    }

    let returnedTickets = data.tickets;

    Event.findById(data.EventId).then((data) => {
      let updateTickets = data.totalTickets + returnedTickets;
      Event.findByIdAndUpdate(data._id, {
        $set: { totalTickets: updateTickets },
      }).then((data) => {
        Purchase.findByIdAndDelete(id)
          .then((data) => {
            return res.status(200).json({ success: true, data: data });
          })
          .catch((error) => {
            return res.status(400).json({ success: false, error: error });
          });
      });
    });
  });
}

module.exports = {
  getAllPurchases,
  getPurchases,
  createPurchase,
  cancelPurchase,
};
