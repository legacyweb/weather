const publicIp = require('public-ip');
const ip2location = require('ip-to-location');
const zipCodes = require('zipcodes');

function ipToLocation(ip) {
    return new Promise(function(resolve, reject) {
        ip2location.fetch(ip, function(err, res) {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
}

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
            location = await ipToLocation(ip);
            const stripped = {
                city: location.city,
                state: location.region_name,
                zip: location.zip_code
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
