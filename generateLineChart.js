const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const loadSpeedData = require('./loadSpeedData');

module.exports = async function generateLineChart() {
    const data = loadSpeedData();
    if (data.length < 3) return;
    const labels = data.map(entry => new Date(entry.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: false }).split(', ').join(','));
    const speeds = data.map(entry => entry.speed);

    const width = 800;
    const height = 400;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Internet Speed (Mbps)',
                data: speeds,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Speed (Mbps)'
                    }
                }
            }
        }
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync('speed-chart.png', image);
    console.log('Chart generated: speed-chart.png');
}