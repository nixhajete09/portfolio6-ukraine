document.addEventListener('DOMContentLoaded', () => {
    // Opret Leaflet-kort
    const map = L.map('map').setView([54.5260, 15.2551], 5); // Centralt i Europa, zoomniveau 5

    // Tilføj OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Landekoordinater som GeoJSON-data
    const geoData = createGeoJSONFromCoordinates({
        Malta: [35.8997, 14.5146],
        Denmark: [55.6761, 12.5683],
        Germany: [51.1657, 10.4515],
        France: [46.6034, 1.8883],
        Schweiz: [46.9481, 7.4474],
        Wales: [51.4816, -3.1791],
    });

    // Hent backend-data
    fetch('http://localhost:3000/graf/media-country')
        .then(response => response.json())
        .then(data => {
            // Kortlæg lande til deres kategoridata
            const countryData = processData(data);

            // Tilføj GeoJSON-lag til kortet
            L.geoJSON(geoData, {
                style: feature => {
                    const country = feature.properties.name;
                    const categoryRatio = countryData[country]?.ratio || 0.5; // Standardværdi: neutral farve
                    return {
                        fillColor: getGradientColor(categoryRatio),
                        weight: 1,
                        opacity: 1,
                        color: 'black',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: (feature, layer) => {
                    const country = feature.properties.name;
                    const data = countryData[country];
                    const info = data
                        ? `<b>${country}</b><br>Media: ${data.media}<br>Societal: ${data.societal}`
                        : `<b>${country}</b><br>Ingen data`;
                    layer.bindPopup(info);
                }
            }).addTo(map);
        })
        .catch(error => console.error('Fejl ved hentning af data fra backend:', error));
});

// Funktion til at oprette GeoJSON-data fra koordinater
function createGeoJSONFromCoordinates(coordinates) {
    const features = Object.entries(coordinates).map(([country, coords]) => ({
        type: 'Feature',
        properties: { name: country },
        geometry: {
            type: 'Point',
            coordinates: [coords[1], coords[0]] // GeoJSON bruger [lon, lat]
        }
    }));
    return {
        type: 'FeatureCollection',
        features
    };
}

// Funktion til at behandle backend-data
function processData(data) {
    const countryData = {};
    data.forEach(item => {
        const { country, category, count } = item;
        if (!countryData[country]) {
            countryData[country] = { media: 0, societal: 0 };
        }
        if (category === 'Media') {
            countryData[country].media += count;
        } else if (category === 'Societal') {
            countryData[country].societal += count;
        }
    });

    // Beregn forholdet mellem Media og Societal for hvert land
    for (const country in countryData) {
        const total = countryData[country].media + countryData[country].societal;
        countryData[country].ratio = total > 0 ? countryData[country].media / total : 0.5; // Ratio for Media
    }
    return countryData;
}

// Funktion til at beregne gradientfarve baseret på forhold
function getGradientColor(ratio) {
    const green = Math.round(255 * (1 - ratio)); // Mere grønt for Societal
    const blue = Math.round(255 * ratio);       // Mere blåt for Media
    return `rgb(${green}, ${blue})`;  // Bland farverne
}
