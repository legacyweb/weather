const LRU = require('lru-cache');
const axios = require('axios');
const imgConvert = require('image-convert');

function ImageCache() {
  this.cache = new LRU();
}

ImageCache.prototype.getImage = async function(key, remoteUrl) {
  try {
    let image = this.cache.get(key);
    if (!image) {
      // Fetch using axios
      const response = await axios.get(remoteUrl, {
        responseType: 'arraybuffer'
      });
      const pngImage = Buffer.from(response.data, 'binary').toString('base64');
      const gifData = await new Promise(function(resolve, reject) {
        imgConvert.fromBuffer({
          buffer: pngImage,
          output_format: 'jpg',
        }, function(err, data) {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
      image = Buffer.from(gifData, 'binary').toString('base64');
      this.cache.set(key, image);
    }
    return image;
  } catch (err) {
    return null;
  }
}

ImageCache.prototype.icon = function() {
  const imageCache = this;

  return async function(req, res) {
    const iconKey = req.params.icon;
    const origUrl = req.query.orig;
    const iconBase64 = await imageCache.getImage(iconKey, origUrl);
    const iconData = Buffer.from(iconBase64, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': iconData.length
    });
    res.end(iconData);
  }
}

module.exports = ImageCache;