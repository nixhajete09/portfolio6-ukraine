const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#',//huske at indsæt mysql kode
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

// Endpoint: Hent data til visualisering
app.get('/graf', (req, res) => {
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

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
