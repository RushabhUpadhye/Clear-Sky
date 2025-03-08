const express = require('express');
const axios = require('axios');
const path = require('path');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'E.env') }); 

const app = express();
const port = process.env.PORT || 3000;

// Configure Handlebars
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.error('WEATHER_API_KEY is missing. Please check your E.env file.');
  process.exit(1); // Exit if API key is not available
}

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Weather API route
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city || city.trim() === '') {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const weatherResponse = await axios.get(url);

    if (weatherResponse.status === 200) {
      const currentWeather = weatherResponse.data;
      res.json({ currentWeather });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data. Please try again.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
