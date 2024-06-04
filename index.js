const axios = require('axios');
const fs = require('fs');
const generateLineChart = require('./generateLineChart');
const loadSpeedData = require('./loadSpeedData');

const client = axios.create({
    baseURL: 'http://ipv4.download.thinkbroadband.com',
    timeout: 20000
});

const dataFile = 'speed-data.json';

async function main() {
    let startTime = null;
    let lastLoaded = 0;

    client.get('/200MB.zip', {
        onDownloadProgress: progressEvent => {
            if (!startTime) {
                startTime = Date.now();
            }

            const currentLoaded = progressEvent.loaded;
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000; // Time in seconds

            if ((currentTime - startTime) >= 60000) { // Check if 5 seconds have passed since the last update
                const currentSpeed = (((currentLoaded - lastLoaded) * 8) / elapsedTime) / 1000000; // Speed in Mbps
                lastLoaded = currentLoaded;
                startTime = currentTime; // Reset start time for the next interval

                if (currentTime && currentSpeed) {
                    logSpeed(currentTime, currentSpeed);
                    console.log('Speed: ', currentSpeed.toFixed(2), 'Mbps');
                }
            }
        }
    })
        .then(res => {
            console.log("All DONE: ", res.headers);
            return res.data;
        });
}

function logSpeed(timestamp, speed) {
    const data = loadSpeedData();
    data.push({ timestamp, speed });
    saveSpeedData(data);
}

function saveSpeedData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data));
    generateLineChart();
}

main();
