const publicIp = require('public-ip');
const ipInfo = require("ip-info-finder");
const zipCodes = require('zipcodes');

async function getMyLocation(req, res, next) {
    let location;
    try {
        if (req.query.zip) {
            location = zipCodes.lookup(req.query.zip);
            res.cookie('weatherInfo', location);
        } else if (req.cookies && req.cookies.weatherInfo) {
            location = req.cookies.weatherInfo;
        } else {
            const ip = await publicIp.v4()
            location = await ipInfo.getIPInfo(ip);
            const stripped = {
                city: location.city,
                state: location.region,
                zip: location.zip
            }
            res.cookie('weatherInfo', stripped);
            location = Object.assign(location, stripped)
        }
    } catch (err) {
        location = {
            city: 'Unknown',
            state: 'Unknown',
            zip: 'Unknown'
        }
    }

    req.location = location;
    next();
}

module.exports = getMyLocation;
