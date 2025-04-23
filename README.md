# Splash Adventure Waterpark - Server

This is the backend server for the Splash Adventure Waterpark application. It provides RESTful API endpoints for managing waterpark operations including rides, food orders, bookings, and payments.

## Features

- User authentication and authorization
- Ride management and information
- Food ordering system
- Booking management
- Payment processing with Stripe
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payment processing)

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables in `.env`
5. Start the server:
   ```bash
   npm run server
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides` - Create new ride (admin only)
- `PUT /api/rides/:id` - Update ride (admin only)
- `DELETE /api/rides/:id` - Delete ride (admin only)

### Food
- `GET /api/food` - Get all food items
- `GET /api/food/:id` - Get food item details
- `POST /api/food` - Create new food item (admin only)
- `PUT /api/food/:id` - Update food item (admin only)
- `DELETE /api/food/:id` - Delete food item (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

## Development

- Run server in development mode:
  ```bash
  npm run server
  ```

- Run both client and server concurrently:
  ```bash
  npm run dev:full
  ```

- Seed the database with sample data:
  ```bash
  npm run seed
  ```

## Error Handling

The server includes comprehensive error handling middleware that:
- Logs errors to the console
- Returns appropriate HTTP status codes
- Provides detailed error messages in development
- Returns sanitized error messages in production

## Security

- JWT authentication for protected routes
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.