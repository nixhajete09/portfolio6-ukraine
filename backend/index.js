const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Opret forbindelse til MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#', // Husk at indsætte din MySQL adgangskode
    database: 'ukraine'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err.message);
        process.exit(1); // Afslut processen, hvis forbindelsen fejler
    } else {
        console.log('Connected to MySQL database');
    }
});

// Endpoint 1: Hent data om holdninger (stance)
app.get('/graf/stance', (req, res) => {
    const query = `
        SELECT 
            gpt_ukraine_for_imod AS stance,
            COUNT(*) AS count
        FROM 
            classification
        GROUP BY 
            gpt_ukraine_for_imod;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Databaseforespørgselsfejl:', err);
            return res.status(500).json({ error: 'Databasefejl' });
        }
        res.json(results);
    });
});

// Endpoint 2: Hent data om medietyper og lande
app.get('/graf/media-country', (req, res) => {
    const query = `
        SELECT 
    country,
    category,
    COUNT(*) AS count
FROM 
    sourcepop
WHERE 
    category != 'Political'
GROUP BY 
    country, category
ORDER BY 
    country, category;

    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Databaseforespørgselsfejl:', err);
            return res.status(500).json({ error: 'Databasefejl' });
        }
        res.json(results);
    });
});

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
