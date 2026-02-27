# 🛒 E-Commerce Microservices API

A production-ready, API-driven e-commerce backend built with a microservices architecture. Services communicate via REST (synchronous) and RabbitMQ (asynchronous), all containerized with Docker.

---

## 📐 Architecture Overview

```
Customer ──REST──▶ Order Service ──REST──▶ Payment Service
                       │                        │
                    MongoDB                 RabbitMQ Queue
                                                │
                                         Transaction Worker
                                                │
                                            MongoDB
```

### Services

| Service      | Port   | Responsibility                                               |
| ------------ | ------ | ------------------------------------------------------------ |
| **Customer** | `8000` | Entry point — manages customers, proxies product/order calls |
| **Product**  | `8003` | Manages product catalog                                      |
| **Order**    | `8001` | Creates and tracks orders                                    |
| **Payment**  | `8002` | Processes payments, publishes to RabbitMQ                    |

### Flow

1. A customer places an order → `POST /api/v1/order` on the **Customer service**
2. Customer service validates the customer and fetches product details from the **Product service** (REST)
3. A request is forwarded to the **Order service**, which persists the order (`status: pending`) and calls the **Payment service** (REST)
4. The **Payment service** saves the payment record and publishes transaction details to a RabbitMQ queue
5. A background **Transaction Worker** consumes the queue and saves the transaction history to MongoDB
6. The full response (order + payment) is returned to the caller

---

## 🧰 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Messaging**: RabbitMQ (via `amqplib`)
- **HTTP Client**: Axios
- **Containerization**: Docker + Docker Compose
- **Documentation**: Swagger / OpenAPI 3.0
- **Testing**: Jest + ts-jest
- **Seeding**: migrate-mongo + Faker.js

---

## 📁 Project Structure

```
e-commerce/
├── customer/               # Customer service (port 8000)
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── docs.yaml
│   │   ├── errors/
│   │   ├── helper/
│   │   ├── interface/
│   │   ├── middlewares/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── repository/
│   │   ├── router/
│   │   ├── service/
│   │   └── app.ts
│   └── __tests__/
├── order/                  # Order service (port 8001)
├── payment/                # Payment service (port 8002)
├── product/                # Product service (port 8003)
├── compose.localhost.yml
└── .env
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+
- [RabbitMQ](https://www.rabbitmq.com/) (handled via Docker)
- [MongoDB](https://www.mongodb.com/) (handled via Docker or Atlas)

### Environment Variables

Create a `.env` file at the project root:

```env
# Ports
CUSTOMER_PORT=8000
ORDER_PORT=8001
PAYMENT_PORT=8002
PRODUCT_PORT=8003

# MongoDB
MONGO_URI=mongodb://...

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Service URLs (inter-service communication)
PRODUCT_SERVICE_URL=http://product:8003/api/v1/product
ORDER_SERVICE_URL=http://order:8001/api/v1/order
PAYMENT_SERVICE_URL=http://payment:8002/api/v1/payment

NODE_ENV=development
```

### Run with Docker Compose

```bash
# Build and start all services
docker compose -f compose.localhost.yml up --build

# Run in detached mode
docker compose -f compose.localhost.yml up --build -d

# Stop all services
docker compose -f compose.localhost.yml down
```

### Run a Single Service Locally

```bash
cd customer
npm install
npm run dev
```

---

## 🌱 Database Seeding

Each service seeds its own data on startup via migrations.

- **Customer service** seeds 5 fake customers using Faker.js
- **Product service** seeds 200 fake products with randomized names, prices, and quantities

```bash
# Run migrations (inside a service directory)
npm run migrate:up

# Roll back migrations
npm run migrate:down
```

---

## 📖 API Documentation

The application exposes a single unified Swagger UI powered by OpenAPI 3.0, served from the Customer service — the entry point of the application.

### Accessing the Docs

**Step 1 — Start the services** (if not already running):

```bash
docker compose -f compose.localhost.yml up --build
```

**Step 2 — Visit the docs URL in your browser:**

```
http://localhost:8000/api/v1/docs
```

**Step 3 — Explore and test endpoints directly in the browser.** Swagger UI lets you:

- Browse all available routes grouped by tag (Customer, Product, Order, Payment, Transaction)
- View request/response schemas
- Execute live API calls using the **"Try it out"** button on any endpoint

### Key Endpoints (via Customer Service — port 8000)

#### Customers

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| `GET`  | `/api/v1/customer`     | List all customers    |
| `GET`  | `/api/v1/customer/:id` | Get a single customer |

#### Products

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| `GET`  | `/api/v1/product`     | List all products    |
| `GET`  | `/api/v1/product/:id` | Get a single product |

#### Orders

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| `POST` | `/api/v1/order`         | Create an order                         |
| `POST` | `/api/v1/order/payment` | Pay for an order                        |
| `POST` | `/api/v1/order/fetch`   | Fetch orders by customerId or productId |
| `GET`  | `/api/v1/order/:id`     | Get a single order                      |

#### Payments

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| `POST` | `/api/v1/payment`     | Fetch payments by customerId or productId |
| `GET`  | `/api/v1/payment/:id` | Get a single payment                      |

#### Transactions

| Method | Endpoint                  | Description                                   |
| ------ | ------------------------- | --------------------------------------------- |
| `POST` | `/api/v1/transaction`     | Fetch transactions by customerId or productId |
| `GET`  | `/api/v1/transaction/:id` | Get a single transaction                      |

### Example: Create an Order

**Request**

```http
POST /api/v1/order
Content-Type: application/json

{
  "customerId": "664a1f...",
  "productId": "664b2e...",
  "quantity": 2
}
```

**Response**

```json
{
    "success": true,
    "data": {
        "order": {
            "_id": "...",
            "customerId": "...",
            "productId": "...",
            "amount": 15000,
            "quantity": 2,
            "status": "pending"
        },
        "payment": {
            "_id": "...",
            "status": "pending",
            "amount": 15000
        }
    }
}
```

---

## 🧪 Testing

Tests are located in the `__tests__` directory of the **Customer service** and cover the full request lifecycle, including mocked inter-service HTTP calls.

```bash
cd customer
npm run test

# With coverage
npm run test -- --coverage
```

> Tests use Jest + ts-jest. External services (Product, Order, Payment) are mocked with `jest.mock` or `axios-mock-adapter` to isolate units.

---

## 🐇 RabbitMQ — Message Queue

The **Payment service** publishes transaction data to a durable `transactions` queue. A **Transaction Worker** runs inside the Payment service and consumes messages from this queue, persisting them to MongoDB.

```
Payment Service
  └── publishMessage("transactions", { customerId, orderId, productId, amount, paymentId })
        │
        ▼
  RabbitMQ Queue: "transactions"
        │
        ▼
  Transaction Worker
  └── consumeMessages → TransactionRepository.createTransaction()
```

The queue is durable and messages are persistent, ensuring no data loss on restarts.

---

## 🐳 Docker

Each service has its own `Dockerfile.localhost` for local development with hot-reloading.

```yaml
# compose.localhost.yml (excerpt)
services:
    customer:
        build:
            context: ./customer
            dockerfile: Dockerfile.localhost
        ports:
            - "8000:8000"
        command: ["npm", "run", "dev"]
```

---

## 🔒 Security

- `X-Powered-By` and `Server` headers are stripped and replaced with a generic `secure-server` value
- CORS is permissive in `development` and restricted via `corsOptions` in production
- Trust proxy is enabled for accurate IP resolution behind a reverse proxy

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📬 Contact

**Seun Awonugba** — seunawonugba@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
