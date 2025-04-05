const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let slidingWindow = [];

const API_URLS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const apiUrl = API_URLS[numberid];

  if (!apiUrl) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const windowPrevState = [...slidingWindow];
  let fetchedNumbers = [];

  try {
    const response = await axios.get(apiUrl, {
      timeout: 500, // reject slow responses
      headers: {
        Authorization: process.env.TOKEN
      }
    });

    fetchedNumbers = response.data.numbers || [];

    // Add unique numbers to the window
    for (let num of fetchedNumbers) {
      if (!slidingWindow.includes(num)) {
        slidingWindow.push(num);
        if (slidingWindow.length > WINDOW_SIZE) {
          slidingWindow.shift(); // Remove oldest
        }
      }
    }
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    // Proceed with current window state even if fetch fails
  }

  const avg =
    slidingWindow.length > 0
      ? (
          slidingWindow.reduce((sum, val) => sum + val, 0) /
          slidingWindow.length
        ).toFixed(2)
      : 0;

  return res.json({
    windowPrevState,
    windowCurrState: slidingWindow,
    numbers: fetchedNumbers,
    avg: parseFloat(avg)
  });
});

app.listen(PORT, () => {
  console.log(`✅ Average Calculator Microservice running on http://localhost:${PORT}`);
});
