# Backend Donation Verification API

## Setup

1. Install dependencies:
   ```bash
   npm install express axios cors dotenv
   ```

2. Create a `.env` file in the `backend/` directory with your Flutterwave secret key:
   ```env
   FLW_SECRET_KEY=YOUR_FLUTTERWAVE_SECRET_KEY
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

The server will run on port 5000 by default.

## API Endpoint

- **POST** `/api/verify-payment`
  - Body: `{ transaction_id, tx_ref, amount, currency, email, name, country, state, address, donationType }`
  - Returns: `{ verified: true }` if payment is verified, otherwise `{ verified: false, error: ... }` 