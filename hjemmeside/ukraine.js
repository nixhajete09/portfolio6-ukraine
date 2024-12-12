document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/graf/stance')
        .then((response) => response.json())
        .then((data) => {
            // Opdel data i labels og værdier
            const labels = data.map(item => item.stance); // "For", "Imod", "Neutral"
            const counts = data.map(item => item.count); // Antal pr. holdning

            // Opret diagrammet
            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels, // Holdninger
                    datasets: [{
                        label: 'Holdninger blandt politikere',
                        data: counts, // Antal pr. holdning
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
                        legend: {
                            position: 'top'
                        }
                    },
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
//-------------------
