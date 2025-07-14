/**
 * @file dataManagement.js
 * @description Transformiert Projekt-JSON-Daten in ein menschenlesbares Format
 *              (Prioritäten, Status, Typen und Projektleiter-Namen)
 * @version 1.0
 * @date 2025-06-05
 * @authors
 *   - Nashwan Adel Butt
 *   - Aron Emmermann
 *   - Furkan Adigüzel
 *   - Caner Celik
 */
const fs = require('fs');
const path = require('path');

const priorityMap = {
    4: 'A-Projekt',
    5: 'B-Projekt',
    6: 'C-Projekt'
};

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

const customFieldDefs = require('./response_1752503083964.json').customFields;

function mapCustomFields(customValues = {}) {
    const mapped = {};
    for (const [fieldId, value] of Object.entries(customValues)) {
        const def = customFieldDefs.find(f => String(f.id) === fieldId);
        if (!def) continue;

        if (def.type === "ListBox") {
            const match = def.options?.find(opt => String(opt.key) === String(value));
            mapped[def.name] = match ? match.value : value;
        } else {
            mapped[def.name] = value;
        }
    }
    return mapped;
}

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

    function getFullNameById(id) {
        const person = customerData.persons.find(p => p.id === id);
        return person ? `${person.firstname} ${person.lastname}` : id;
    }

    let changedPriorities = 0;
    let leaderIdsChanged = 0;
    let typeChanged = 0;
    let statusChanged = 0;

    const transformed = projectData.projects.map(p => {
        if (priorityMap.hasOwnProperty(p.priorityId)) {
            p.priorityId = priorityMap[p.priorityId];
            changedPriorities++;
        }

        if (typeMap.hasOwnProperty(p.typeId)) {
            p.typeId = typeMap[p.typeId];
            typeChanged++;
        }

        if (statusMap.hasOwnProperty(p.statusId)) {
            p.statusId = statusMap[p.statusId];
            statusChanged++;
        }

        const fullName = getFullNameById(p.projectLeaderId);
        if (fullName !== p.projectLeaderId) {
            p.projectLeaderId = fullName;
            leaderIdsChanged++;
        }

        // 🔥 Mapping für benutzerdefinierte Felder
        if (p.customFields) {
            p.mappedCustomFields = mapCustomFields(p.customFields);
        }

        return p;
    });

    fs.writeFileSync(outputPath, JSON.stringify({ projects: transformed }, null, 2), 'utf-8');

    console.log("✅ Final transformierte Daten gespeichert in:", outputPath);

    changedPriorities > 0
        ? console.log(`✅ ${changedPriorities} Projekt-Prioritäten wurden erfolgreich überschrieben.`)
        : console.warn("⚠️ Keine Prioritäten wurden geändert.");

    leaderIdsChanged > 0
        ? console.log(`✅ ${leaderIdsChanged} Projektleiter-IDs wurden erfolgreich in Namen umgewandelt.`)
        : console.warn("⚠️ Keine Projektleiter-IDs wurden umgewandelt.");

    typeChanged > 0
        ? console.log(`✅ ${typeChanged} Projekt-Typen wurden erfolgreich angepasst.`)
        : console.warn("⚠️ Keine typeId-Werte wurden angepasst.");

    statusChanged > 0
        ? console.log(`✅ ${statusChanged} Status-IDs wurden erfolgreich umgewandelt.`)
        : console.warn("⚠️ Keine statusId-Werte wurden angepasst.");
}

module.exports = { transformProjectData };