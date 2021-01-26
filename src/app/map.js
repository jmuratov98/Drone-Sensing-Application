let map;

const lon_lat = [
    [37.782, -122.447],
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

function initMap() {
    var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

    map = new google.maps.Map(document.getElementById('map'), {
        center: sanFrancisco,
        zoom: 13,
        mapTypeId: 'satellite'
    });
}

function generateHeatMap(data) {
    let heatmapData = data.map((dp, i) => {
        const point = {
            location: new google.maps.LatLng(lon_lat[i % lon_lat.length][0], lon_lat[i % lon_lat.length][1]), weight: dp[1] / 1000
        }
        return point;
    });
    new google.maps.visualization.HeatmapLayer({ data: heatmapData }).setMap(map);
}


/** Base */

// let map;

// function initMap() {
//     var heatmapData = [
//         { location: new google.maps.LatLng(37.782, -122.447), weight: 0.5 },
//                     new google.maps.LatLng(37.782, -122.445),
//         { location: new google.maps.LatLng(37.782, -122.443), weight: 2 },
//         { location: new google.maps.LatLng(37.782, -122.441), weight: 3 },
//         { location: new google.maps.LatLng(37.782, -122.439), weight: 2 },
//                     new google.maps.LatLng(37.782, -122.437),
//         { location: new google.maps.LatLng(37.782, -122.435), weight: 0.5 },
//         { location: new google.maps.LatLng(37.785, -122.447), weight: 3 },
//         { location: new google.maps.LatLng(37.785, -122.445), weight: 2 },
//                     new google.maps.LatLng(37.785, -122.443),
//         { location: new google.maps.LatLng(37.785, -122.441), weight: 0.5 },
//                     new google.maps.LatLng(37.785, -122.439),
//         { location: new google.maps.LatLng(37.785, -122.437), weight: 2 },
//         { location: new google.maps.LatLng(37.785, -122.435), weight: 3 }
//     ];


//     var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

//     map = new google.maps.Map(document.getElementById('map'), {
//         center: sanFrancisco,
//         zoom: 13,
//         mapTypeId: 'satellite'
//     });

//     var heatmap = new google.maps.visualization.HeatmapLayer({
//         data: heatmapData
//     });
//     heatmap.setMap(map);
// }
