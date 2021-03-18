// Node modules
const { ipcRenderer } = require('electron');

// Global variables
let map;
let heatmap;
let data;
let rangeDOM;
let height;
let currentHeightSpan;
let currentPPMSpan;

// Events
ipcRenderer.on('send-csv-file', async (_, file) => {
    data = readCSVData(file, generateHeatMap);
});

// DOM Elements
currentHeightSpan = document.getElementById('current-height');
currentPPMSpan = document.getElementById('current-ppm');
rangeDOM = document.querySelector('input[type=range]');
rangeDOM.addEventListener('change', () => {
    height = rangeDOM.value;
    updateHeatMap();
});


function initMap() {
    var lisbon = new google.maps.LatLng(38.75382, -9.23083);

    map = new google.maps.Map(document.getElementById('map'), {
        center: lisbon,
        zoom: 3,
        mapTypeId: 'satellite'
    });
}

function generateHeatMap() {
    map.setCenter(new google.maps.LatLng(data[0]['Latitude'], data[0]['Longitude']));
    map.setZoom(13);
    heatmap = new google.maps.visualization.HeatmapLayer({ data: [] });
    height = data[0]['Height'];
    updateHeatMap();
}

function updateHeatMap() {
    if(!data) return; // Guard clause to make sure undefined data wont go through

    const filteredData = data.filter(dp => { let temp = dp.Height - height; return (temp >= 0 && temp < 10) });

    currentHeightSpan.innerText = height;
    const avg = filteredData.reduce((sum, { PPB }) => sum + (PPB / 1000), 0) / data.length;
    console.log(avg)
    currentPPMSpan.innerText = avg;

    const heatmapData = filteredData
        .map(dp => (
            { location: new google.maps.LatLng(dp['Latitude'], dp['Longitude']), weight: dp['PPB'] / 1000 }
        ));
    heatmap.setData(heatmapData);
    heatmap.setMap(map);
}