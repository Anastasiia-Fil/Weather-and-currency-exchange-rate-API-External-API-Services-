require('dotenv').config();

const express = require('express');

const app = express();
const PORT = 3000;

// Check if keys are loaded
console.log('WEATHER KEY:', process.env.WEATHER_API_KEY ? 'loaded' : 'missing');
console.log('CURRENCY KEY:', process.env.CURRENCY_API_KEY ? 'loaded' : 'missing');

// Serve files from public folder
app.use(express.static('public'));

// Simple server-side cache
let cachedWeather = [];
let cachedQuotation = [];
const cacheTime = 5 * 60 * 1000; // 5 minutes

// ---------------- WEATHER ROUTE ----------------
app.get('/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Calgary';
    const apiKey = process.env.WEATHER_API_KEY;

    let indexCache = cachedWeather.findIndex(
      item => item.city === city && Date.now() - item.dateTime <= cacheTime
    );

    if (indexCache >= 0) {
      return res.json(cachedWeather[indexCache].data);
    }

    const url = `${process.env.WEATHER_API_BASEURL}/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    console.log('Weather URL:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Weather status:', response.status);
    console.log('Weather result:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch weather data');
    }

    indexCache = cachedWeather.findIndex(item => item.city === city);

    if (indexCache < 0) {
      cachedWeather.push({
        city: city,
        data: data,
        dateTime: Date.now()
      });
    } else {
      cachedWeather[indexCache].data = data;
      cachedWeather[indexCache].dateTime = Date.now();
    }

    res.json(data);
  } catch (err) {
    console.error('Weather error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CURRENCY ROUTE ----------------
app.get('/currency', async (req, res) => {
  try {
    const from = req.query.from || 'CAD';
    const to = req.query.to || 'USD';
    const apiKey = process.env.CURRENCY_API_KEY;

    let indexCache = cachedQuotation.findIndex(
      item =>
        item.from === from &&
        item.to === to &&
        Date.now() - item.dateTime <= cacheTime
    );

    if (indexCache >= 0) {
      return res.json(cachedQuotation[indexCache].data);
    }

    const url = `${process.env.CURRENCY_API_BASEURL}/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`;

    console.log('Currency URL:', url);

    const response = await fetch(url);
    const result = await response.json();

    console.log('Currency status:', response.status);
    console.log('Currency result:', result);

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error?.message ||
        'Failed to fetch currency data'
      );
    }

    const rateValue = result.data?.[to]?.value;

    if (!rateValue) {
      throw new Error('Currency rate not found');
    }

    const data = {
      [to]: rateValue
    };

    indexCache = cachedQuotation.findIndex(
      item => item.from === from && item.to === to
    );

    if (indexCache < 0) {
      cachedQuotation.push({
        from: from,
        to: to,
        data: data,
        dateTime: Date.now()
      });
    } else {
      cachedQuotation[indexCache].data = data;
      cachedQuotation[indexCache].dateTime = Date.now();
    }

    res.json(data);
  } catch (err) {
    console.error('Currency error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});