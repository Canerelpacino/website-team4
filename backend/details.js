const statusIdMap = {
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

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}


console.log("📦 detail.js geladen");

// ==============================
// Statusfarben
// ==============================

const statusColorMap = {
    "A1 - Anfrage/Idee": "green", "C1 - Umsetzung": "green", "Z1 - Gestoppt/Zurückgestellt": "red",
    "E1 - Abschluss": "yellow", "B3 - Planung (Gate 1)": "green", "C2 - Abnahme": "yellow",
    "Z2 - Abgeschlossen": "green", "F1 - Revision": "yellow", "B2 - Auftragsklärung (Gate 1)": "green",
    "B5 - Genehmigt (Gate 2)": "green", "B4 - Empfohlen (Gate 1)": "green", "Z3 - Abgelehnt": "red",
    "A2 - Bewertung (Gate 0)": "green", "B1 - Initiierung (Gate 1)": "green"
};



// ==============================
// 🔍 Suche mit Dropdown
// ==============================
function setupSearchDropdown(projects) {
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    document.body.appendChild(dropdown);

    searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        dropdown.innerHTML = "";

        if (query.length > 0) {
            const filtered = projects.filter(p => p.name.toLowerCase().includes(query));
            filtered.forEach(project => {
                const option = document.createElement("div");
                option.className = "dropdown-item";
                option.textContent = project.name;
                option.onclick = () => window.location.href = `project.html?number=${project.number}`;
                dropdown.appendChild(option);
            });
            dropdown.style.display = filtered.length ? "block" : "none";
        } else {
            dropdown.style.display = "none";
        }
    });

    document.addEventListener("click", e => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}

// ==============================
// 📄 Projektdetails laden
// ==============================
function loadProjectDetails(data) {
    const finalizedStatuses = [
        "Z2 - Abgeschlossen",
        "Z1 - Gestoppt/Zurückgestellt",
        "Z3 - Abgelehnt",
        "E1 - Abschluss"
    ];

    const params = new URLSearchParams(window.location.search);
    const projectNumber = params.get("number");

    if (!projectNumber) {
        console.warn("❌ Kein projectNumber in der URL gefunden.");
        return;
    }

    const project = data.projects.find(p => p.number === projectNumber);
    if (!project) {
        console.error("❌ Projekt nicht gefunden:", projectNumber);
        return;
    }
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectTitle').textContent = project.name;
    document.getElementById('projectNumber').textContent = project.number;
    document.getElementById('projectLeader').textContent = project.projectLeaderId;
    document.getElementById('projectType').textContent = project.typeId;
    document.getElementById('projectStatus').textContent = project.statusId;
    document.getElementById('projectStart').textContent = formatDate(project.start);
    document.getElementById('projectEnd').textContent = formatDate(project.end);
    document.getElementById('projectPriority').textContent = project.priorityId;

    const today = new Date();
    const startDate = new Date(project.start);
    const endDate = new Date(project.end);
    const isValid = today >= startDate && today <= endDate;
    const isStopped = project.statusId.includes("Gestoppt") || project.statusId.includes("Zurückgestellt");
    const color = statusColorMap[project.statusId] || "gray";
    const id = project.id;
    const inProgressBtn = document.getElementById('inProgressBtn');
    const onTrackBtn = document.getElementById('onTrackBtn');

    const isFinalized = finalizedStatuses.includes(project.statusId);

// In-Progress Button (z. B. grün)
    if (color === "green" && !isFinalized) {
        inProgressBtn.classList.add("button-active");
    } else if (color === "yellow") {
        inProgressBtn.style.backgroundColor = "gold";
        inProgressBtn.style.color = "#000";
    } else {
        inProgressBtn.classList.add("button-inactive");
    }


    if (isValid && !isStopped) {
        onTrackBtn.classList.add("button-active");
    } else {
        onTrackBtn.classList.add("button-inactive");
    }

    // Meilensteine entfernt
    // API-Abruf entfernt
}

// ==============================
// 🟢 Initialisierung
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/final-data')
        .then(res => res.json())
        .then(data => {
            if (!data.projects || !Array.isArray(data.projects)) {
                throw new Error("Projektdaten fehlen oder sind ungültig");
            }
            loadProjectDetails(data);
            setupSearchDropdown(data.projects);
            const params = new URLSearchParams(window.location.search);
            const projectNumber = params.get("number");

            if (!projectNumber) {
                console.warn("❌ Kein projectNumber in der URL gefunden.");
                return;
            }

            const project = data.projects.find(p => p.number === projectNumber);
            if (!project) {
                console.error("❌ Projekt nicht gefunden:", projectNumber);
                return;
            }
            requestStatusHistory(project.id)
            showStatusHistory()
        })
        .catch(err => console.error("❌ Fehler bei Projektinitialisierung:", err));
});

function requestStatusHistory(projectId) {
    fetch(`/api/get-history/${projectId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log(`📦 Statushistorie gespeichert unter ${data.path}`);
            } else {
                console.warn("⚠️ API-Antwort ohne Erfolg:", data);
            }
        })
        .catch(err => {
            console.error("❌ Fehler beim Abruf der Statushistorie:", err.message);
        });
}

function showStatusHistory() {
    fetch('/backend/projectStatusHistory.json')
        .then(res => {
            if (!res.ok) throw new Error("⚠️ Statusverlauf konnte nicht geladen werden.");
            return res.json();
        })
        .then(json => {
            const history = json.projectStatusHistory || [];
            const list = history.map(entry => {
                const statusText = statusIdMap[entry.newStatusId] || `Status-ID ${entry.newStatusId}`;
                const date = formatDate(entry.date);
                return `<li>${date} – ${statusText}</li>`;
            }).join("");

            document.getElementById("milestoneList").innerHTML = list || "<li>Keine Statushistorie verfügbar.</li>";
        })
        .catch(err => {
            console.error("❌ Fehler beim Anzeigen der Statushistorie:", err);
            document.getElementById("milestoneList").innerHTML = "<li>Fehler beim Laden der Meilensteine.</li>";
        });
}


