const fs = require('fs');
const maxDataAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const dataFile = 'speed-data.json';
module.exports = function loadSpeedData() {
    if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile));
        return data.filter(entry => Date.now() - entry.timestamp <= maxDataAge); // Filter data older than 7 days
    }
    return [];
}