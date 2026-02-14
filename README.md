# Kafka Event-Driven Microservice

A foundational microservice demonstrating Event-Driven Architecture using Node.js, Express, and Apache Kafka.

This project implements a complete Producer-Consumer pattern where events are generated via a REST API, published to a Kafka topic, and processed asynchronously with idempotency to prevent duplicates. It includes a frontend dashboard for real-time interaction.
## Features

- **Event Producer:** REST API (`POST /events/generate`) accepts user activities and publishes them to Kafka.

- **Event Consumer:** Subscribes to the Kafka topic, processes events, and ensures data integrity.

- **Idempotency:** Prevents duplicate processing of the same event ID using an O(1) in-memory lookup.

- **Real-Time Dashboard:** A clean HTML/JS frontend to generate events and view the processed list live.

- **Dockerized:** Fully containerized environment including Zookeeper, Kafka, and the Node.js service.

- **Resiliency:** Robust error handling and retry logic for Kafka connections.
## Architecture

- **API Layer:** Express.js server handling HTTP requests.

- **Message Broker:** Apache Kafka (orchestrated via Docker Compose).

- **Consumer Service:** Independent component that reads from `user-activity-events`.

- **Data Persistence:** In-memory storage (simulating a database) for demonstration.
## Prerequisites

- **Docker & Docker Compose** (Essential)

- **Node.js (v18+)** (Optional, for local development only)
## Getting Started

### 1. Clone & Run with Docker (Recommended)

This command sets up Zookeeper, Kafka, and the Microservice automatically.

```bash
# Start all services
docker-compose up --build
```
> **Note:** Wait for the logs to show " Kafka Consumer connected" before testing. The app handles Kafka startup delays automatically.
### 2. Access the Dashboard

Once running, open your browser to:  
 http://localhost:3000  

From here, you can:

- **Generate Events:** Click the green button to send data to the Producer.

- **View Results:** Click "Refresh List" to see data processed by the Consumer.
### 3. Run Tests

The project includes unit tests using Jest.

```bash
npm install
npm test
```
## API Endpoints

### 1. Generate Event (Producer)

**POST** `/events/generate`

Produces a new event to the Kafka topic.

**Body:**

```json
{
  "userId": "user_123",
  "eventType": "LOGIN",
  "payload": { "location": "US", "device": "mobile" }
}
```
**Response (201 Created):**

```json
{
  "message": "Event published successfully",
  "eventId": "a1b2c3d4-e5f6-..."
}
```
### 2. Get Processed Events (Consumer)

**GET** `/events/processed`

Returns the list of events that have been successfully consumed and stored.

**Response (200 OK):**

```json
[
  {
    "eventId": "a1b2c3d4-e5f6-...",
    "userId": "user_123",
    "eventType": "LOGIN",
    "timestamp": "2026-02-14T10:00:00.000Z",
    "payload": { "location": "US", "device": "mobile" }
  }
]
```
## Design Decisions

- **Separation of Concerns:** The project structure cleanly separates producers, consumers, and routes, simulating a scalable microservice pattern.

- **Idempotency:** Implemented using a `Set` data structure to track processed `eventIds`. This ensures that even if Kafka redelivers a message (at-least-once delivery), the system processes it exactly once.

- **Docker Health Checks:** The `docker-compose.yml` includes specific health checks for Zookeeper and Kafka to ensure the Node.js application only attempts to connect once the infrastructure is healthy.

- **Frontend Integration:** Added a static frontend (`src/public`) served by Express to provide a visual proof of the event lifecycle without needing external tools like Postman.

## Project Structure
```
kafka-microservice/
├── src/
│ ├── config/ # Kafka client configuration
│ ├── controllers/ # API Request handlers
│ ├── public/ # Frontend Dashboard (HTML/JS)
│ ├── routes/ # Express routes
│ ├── services/ # Producer, Consumer, and Store logic
│ └── app.js # Entry point
├── tests/ # Jest Unit Tests
├── docker-compose.yml # Docker orchestration
├── Dockerfile # App container definition
└── package.json # Dependencies
```

##  Author

**K Vivek Vardhan**

GitHub: https://github.com/vivekkantipudi/kafka-microservice

