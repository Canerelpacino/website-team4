/**
 * @file dataManagement.js
 * @description Transformiert Projekt-JSON-Daten in ein menschenlesbares Format
 *              (Prioritäten, Status, Typen und Projektleiter-Namen)
 * @version 1.0
 * @date 2025-07-19
 * @authors
 *   - Nashwan Adel Butt
 *   - Aron Emmermann
 *   - Furkan Adigüzel
 *   - Caner Celik
 */

const fs = require('fs');
const path = require('path');

// === Mapping-Tabellen für IDs ===

/** @type {Object<number, string>} */
const priorityMap = {
    4: 'A-Projekt',
    5: 'B-Projekt',
    6: 'C-Projekt'
};

/** @type {Object<number, string>} */
const typeMap = {
    3: 'F - Sonderprojekte',
    4: 'A - Strategie',
    5: 'E - IT-Projekt',
    6: 'D - Vorstandsprojekte',
    106986930: 'D3 - Linie',
    107185025: 'D - Produkteinführung',
    256074115: 'C - Regulatorik',
    354153979: 'B - IT-Implementierung',
    358630855: 'G - Wartungsprojekte',
    359095703: 'P - Programm'
};

/** @type {Object<number, string>} */
const statusMap = {
    10: 'A1 - Anfrage/Idee',
    11: 'C1 - Umsetzung',
    13: 'Z1 - Gestoppt/Zurückgestellt',
    30: 'E1 - Abschluss',
    31: 'B3 - Planung (Gate 1)',
    32: 'C2 - Abnahme',
    33: 'Z2 - Abgeschlossen',
    142717278: 'F1 - Revision',
    296275704: 'B2 - Auftragsklärung (Gate 1)',
    357201137: 'B5 - Genehmigt (Gate 2)',
    357931560: 'B4 - Empfohlen (Gate 1)',
    359080576: 'Z3 - Abgelehnt',
    525932357: 'A2 - Bewertung (Gate 0)',
    525932360: 'B1 - Initiierung (Gate 1)'
};

// === Custom Field Definitionen ===
const customFieldDefs = require('./customfields_structor.json').customFields;

/**
 * Wandelt Custom Fields in ein menschenlesbares Format um.
 * @param {Object} customValues - Ursprüngliche benutzerdefinierte Felder
 * @returns {Object} - Gemappte Felder mit lesbaren Namen und Werten
 */
function mapCustomFields(customValues = {}) {
    const mapped = {};

    for (const [fieldId, value] of Object.entries(customValues)) {
        const def = customFieldDefs.find(f => String(f.id) === fieldId);
        if (!def) continue;

        if (def.type === "ListBox") {
            const option = def.options?.find(opt => String(opt.key) === String(value));
            mapped[def.name] = option ? option.value : value;
        } else {
            mapped[def.name] = value;
        }
    }

    return mapped;
}

/**
 * Hauptfunktion zur Transformation der Projektdaten.
 * Liest Projekt- und Personendaten ein, ersetzt IDs durch Namen, mappt Felder und speichert das Ergebnis.
 */
function transformProjectData() {
    const projectPath = path.join(__dirname, 'project_data.json');
    const customerPath = path.join(__dirname, 'customer_data.json');
    const outputPath = path.join(__dirname, 'final_data.json');

    console.log("📁 Lade Projekt- und Kundendaten...");

    const rawProjects = fs.readFileSync(projectPath, 'utf-8');
    const rawCustomers = fs.readFileSync(customerPath, 'utf-8');

    const projectData = JSON.parse(rawProjects);
    const customerData = JSON.parse(rawCustomers);

    if (!Array.isArray(projectData.projects) || !Array.isArray(customerData.persons)) {
        console.error("❌ Ungültige Datenstruktur in den JSON-Dateien.");
        return;
    }

    /**
     * Holt den vollständigen Namen einer Person anhand ihrer ID.
     * @param {number|string} id - Personen-ID
     * @returns {string} - Vollständiger Name oder Original-ID
     */
    function getFullNameById(id) {
        const person = customerData.persons.find(p => p.id === id);
        return person ? `${person.firstname} ${person.lastname}` : id;
    }

    let count = {
        priorities: 0,
        leaders: 0,
        types: 0,
        statuses: 0
    };

    const transformed = projectData.projects.map(project => {
        if (priorityMap.hasOwnProperty(project.priorityId)) {
            project.priorityId = priorityMap[project.priorityId];
            count.priorities++;
        }

        if (typeMap.hasOwnProperty(project.typeId)) {
            project.typeId = typeMap[project.typeId];
            count.types++;
        }

        if (statusMap.hasOwnProperty(project.statusId)) {
            project.statusId = statusMap[project.statusId];
            count.statuses++;
        }

        const fullName = getFullNameById(project.projectLeaderId);
        if (fullName !== project.projectLeaderId) {
            project.projectLeaderId = fullName;
            count.leaders++;
        }

        if (project.customFields) {
            project.mappedCustomFields = mapCustomFields(project.customFields);
        }

        return project;
    });

    fs.writeFileSync(outputPath, JSON.stringify({ projects: transformed }, null, 2), 'utf-8');
    console.log("✅ Final transformierte Daten gespeichert in:", outputPath);

    console.table({
        "Prioritäten geändert": count.priorities,
        "Projektleiter ersetzt": count.leaders,
        "Typen angepasst": count.types,
        "Status angepasst": count.statuses
    });
}

// Ermöglicht direkten CLI-Aufruf
if (require.main === module) {
    transformProjectData();
}

module.exports = { transformProjectData };