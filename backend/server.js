// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// The Secure OpenWeatherMap Data Pipeline Route
app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) return res.status(400).json({ error: 'City query missing' });

        const KEY = process.env.WEATHER_API_KEY; 
        
        // 🚀 THE FIXED URL LINE: Notice the accurate 'api.' subdomain and '${city}' variable tracking syntax!
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${KEY}`;

        const response = await fetch(url);
        if (!response.ok) return res.status(404).json({ error: 'Location profile mismatch' });

        const rawData = await response.json();

        // Bridge Mapping: Safe normalization to feed your exact frontend elements
        const formattedData = {
            name: rawData.name,
            sys: { country: rawData.sys.country },
            main: {
                temp: rawData.main.temp,
                humidity: rawData.main.humidity
            },
            weather: {
                description: rawData.weather[0].description, 
                iconUrl: `https://openweathermap.org/img/wn/${rawData.weather[0].icon}@2x.png`
            },
            wind: { speed: rawData.wind.speed }
        };

        res.json(formattedData);

    } catch (error) {
        console.error("OpenWeatherMap Pipeline Error:", error);
        res.status(500).json({ error: 'Internal pipeline broken' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Premium Weather Engine active at http://localhost:${PORT}`);
});
