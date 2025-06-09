/**
 * @file server.js
 * @description Startet einen Express-Server, lädt Projektdaten und Personendaten von Blue Ant via REST-API,
 *              speichert sie als JSON-Dateien lokal und stellt sie dem Frontend über eine API zur Verfügung.
 * @version 1.0
 * @date 2025-06-05
 * @authors
 *   - Aron Emmermann
 *   - Nashwan Adel Butt
 *   - Furkan Adigüzel
 *   - Caner Celik
 */

const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { transformProjectData } = require('./dataManagement');

const app = express();
const PORT = 3000;

// ==============================
// API-Konfiguration
// ==============================

const projectApiUrl = 'https://dashboard-examples.blueant.cloud/rest/v1/projects';
const personApiUrl = 'https://dashboard-examples.blueant.cloud/rest/v1/human/persons';
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MTgyMDE2ODYiLCJpYXQiOjE3NDc5MjA3ODgsImlzcyI6IkJsdWUgQW50wqkiLCJleHAiOjE5MDU2MDA3ODh9.UVSM95p8yh8uN_qlzxE8geSa3imJBMCwIDbuVoxDNu8'; // <--- Deinen Token hier ggf. kürzen oder extern sichern

// ==============================
// Projektdaten abrufen & speichern
// ==============================

fetch(projectApiUrl, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFile(path.join(__dirname, 'project_data.json'), jsonData, err => {
            if (err) {
                console.error('❌ Fehler beim Schreiben der Projektdatei:', err);
            } else {
                console.log('✅ Projektdaten erfolgreich gespeichert!');
                transformProjectData(); // Daten transformieren nach Speicherung
            }
        });
    })
    .catch(error => {
        console.error('❌ Fehler beim Abrufen der Projektdaten:', error.message);
    });

// ==============================
// Kundendaten abrufen & speichern
// ==============================

fetch(personApiUrl, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP-Fehler bei Personen-API: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFile(path.join(__dirname, 'customer_data.json'), jsonData, err => {
            if (err) {
                console.error('❌ Fehler beim Schreiben der Kundendaten:', err);
            } else {
                console.log('✅ Kundendaten erfolgreich gespeichert!');
            }
        });
    })
    .catch(error => {
        console.error('❌ Fehler bei zweiter API-Anfrage:', error.message);
    });

// ==============================
// Express: Frontend & API-Endpunkt
// ==============================

// Statische Dateien aus dem Frontend-Ordner bereitstellen
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API-Endpunkt für transformierte Daten
const finalPath = path.join(__dirname, 'final_data.json');
app.get('/api/final-data', (req, res) => {
    res.sendFile(finalPath);
});

// Server starten
app.listen(PORT, () => {
    console.log(`✅ Server läuft unter http://localhost:${PORT}`);
});
