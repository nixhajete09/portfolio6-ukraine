document.addEventListener('DOMContentLoaded', () => {
    // Diagram: Holdninger blandt politikere
    fetch('http://localhost:3000/graf/stance')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.stance); // "For", "Imod", "Neutral"
            const counts = data.map(item => item.count); // Antal pr. holdning

            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Holdninger blandt politikere 2022',
                        data: counts,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)', // "For"
                            'rgba(255, 99, 132, 0.6)', // "Imod"
                            'rgba(255, 206, 86, 0.6)'  // "Neutral"
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error('Fejl ved hentning af data:', error));
    //barchart 2
    fetch('http://localhost:3000/graf/stance24')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.stance); // "For", "Imod", "Neutral"
            const counts = data.map(item => item.count); // Antal pr. holdning
            const ctx = document.getElementById('chart2').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Holdninger blandt politikere 2024',
                        data: counts,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)', // "For"
                            'rgba(255, 99, 132, 0.6)', // "Imod"
                            'rgba(255, 206, 86, 0.6)'  // "Neutral"
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error('Fejl ved hentning af data:', error));

    // Kort: Geografisk fordeling
    const map = L.map('map').setView([54.5260, 15.2551], 5); // Centralt i Europa, zoomniveau 5

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const geoData = createGeoJSONFromCoordinates({
        Malta: [35.8997, 14.5146],
        Denmark: [55.6761, 12.5683],
        Germany: [51.1657, 10.4515],
        France: [46.6034, 1.8883],
        Schweiz: [46.9481, 7.4474],
        Wales: [51.4816, -3.1791],
    });

    fetch('http://localhost:3000/graf/media-country')
        .then(response => response.json())
        .then(data => {
            const countryData = processData(data);

            L.geoJSON(geoData, {
                style: feature => {
                    const country = feature.properties.name;
                    const categoryRatio = countryData[country]?.ratio || 0.5;
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
                    const info = countryData[country]
                        ? `<b>${country}</b><br>Media: ${countryData[country].media}<br>Societal: ${countryData[country].societal}`
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
        geometry: { type: 'Point', coordinates: [coords[1], coords[0]] } // [lon, lat]
    }));
    return { type: 'FeatureCollection', features };
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

    for (const country in countryData) {
        const total = countryData[country].media + countryData[country].societal;
        countryData[country].ratio = total > 0 ? countryData[country].media / total : 0.5;
    }
    return countryData;
}

// Funktion til at beregne gradientfarve baseret på forhold
function getGradientColor(ratio) {
    const green = Math.round(255 * (1 - ratio));
    const blue = Math.round(255 * ratio);
    return `rgb(${green}, ${blue})`;
}
