const express = require("express");
const axios = require("axios");
const { updateWindow } = require("./windowManager");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numberWindow = [];

const idMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  const apiType = idMap[numberid];

  if (!apiType) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const prevWindow = [...numberWindow];
  const url = `http://20.244.56.144/evaluation-service/${apiType}`;

  let numbers = [];

  try {
    const response = await axios.get(url, { timeout: 500 });
    numbers = response.data.numbers || [];
  } catch (error) {
    console.warn("Error fetching numbers or timeout");
  }

  numberWindow = updateWindow(numberWindow, numbers, WINDOW_SIZE);

  const avg =
    numberWindow.length > 0
      ? parseFloat(
          (numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2)
        )
      : 0;

  res.json({
    windowPrevState: prevWindow,
    windowCurrState: numberWindow,
    numbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
