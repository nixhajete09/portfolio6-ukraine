document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/graf')
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

document.addEventListener('DOMContentLoaded', function () {
    var ctx1 = document.getElementById('chart1').getContext('2d');
    var ctx2 = document.getElementById('chart2').getContext('2d');
    var ctx3 = document.getElementById('chart3').getContext('2d');

    // Sample data for the visualizations
    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Facebook', 'Twitter', 'Instagram', 'TikTok'],
            datasets: [{
                label: 'Støtte til Ukraine',
                data: [200, 150, 180, 120],
                backgroundColor: 'rgba(0, 90, 156, 0.6)',
                borderColor: 'rgba(0, 90, 156, 1)',
                borderWidth: 1
            }]
        }
    });

    var chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj'],
            datasets: [{
                label: 'Indflydelse af Kampagner',
                data: [50, 75, 100, 125, 150],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });

    var chart3 = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['Støtter Ukraine', 'Neutrale', 'Modstandere'],
            datasets: [{
                label: 'Ukraine’s Sociale Medie Engagement',
                data: [300, 50, 20],
                backgroundColor: ['rgba(0, 90, 156, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        }
    });
});
