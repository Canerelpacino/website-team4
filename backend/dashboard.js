/**
 * @file dashboard.js
 * @description Initialisiert das Dashboard für die Projektübersicht, inkl. Filter, Suche und Statuslogik.
 * @version 1.1
 * @date 2025-07-19
 * @authors
 *   - Nashwan Adel Butt
 *   - Aron Emmermann
 *   - Furkan Adigüzel
 *   - Caner Celik
 */

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initSearch();
    initStatusButtons();
    fetchProjects();
});

// =============================
// Konstanten
// =============================

/** Status-Gruppierungen für Schnellfilter */
const statusGroups = {
    completed: ["Z2 - Abgeschlossen"],
    notStarted: ["A1 - Anfrage/Idee"],
    inProgress: [
        "C1 - Umsetzung", "B3 - Planung (Gate 1)", "C2 - Abnahme",
        "F1 - Revision", "B2 - Auftragsklärung (Gate 1)",
        "B5 - Genehmigt (Gate 2)", "B4 - Empfohlen (Gate 1)",
        "A2 - Bewertung (Gate 0)", "B1 - Initiierung (Gate 1)"
    ]
};

/** Statusfarben für Fortschrittsbalken */
const statusColorMap = {
    "A1 - Anfrage/Idee": "green", "C1 - Umsetzung": "green", "B3 - Planung (Gate 1)": "green",
    "Z2 - Abgeschlossen": "green", "B2 - Auftragsklärung (Gate 1)": "green",
    "B5 - Genehmigt (Gate 2)": "green", "B4 - Empfohlen (Gate 1)": "green",
    "A2 - Bewertung (Gate 0)": "green", "B1 - Initiierung (Gate 1)": "green",
    "E1 - Abschluss": "yellow", "C2 - Abnahme": "yellow", "F1 - Revision": "yellow",
    "Z1 - Gestoppt/Zurückgestellt": "red", "Z3 - Abgelehnt": "red"
};

/** Liste finaler Projektstatus */
const finalizedStatuses = ["Z1 - Gestoppt/Zurückgestellt", "E1 - Abschluss", "C2 - Abnahme", "Z3 - Abgelehnt", "Z2 - Abgeschlossen"];

let allProjects = [];

// =============================
// Hilfsfunktionen
// =============================

/**
 * Wandelt ein Datum von ISO zu deutschem Format.
 * @param {string} dateStr - Datum im ISO-Format
 * @returns {string} - Datum im Format TT.MM.JJJJ
 */
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Escaped HTML-Zeichen in Strings zur Vermeidung von XSS.
 * @param {string} str - Eingabestring
 * @returns {string} - Entschärfter String
 */
function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Entfernt HTML-Tags aus einem String.
 * @param {string} html - HTML-Inhalt
 * @returns {string} - Nur Textinhalt
 */
function stripHTML(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

// =============================
// Initialisierer
// =============================

/** Initialisiert die Filtergruppen und Dropdowns */
function initFilters() {
    document.querySelectorAll(".filter-toggle").forEach(btn =>
        btn.addEventListener("click", () =>
            btn.parentElement.classList.toggle("active")
        )
    );

    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb =>
        cb.addEventListener('change', applyFilters)
    );

    document.getElementById('projectFilter').addEventListener('change', applyFilters);
    document.getElementById('leaderFilter').addEventListener('change', applyFilters);
}

/** Initialisiert die Live-Suche */
function initSearch() {
    document.getElementById('searchInput').addEventListener('input', e => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = !query ? allProjects : allProjects.filter(p =>
            [p.name, p.number, p.projectLeaderId, p.statusId, p.typeId, p.priorityId].some(
                val => val && val.toString().toLowerCase().includes(query)
            )
        );
        renderProjects(filtered);
    });
}

/** Initialisiert die Status-Kategorie-Buttons */
function initStatusButtons() {
    document.querySelectorAll(".status-buttons button").forEach(button => {
        button.addEventListener("click", () => toggleStatus(button));
    });
}

/** Lädt Projektliste von der API */
function fetchProjects() {
    fetch('/api/final-data')
        .then(res => res.json())
        .then(data => {
            allProjects = data.projects || [];
            populateDropdowns();
            renderProjects(allProjects);
        });
}

// =============================
// Rendering
// =============================

/**
 * Rendert eine Liste von Projekten als Karten.
 * @param {Array<Object>} projects - Liste von Projektdaten
 */
function renderProjects(projects) {
    const container = document.getElementById('projectCards');
    container.innerHTML = '';
    const today = new Date();

    projects
        .sort((a, b) => new Date(b.end) - new Date(a.end))
        .forEach(project => {
            const isExpired = new Date(project.end) < today;
            const isFinalized = finalizedStatuses.includes(project.statusId);
            const color = (isExpired && !isFinalized) ? "red" : (statusColorMap[project.statusId] || "gray");

            const customFieldsHTML = project.mappedCustomFields
                ? Object.entries(project.mappedCustomFields).map(
                    ([key, value]) => `<li><strong>${escapeHTML(key)}:</strong> ${escapeHTML(stripHTML(value))}</li>`
                ).join("")
                : '<li>Keine Zusatzfelder</li>';

            container.insertAdjacentHTML('beforeend', `
                <a href="project.html?number=${project.number}" class="card-link">
                    <div class="card">
                        <div class="card-content">
                            <div class="card-header">
                                <strong>${project.number || '-'}</strong><br />
                                Projektleiter: ${escapeHTML(project.projectLeaderId)}<br />
                                Status: ${escapeHTML(project.statusId)}<br />
                                Projektart: ${escapeHTML(project.typeId)}<br />
                                Priorität: ${escapeHTML(project.priorityId)}
                            </div>
                            <div class="card-title">${escapeHTML(project.name)}</div>
                            <div class="custom-fields-container">
                                <ul class="custom-fields-list">${customFieldsHTML}</ul>
                            </div>
                            <div class="card-footer">${formatDate(project.start)} - ${formatDate(project.end)}</div>
                        </div>
                        <div class="progress-bar" style="background-color: ${color};"></div>
                    </div>
                </a>
            `);
        });
}

/**
 * Aktualisiert das Dashboard basierend auf Status-Button-Klicks.
 * @param {HTMLElement} button - Der geklickte Button
 */
function toggleStatus(button) {
    const statusKey = button.dataset.status;
    const title = document.getElementById("dashboardTitle");
    const isActive = button.classList.toggle("active");

    document.querySelectorAll(".status-buttons button").forEach(btn => {
        if (btn !== button) btn.classList.remove("active");
    });

    title.textContent = isActive ? button.textContent : "Project Dashboard";
    const group = statusGroups[statusKey];
    const filtered = isActive ? allProjects.filter(p => group.includes(p.statusId)) : allProjects;
    renderProjects(filtered);
}

/**
 * Wendet die ausgewählten Filter auf die Projektliste an.
 */
function applyFilters() {
    const selectedProject = document.getElementById('projectFilter').value;
    const selectedLeader = document.getElementById('leaderFilter').value;

    const checked = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked')).map(cb => cb.value);
    const statusFilters = checked.filter(v => ["On track", "Delayed", "Critical"].includes(v));
    const yearFilters = checked.filter(v => /^\d{4}$/.test(v)).map(Number);

    const today = new Date();

    const filtered = allProjects.filter(p => {
        const matchProject = !selectedProject || p.name === selectedProject;
        const matchLeader = !selectedLeader || p.projectLeaderId === selectedLeader;

        const startDate = new Date(p.start);
        const endDate = new Date(p.end);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        const isFinalized = finalizedStatuses.includes(p.statusId);
        const isExpired = endDate < today;
        const isOngoing = startDate <= today && endDate >= today;
        const isDelayed = isExpired && !isFinalized;

        const color = isDelayed ? "red" : (statusColorMap[p.statusId] || "gray");

        const matchStatus = !statusFilters.length || (
            (statusFilters.includes("On track") && color === "green" && isOngoing) ||
            (statusFilters.includes("Critical") && ["yellow", "red"].includes(color) && isOngoing) ||
            (statusFilters.includes("Delayed") && isDelayed)
        );

        const matchYear = !yearFilters.length || yearFilters.some(y => startYear <= y && endYear >= y);

        return matchProject && matchLeader && matchStatus && matchYear;
    });

    renderProjects(filtered);
}

/**
 * Füllt Dropdowns mit eindeutigen Projekt- und Leader-Namen.
 */
function populateDropdowns() {
    const projectSelect = document.getElementById('projectFilter');
    const leaderSelect = document.getElementById('leaderFilter');

    const projectNames = [...new Set(allProjects.map(p => p.name))].sort();
    const leaders = [...new Set(allProjects.map(p => p.projectLeaderId))].sort();

    projectNames.forEach(name => {
        projectSelect.insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`);
    });

    leaders.forEach(name => {
        leaderSelect.insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`);
    });
}
