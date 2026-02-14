const kafka = require('../config/kafka');
const store = require('./store');

const consumer = kafka.consumer({ 
    groupId: process.env.KAFKA_GROUP_ID || 'user-activity-consumer-group' 
});

const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected');

    await consumer.subscribe({ 
        topic: process.env.KAFKA_TOPIC || 'user-activity-events', 
        fromBeginning: true 
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
            const eventData = JSON.parse(message.value.toString());
            
            // IDEMPOTENCY CHECK
            const isNew = store.addEvent(eventData);

            if (isNew) {
                // Log required details to stdout
                console.log(`[CONSUMER] Processed: ID=${eventData.eventId}, User=${eventData.userId}, Type=${eventData.eventType}`);
            } else {
                console.log(`[CONSUMER] Skipped Duplicate: ID=${eventData.eventId}`);
            }
        } catch (err) {
            console.error('❌ Error processing message:', err);
            // In a real app, you might send this to a Dead Letter Queue (DLQ)
        }
      },
    });
  } catch (error) {
    console.error('❌ Consumer connection error:', error);
  }
};

module.exports = { connectConsumer };