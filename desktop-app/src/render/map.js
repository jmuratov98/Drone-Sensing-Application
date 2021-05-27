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
let popUpContentDOM;

let graph3DDom;

// Events
ipcRenderer.on('send-csv-file', async (_, file) => {
    data = readCSVData(file, generateHeatMap);
});

// DOM Elements
currentHeightSpan = document.getElementById('current-height');
currentPPMSpan = document.getElementById('current-ppm');
rangeDOM = document.querySelector('input[type=range]');
graph3DDom = document.getElementById('3d-graph');
popUpContentDOM = document.getElementById('content');

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
    class Popup extends google.maps.OverlayView {
        constructor(position, content) {
            super();
            this.position = position;
            content.classList.add("popup-bubble");
            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");
            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.appendChild(content);
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            // Optionally stop clicks, etc., from bubbling up to the map.
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        }
        /** Called when the popup is added to the map. */
        onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
        }
        /** Called when the popup is removed from the map. */
        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }
        /** Changes the position of the popup when clicked on */
        onPositionChange (position) {
            this.position = position;
        }
        /** Called each frame when the popup needs to draw itself. */
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position
            );
            // Hide the popup when it is far out of view.
            const display =
                Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
                    ? "block"
                    : "none";

            if (display === "block") {
                this.containerDiv.style.left = divPosition.x + "px";
                this.containerDiv.style.top = divPosition.y + "px";
            }

            if (this.containerDiv.style.display !== display) {
                this.containerDiv.style.display = display;
            }
        }
    }


    var lisbon = new google.maps.LatLng(38.75382, -9.23083);

    map = new google.maps.Map(document.getElementById('map'), {
        center: lisbon,
        zoom: 3,
        mapTypeId: 'satellite'
    });

    let popup = new Popup(
        new google.maps.LatLng(-33.866, 151.196),
        popUpContentDOM
    );
    popup.setMap(map);

    google.maps.event.addListener(map, 'click', e => {
        const lat = e.latLng.lat();
        const long = e.latLng.lng()
        let res;
        if(data) {
            res = data.find(dp => {
                // needs some margin of error
                const dlat = dp.Latitude - lat;
                const dlong = dp.Longitude - long;

                return dlat >= -0.0001 && dlat <= 0.0001 && dlong >= -0.0001 && dlong < 0.0001; 
            }); 
            popUpContentDOM.innerText = "";
            const ppmDOM = document.createElement('div')
            const latDOM = document.createElement('div')
            const lngDOM = document.createElement('div')
            popUpContentDOM.appendChild(ppmDOM);
            popUpContentDOM.appendChild(latDOM);
            popUpContentDOM.appendChild(lngDOM);
            
            if(res) {
                ppmDOM.innerText = `PPM:       ${res.PPB / 1000}`;
                latDOM.innerText = `Latitude:  ${res.Latitude}`;
                lngDOM.innerText = `Longitude: ${res.Longitude}`;
                popup.onPositionChange(new google.maps.LatLng(res.Latitude, res.Longitude));
            }
        }
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
        title: 'NO2 Data',
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