const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-activity-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

module.exports = kafka;