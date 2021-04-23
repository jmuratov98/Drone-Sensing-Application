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

let graph3DDom;

// Events
ipcRenderer.on('send-csv-file', async (_, file) => {
    data = readCSVData(file, generateHeatMap);
});

// DOM Elements
currentHeightSpan = document.getElementById('current-height');
currentPPMSpan = document.getElementById('current-ppm');
rangeDOM = document.querySelector('input[type=range]');
graph3DDom = document.getElementById('3d-graph')

rangeDOM.addEventListener('change', () => {
    height = rangeDOM.value;
    updateHeatMap();
});

graph3DDom.addEventListener('click', () => {
    const map = document.getElementById('map');
    const graph = document.getElementById('graph');

    if (graph3DDom.checked) {
        map.style.display = 'none';
        graph.style.display = 'block';
        update3DGraph();
    } else {
        map.style.display = 'block';
        graph.style.display = 'none';
        updateHeatMap();
    }
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
    if (!data) return; // Guard clause to make sure undefined data wont go through

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

function update3DGraph() {
    const gData = data.reduce((obj, dp) => {
        obj.x.push(parseFloat(dp['Latitude']));
        obj.y.push(parseFloat(dp['Longitude']));
        obj.z.push(dp['PPB'] / 1000);
        return obj;
    }, { x: [], y: [], z: [] });
    console.log(gData);
    

    const graphData = [{
        x: gData.x,
        y: gData.y,
        z: gData.z,
        type: 'scatter3d',
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: { z: true }
            }
        }
    }];

    const layout = {
        title: 'Mt Bruno Elevation With Projected Contours',
        scene: { camera: { eye: { x: 1.87, y: 0.88, z: -0.64 } } },
        autosize: false,
        width: 500,
        height: 500,
        margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90,
        }
    };

    Plotly.newPlot('graph', graphData, layout);
}