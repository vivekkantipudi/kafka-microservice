const kafka = require('../config/kafka');

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka Producer connected');
  } catch (error) {
    console.error('Producer connection error:', error);
  }
};

const publishEvent = async (event) => {
  try {
    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'user-activity-events',
      messages: [
        { value: JSON.stringify(event) }
      ],
    });
    return true;
  } catch (error) {
    console.error('Error publishing event:', error);
    throw error;
  }
};

module.exports = { connectProducer, publishEvent };