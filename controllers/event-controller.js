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

function getEvents(req, res) {
  const { UserId } = req.params;
  Event.find({ UserId }).then((data) => {
    if (data.length == 0) {
      return res
        .status(400)
        .json({ success: false, error: `No events found for user.` });
    }
    const { id } = JWT.verify(req.header("x-auth-token"), process.env.SECRET);

    if (UserId != id) {
      return res
        .status(400)
        .json({ success: false, error: `Not authorised to view user events` });
    }

    return res.status(200).json({ success: true, data: data });
  });
}

function getPostedEvents(req, res) {
  Event.find({ posted: true })
    .then((data) => {
      if (data.length == 0) {
        return res
          .status(400)
          .json({ success: false, error: `No posted events found` });
      }
      return res.status(200).json({ success: true, data: data });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
}

function getUpcomingEvents(req, res) {
  Event.find({ ticketSales: false })
    .then((data) => {
      if (data.length == 0) {
        return res
          .status(400)
          .json({ success: false, error: `No upcoming events found` });
      }
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
    posted,
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
      posted,
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
  const { name, description, eventDate, location, totalTickets, posted } =
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
      if (posted) {
        updates["posted"] = posted;
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
  const { name, description, eventDate, location, totalTickets, posted } =
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
      if (posted) {
        updates["posted"] = posted;
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
  getEvents,
  getPostedEvents,
  getUpcomingEvents,
  createEvent,
  organiserUpdateEvent,
  adminUpdateEvent,
  organiserDeleteEvent,
  adminDeleteEvent,
};
