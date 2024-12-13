document.addEventListener('DOMContentLoaded', () => {
    // Opret et Leaflet-kort centreret i Europa
    const map = L.map('map').setView([54.5260, 15.2551], 5); // Centralt i Europa, zoomniveau 5

    // Tilføj OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hent data fra backend
    fetch('http://localhost:3000/graf/media-country')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                // Opret en markør for hvert land
                const latLng = getCountryLatLng(item.country); // Funktion til at konvertere land til koordinater
                if (latLng) {
                    L.circleMarker(latLng, {
                        radius: Math.sqrt(item.count) * 3, // Boblestørrelse baseret på rapporter
                        color: item.category === 'Media' ? 'black' : 'green', // Farve baseret på kategori
                        fillOpacity: 0.6
                    })
                        .bindPopup(`<b>${item.country}</b><br>${item.category}: ${item.count}`)
                        .addTo(map);
                }
            });
        })
        .catch(error => console.error('Fejl ved hentning af data:', error));
});

// Funktion til at få landekoordinater
function getCountryLatLng(country) {
    const coordinates = {
        Malta: [35.8997, 14.5146],
        Denmark: [55.6761, 12.5683],
        Germany: [51.1657, 10.4515],
        France: [46.6034, 1.8883],
        Schweiz: [46.9481, 7.4474],
        Wales: [51.4816, -3.1791],
    };
    return coordinates[country] || null;
}

