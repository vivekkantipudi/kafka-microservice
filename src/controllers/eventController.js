const { v4: uuidv4 } = require('uuid');
const { publishEvent } = require('../services/producer');
const store = require('../services/store');

exports.generateEvent = async (req, res) => {
  const { userId, eventType, payload } = req.body;

  // Basic Validation
  if (!userId || !eventType) {
    return res.status(400).json({ error: 'userId and eventType are required' });
  }

  // Construct UserEvent
  const userEvent = {
    eventId: uuidv4(),
    userId,
    eventType,
    timestamp: new Date().toISOString(),
    payload: payload || {}
  };

  try {
    await publishEvent(userEvent);
    return res.status(201).json({ 
        message: 'Event published successfully', 
        eventId: userEvent.eventId 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to publish event' });
  }
};

exports.getProcessedEvents = (req, res) => {
  const events = store.getEvents();
  res.status(200).json(events);
};