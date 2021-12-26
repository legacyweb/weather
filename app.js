const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const LegacyPage = require('legacyweb-pages');
// Strip middleware
const location = require('./lib/location');
// Content generator
const report = require('./lib/report');
const ImageCache = require('./lib/imageCache');

const HTML_PATH = path.join(__dirname, 'html');
const header = fs.readFileSync(path.join(HTML_PATH, 'header.html'), 'utf-8');
const strip = fs.readFileSync(path.join(HTML_PATH, 'strip.html'), 'utf-8');

const imageCache = new ImageCache();

const WeatherPage = new LegacyPage(
  'ribbon', 'winter', 'Weather Report', {
    gen: report
  }, true, [{webPath: '/images', filePath: path.join(__dirname, 'images')}]
);

WeatherPage.app.use([
  cookieParser(),
  location
]);

WeatherPage.setHeader(header);
WeatherPage.setStrip(strip);

WeatherPage.addPage({
  title: 'Weather Forecast',
  path: '/forecast',
  gen: report
})

WeatherPage.app.use('/icons/:icon', imageCache.icon());

WeatherPage.start();
