const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Replace with your actual Flutterwave secret key
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || 'YOUR_FLUTTERWAVE_SECRET_KEY';

app.use(cors());
app.use(express.json());

// POST /api/verify-payment
app.post('/api/verify-payment', async (req, res) => {
  const { transaction_id, tx_ref, amount, currency, email, name, country, state, address, donationType } = req.body;
  if (!transaction_id) {
    return res.status(400).json({ verified: false, error: 'Missing transaction_id' });
  }
  try {
    // Verify payment with Flutterwave
    const flwRes = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`
      }
    });
    const data = flwRes.data;
    if (
      data.status === 'success' &&
      data.data &&
      data.data.status === 'successful' &&
      data.data.amount == amount &&
      data.data.currency === currency &&
      data.data.tx_ref === tx_ref
    ) {
      // Store donation record
      const donation = {
        transaction_id,
        tx_ref,
        amount,
        currency,
        email,
        name,
        country,
        state,
        address,
        donationType,
        verified: true,
        date: new Date().toISOString()
      };
      const file = 'backend/donations.json';
      let donations = [];
      if (fs.existsSync(file)) {
        donations = JSON.parse(fs.readFileSync(file));
      }
      donations.push(donation);
      fs.writeFileSync(file, JSON.stringify(donations, null, 2));
      return res.json({ verified: true });
    } else {
      return res.status(400).json({ verified: false, error: 'Payment not verified' });
    }
  } catch (err) {
    return res.status(500).json({ verified: false, error: 'Verification failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 