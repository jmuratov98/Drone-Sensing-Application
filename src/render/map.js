// Node modules
const { ipcRenderer } = require('electron');

// Global variables
let map;
let data;

// temp: TODO: Remove
const lon_lat = [
    [37.782, -122.450],
    [37.782, -122.445],
    [37.782, -122.443],
    [37.782, -122.441],
    [37.782, -122.439],
    [37.782, -122.437],
    [37.782, -122.435],
    [37.785, -122.447],
    [37.785, -122.445],
    [37.785, -122.443],
    [37.785, -122.441],
    [37.785, -122.439],
    [37.785, -122.437],
    [37.785, -122.435]
];

// Events
ipcRenderer.on('send-csv-file', async (_, file) => {
    data = readCSVData(file, generateHeatMap);
});

function initMap() {
    var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

    map = new google.maps.Map(document.getElementById('map'), {
        center: sanFrancisco,
        zoom: 13,
        mapTypeId: 'satellite'
    });
}

async function generateHeatMap() {
    const heatmapData = data.map((dp, i) => {
        return {
            location: new google.maps.LatLng(lon_lat[i % lon_lat.length][0], lon_lat[i % lon_lat.length][1]), weight: dp[1] / 1000
        }
    });
    new google.maps.visualization.HeatmapLayer({ data: heatmapData }).setMap(map);
}