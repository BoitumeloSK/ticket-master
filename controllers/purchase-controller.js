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
    const { id } = JWT.verify(token, process.env.SECRET);

    if (data.UserId == id) {
      return res.status(400).json({
        success: false,
        error: "You cannot purchase tickets as the event poster",
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

// function updatePurchase(req, res) {
//   const { id } = req.params;
//   const { tickets } = req.body;
//   Purchase.findById(id).then((data) => {
//     if (data.length == 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Purchase with id ${id} does not exist`,
//       });
//     }

//     let ticketDiff = data.tickets - tickets;

//     Event.findById(data.EventId).then((data) => {
//       let updateTickets = data.totalTickets + ticketDiff;

//       Event.findByIdAndUpdate(data.EventId, {
//         $set: { totalTickets: updateTickets },
//       }).then((data) => {
//         Purchase.findByIdAndUpdate(id, tickets)
//           .then((data) => {
//             return res.status(200).json({ success: true, data });
//           })
//           .catch((error) => {
//             return res.status(400).json({ success: false, error });
//           });
//       });
//     });
//   });
// }

function userCancelPurchase(req, res) {
  const { id } = req.params;
  Purchase.findById(id).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Purchase with id ${id} does not exist`,
      });
    }
    const { id } = JWT.verify(req.header("x-auth-token"), process.env.SECRET);

    if (data.UserId != id) {
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

function adminCancelPurchase(req, res) {
  const { id } = req.params;
  Purchase.findById(id).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Purchase with id ${id} does not exist`,
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
  createPurchase,
  userCancelPurchase,
  adminCancelPurchase,
};
