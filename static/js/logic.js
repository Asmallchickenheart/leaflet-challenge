function loadMap() {
    const map = L.map('map').setView([37, -115], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
}

function getGeoJSON(map) {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    // override default marker
                    // return L.marker(latlng);

                    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        fillColor: getColor(feature.geometry.coordinates[2]),
                        stroke: true,
                        fillOpacity: 1,
                        radius: feature.properties.mag * 20000,
                        weight: 1,
                        color: 'black'
                    }).bindPopup('<h3>' + feature.properties.place + '</h3><hr><p>' + new Date(feature.properties.time) + '</p>')
                        .addTo(map);
                }
            }).addTo(map);
        });
}

function getColor(depth) {
    if (depth > 90) {
        return 'red';
    } else if (depth > 70) {
        return 'orangered';
    } else if (depth > 50) {
        return 'orange';
    } else if (depth > 30) {
        return 'gold';
    } else if (depth > 10) {
        return 'yellow';
    } else {
        return 'green';
    }
}

function addLegend(map) {
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10, 10, 30, 50, 70, 90];
        const labels = [];
        for (let i = 0; i < grades.length; i++) {
            labels.push('<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
        }
        div.innerHTML = labels.join('');
        return div;
    }

    legend.addTo(map);
}

const map = loadMap();
getGeoJSON(map)
addLegend(map);