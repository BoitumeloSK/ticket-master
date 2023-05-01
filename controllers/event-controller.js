const Event = require("../models/event");
const JWT = require("jsonwebtoken");
require("dotenv").config();

function getAllEvents(req, res) {
  Event.find()
    .then((data) => {
      return res.status(200).json({ success: true, data: data });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
}

function createEvent(req, res) {
  const {
    name,
    description,
    eventDate,
    location,
    totalTickets,
    ticketPrice,
    published,
  } = req.body;
  const token = req.header("x-auth-token");
  const { id } = JWT.verify(token, process.env.SECRET);
  let ticketSales = false;

  Event.find({ name, eventDate, location }).then((data) => {
    if (data.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Event already created" });
    }

    eventDate == "TBA" || location == "TBA"
      ? ticketSales
      : (ticketSales = true);

    Event.create({
      UserId: id,
      name,
      description,
      eventDate,
      location,
      totalTickets,
      ticketPrice,
      published,
      ticketSales,
    })
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

function organiserUpdateEvent(req, res) {
  const { eventId } = req.params;
  const { name, description, eventDate, location, totalTickets, published } =
    req.body;
  const updates = {};

  Event.findById(eventId).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Event with id ${eventId} does not exist.`,
      });
    } else {
      const token = req.header("x-auth-token");
      const { id } = JWT.verify(token, process.env.SECRET);

      if (data.UserId != id) {
        return res.status(400).json({
          success: false,
          error: "User not authorised to make changes to event",
        });
      }

      if (name) {
        updates["name"] = name;
      }
      if (description) {
        updates["description"] = description;
      }
      if (eventDate) {
        updates["eventDate"] = eventDate;
      }
      if (location) {
        updates["location"] = location;
      }
      if (totalTickets) {
        updates["totalTickets"] = totalTickets;
      }
      if (published) {
        updates["published"] = published;
      }

      let ticketSales = data.ticketSales;

      if (Object.keys(updates).includes("location" || "eventDate")) {
        updates["location"] == "TBA" || updates["eventDate"] == "TBA"
          ? (ticketSales = false)
          : (ticketSales = true);
      }
      updates["ticketSales"] = ticketSales;

      Event.findByIdAndUpdate(eventId, { $set: updates })
        .then((data) => {
          return res.status(200).json({ success: true, data: data });
        })
        .catch((error) => {
          return res.status(400).json({ success: false, error: error });
        });
    }
  });
}

function adminUpdateEvent(req, res) {
  const { eventId } = req.params;
  const { name, description, eventDate, location, totalTickets, published } =
    req.body;
  const updates = {};

  Event.findById(eventId).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Event with id ${eventId} does not exist.`,
      });
    } else {
      if (name) {
        updates["name"] = name;
      }
      if (description) {
        updates["description"] = description;
      }
      if (eventDate) {
        updates["eventDate"] = eventDate;
      }
      if (location) {
        updates["location"] = location;
      }
      if (totalTickets) {
        updates["totalTickets"] = totalTickets;
      }
      if (published) {
        updates["published"] = published;
      }

      let ticketSales = data.ticketSales;

      if (Object.keys(updates).includes("location" || "eventDate")) {
        updates["location"] == "TBA" || updates["eventDate"] == "TBA"
          ? (ticketSales = false)
          : (ticketSales = true);
      }
      updates["ticketSales"] = ticketSales;

      Event.findByIdAndUpdate(eventId, { $set: updates })
        .then((data) => {
          return res.status(200).json({ success: true, data: data });
        })
        .catch((error) => {
          return res.status(400).json({ success: false, error: error });
        });
    }
  });
}

function organiserDeleteEvent(req, res) {
  const { eventId } = req.params;
  Event.findById(eventId).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Event with id ${eventId} does not exist.`,
      });
    }
    const token = req.header("x-auth-token");
    const { id } = JWT.verify(token, process.env.SECRET);

    if (data.UserId != id) {
      return res.status(400).json({
        success: false,
        error: "User not authorised to make changes to event",
      });
    }

    Event.findByIdAndUpdate(eventId)
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

function adminDeleteEvent(req, res) {
  const { eventId } = req.params;
  Event.findById(eventId).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `Event with id ${eventId} does not exist.`,
      });
    }

    Event.findByIdAndUpdate(eventId)
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

module.exports = {
  getAllEvents,
  createEvent,
  organiserUpdateEvent,
  adminUpdateEvent,
  organiserDeleteEvent,
  adminDeleteEvent,
};
