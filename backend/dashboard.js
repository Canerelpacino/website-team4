// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initSearch();
    initStatusButtons();
    fetchProjects();
});

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

const statusColorMap = {
    "A1 - Anfrage/Idee": "green", "C1 - Umsetzung": "green", "B3 - Planung (Gate 1)": "green",
    "Z2 - Abgeschlossen": "green", "B2 - Auftragsklärung (Gate 1)": "green",
    "B5 - Genehmigt (Gate 2)": "green", "B4 - Empfohlen (Gate 1)": "green",
    "A2 - Bewertung (Gate 0)": "green", "B1 - Initiierung (Gate 1)": "green",
    "E1 - Abschluss": "yellow", "C2 - Abnahme": "yellow", "F1 - Revision": "yellow",
    "Z1 - Gestoppt/Zurückgestellt": "red", "Z3 - Abgelehnt": "red"
};

const finalizedStatuses = ["Z1 - Gestoppt/Zurückgestellt", "E1 - Abschluss", "C2 - Abnahme", "Z3 - Abgelehnt", "Z2 - Abgeschlossen"];

let allProjects = [];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

function fetchProjects() {
    fetch('/api/final-data')
        .then(res => res.json())
        .then(data => {
            allProjects = data.projects || [];
            populateDropdowns();
            renderProjects(allProjects);
        });
}

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

function initStatusButtons() {
    document.querySelectorAll(".status-buttons button").forEach(button => {
        button.addEventListener("click", () => toggleStatus(button));
    });
}

function toggleStatus(button) {
    const status = button.dataset.status;
    const title = document.getElementById("dashboardTitle");
    const isActive = button.classList.toggle("active");

    document.querySelectorAll(".status-buttons button").forEach(btn => {
        if (btn !== button) btn.classList.remove("active");
    });

    title.textContent = isActive ? button.textContent : "Project Dashboard";
    const group = statusGroups[status];
    renderProjects(isActive ? allProjects.filter(p => group.includes(p.statusId)) : allProjects);
}

function renderProjects(projects) {
    const container = document.getElementById('projectCards');
    container.innerHTML = '';
    const today = new Date();
    // sortierung
    projects.sort((a, b) => new Date(b.end) - new Date(a.end));

    projects.forEach(p => {
        const isExpired = new Date(p.end) < today;
        const isFinalized = finalizedStatuses.includes(p.statusId);
        const color = (isExpired && !isFinalized) ? "red" : (statusColorMap[p.statusId] || "gray");

        container.insertAdjacentHTML('beforeend', `
            <a href="project.html?number=${p.number}" class="card-link">
                <div class="card">
                    <div class="card-header">
                        <strong>${p.number || '-'}</strong><br />
                        Projektleiter: ${escapeHTML(p.projectLeaderId)}<br />
                        Status: ${escapeHTML(p.statusId)}<br />
                        Projektart: ${escapeHTML(p.typeId)}<br />
                        Priorität: ${escapeHTML(p.priorityId)}
                    </div>
                    <div class="card-title">${escapeHTML(p.name)}</div>
                    <div class="card-footer">${formatDate(p.start)} - ${formatDate(p.end)}</div>
                    <div class="progress-bar" style="background-color: ${color};"></div>
                </div>
            </a>
        `);
    });
}

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
        const startYear = new Date(p.start).getFullYear();
        const endYear = new Date(p.end).getFullYear();
        const startDate = new Date(p.start);
        const endDate = new Date(p.end);
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

function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
