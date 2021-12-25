const publicIp = require('public-ip');
const ipInfo = require("ip-info-finder");

async function getMyLocation() {
    const ip = await publicIp.v4()
    const info = ipInfo.getIPInfo(ip);
    return info;
}

module.exports = getMyLocation;
