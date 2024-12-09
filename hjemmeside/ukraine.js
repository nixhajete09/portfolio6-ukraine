document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/graf')
        .then((response) => response.json())
        .then((data) => {
            const labels = data.map(item => item.name); // Brug navne som labels
            const reactions = data.map(item => item.reactions); // Brug reaktioner som data

            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar', // Eller 'line', 'bubble', afhængigt af behov
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Reaktioner pr. Indlæg',
                        data: reactions,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch((error) => console.error('Fejl ved hentning af data:', error));
});

