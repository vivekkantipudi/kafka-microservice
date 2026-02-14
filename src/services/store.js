// A simple in-memory store
const processedEvents = [];
const eventIds = new Set(); // For O(1) idempotency checks

const addEvent = (event) => {
  if (eventIds.has(event.eventId)) {
    return false; // Duplicate detected
  }
  processedEvents.push(event);
  eventIds.add(event.eventId);
  return true;
};

const getEvents = () => processedEvents;

// Utility to clear store for testing
const clearStore = () => {
    processedEvents.length = 0;
    eventIds.clear();
}

module.exports = { addEvent, getEvents, clearStore };