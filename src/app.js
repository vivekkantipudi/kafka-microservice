require('dotenv').config();
const express = require('express');
const path = require('path'); // <--- 1. ADDED THIS IMPORT
const eventRoutes = require('./routes/eventRoutes');
const { connectProducer } = require('./services/producer');
const { connectConsumer } = require('./services/consumer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (Frontend)
// This tells Express to look in the "src/public" folder for index.html
app.use(express.static(path.join(__dirname, 'public'))); // <--- 2. ADDED THIS LINE

// Routes
app.use('/events', eventRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start Server and Kafka Services
const startServer = async () => {
    await connectProducer();
    await connectConsumer();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

if (require.main === module) {
    startServer();
}

module.exports = app; // Export for testing