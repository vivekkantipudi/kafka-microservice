const request = require('supertest');
const app = require('../src/app');
const store = require('../src/services/store');

// Mock Kafka Producer to avoid needing real Kafka for unit tests
jest.mock('../src/services/producer', () => ({
  connectProducer: jest.fn(),
  publishEvent: jest.fn(() => Promise.resolve(true)),
}));

// Mock Kafka Consumer
jest.mock('../src/services/consumer', () => ({
  connectConsumer: jest.fn(),
}));

describe('Event API', () => {
  beforeEach(() => {
    store.clearStore();
  });

  it('POST /events/generate - should create an event', async () => {
    const res = await request(app)
      .post('/events/generate')
      .send({
        userId: 'user-123',
        eventType: 'LOGIN',
        payload: { browser: 'chrome' }
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('eventId');
  });

  it('GET /events/processed - should return processed events', async () => {
    // Manually add event to store to simulate consumption
    store.addEvent({
      eventId: 'test-id-1',
      userId: 'user-1',
      eventType: 'LOGIN',
      timestamp: new Date().toISOString()
    });

    const res = await request(app).get('/events/processed');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].eventId).toBe('test-id-1');
  });
});