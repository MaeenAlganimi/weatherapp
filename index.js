require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5';

app.get('/', (req, res) => {
  res.render('index', { weather: null, forecast: null, error: null });
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  try {
    const weatherRes = await axios.get(`${WEATHER_URL}/weather`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    const forecastRes = await axios.get(`${WEATHER_URL}/forecast`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    res.render('index', {
      weather: weatherRes.data,
      forecast: forecastRes.data,
      error: null,
    });
  } catch (error) {
    let errorMsg = 'City not found or API error.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    res.render('index', {
      weather: null,
      forecast: null,
      error: errorMsg,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
