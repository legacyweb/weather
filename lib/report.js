const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const Report = require('weather-api-client');
const { LRUCache } = require('lru-cache');

const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];

const lru = new LRUCache({
  ttl: 60 * 60 * 1000
});

const weather = new Report(process.env.WEATHER_API_KEY);

const currentTemplate = fs.readFileSync(path.join(__dirname, '..', 'html', 'report.ejs'), 'utf-8');

function convertIconUrl(url) {
  const parts = url.split('/')
  const fileName = parts[parts.length-1].replace('png', 'jpg');
  return `/icons/${fileName}?orig=http:${url}`;
}

async function report(req) {
  try {
    let weatherInfo = lru.get(req.location.zip);
    if (!weatherInfo) {
      weatherInfo = await weather.getForecast(req.location.zip, 8, true);
    }
    weatherInfo.current.condition.icon = convertIconUrl(weatherInfo.current.condition.icon);
    weatherInfo.forecast.forecastday.forEach(day => {
      day.day.condition.icon = convertIconUrl(day.day.condition.icon);
      day.dayOfWeek = weekday[(new Date(day.date)).getDay()];
    });

    return ejs.render(currentTemplate, {
      location: req.location,
      weatherInfo,
      url: req.url,
      forecast: (req.url.match(/^\/forecast.*$/) !== null)
    });
  } catch (err) {
    return 'Unable to fetch weather data';
  }
}

module.exports = report;