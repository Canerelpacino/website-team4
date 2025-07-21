# 🔵 Blue Ant API Webanwendung

## 📘 Projektbeschreibung

Dieses Projekt ist eine Webanwendung, die über die REST-API von **Blue Ant** Daten abruft und im Browser anzeigt. Ziel ist es, Projektdaten wie Aufgaben, Ressourcen oder Status übersichtlich und dynamisch darzustellen.
Es soll eine informative Webseite entwickelt werden, welche eine umfassende Liste aller aktiven Projekte in BlueAnt bereitstellt, wobei definierte Daten angezeigt werden.

# Anforderung - Prio. 1: Projektlistenansicht
Die Webseite soll eine vorgefilterte Projektliste anzeigen, die folgende Datenfelder für jedes Projekt umfasst: den Projektnamen, die Laufzeit, den Projektstatus, den Projektleiter, den Gegenstand oder die Zielsetzung des Projekts, den Inhalt eines individuellen Textfeldes, den Inhalt einer individuellen Listbox, den Inhalt eines individuell berechneten Feldes sowie einen Link zur Einzel- oder Detailansicht des jeweiligen Projekts.

# Anforderung - Prio. 2: Einzelprojektansicht
Zusätzlich zur Projektliste soll eine Einzelansicht für jedes Projekt erstellt werden, die vordefinierte Daten anzeigt. Diese Einzelansicht soll die folgenden Informationen enthalten: den Projektnamen, die Laufzeit, den Projektstatus, den Projektleiter, die Zielsetzung, den Inhalt eines individuellen Textfeldes, den Inhalt einer individuellen Listbox, den Inhalt eines individuell berechneten Feldes sowie eine Liste der Meilensteine. Die Einzelansicht muss zudem über einen Direktlink aufrufbar sein. Diese Einzelansicht soll die folgenden Informationen enthalten: den Projektnamen, die Laufzeit, den Projektstatus, den Projektleiter, die Zielsetzung, den Inhalt eines individuellen Textfeldes, den Inhalt einer individuellen Listbox, den Inhalt eines individuell berechneten Feldes sowie eine Liste der Meilensteine. Die Einzelansicht muss zudem über einen Direktlink aufrufbar sein.
Darüber hinaus sollen für grafische Informationen wie Projektstatusampeln geeignete visuelle Darstellungsformen implementiert werden. Die Projektstatuswerte (z. B. „im Plan“, „verzögert“, „kritisch“) sollen farblich differenziert (z. B. grün, gelb, rot) und eindeutig erkennbar angezeigt werden.

# Anforderung - Prio. 3: Backend-Filter
Es soll eine Backendseite entwickelt werden, die die Filterung der Projekte nach Status, Projekttyp und Unternehmensbereich ermöglicht. Die Filter sollen im Backend editierbar sein, um eine flexible Anpassung der angezeigten Projektinformationen zu gewährleisten.


Die Anwendung wird mit **HTML**, **CSS** und **JavaScript** umgesetzt.

---

## 🎯 Ziele

- Abruf von Projektdaten über die Blue Ant REST API
- Speicherung & Transformation der Daten im Backend
- Anzeige im responsiven Frontend
- Darstellung von Zusatzfeldern & Statusampeln
- Erweiterbarkeit durch Filterlogik

---

## ⚙️ Technologiestack

| Bereich    | Technologie        |
|------------|--------------------|
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Node.js, Express      |
| API        | Blue Ant REST API     |
| Tools      | dotenv, axios, cors, morgan |

---


## 🗂️ Projektstruktur


```plaintext
Projekt/
├── backend/                   # Serverseitige Datenlogik
│   ├── customer_data.json              # API: Kundendaten
│   ├── project_data.json               # API: Rohdaten aller Projekte
│   ├── final_data.json                 # Transformierte Projektliste für Frontend
│   ├── customfields_structor.json      # Struktur der Custom Fields
│   ├── projectStatusHistory.json       # Meilenstein-/Statusverlauf eines Projekts
│   ├── dataManagement.js               # Logik zur Datenbearbeitung & Mappings
│   ├── dashboard.js                    # JS-Funktionalität für Dashboardseite
│   ├── details.js                      # JS für die Projekt-Detailseite
│   └── server.js                       # Hauptserver mit API-Endpunkten

├── frontend/                 # Benutzeroberfläche
│   ├── Bilder/                         # Logos & Profilbilder
│   │   ├── blueant.png
│   │   ├── BlueShark.png
│   │   ├── furkanbild.png
│   │   └── profilbild.png
│   │
│   ├── StylesCSS/                     # Zentrales Styling
│   │   └── style.css
│   │
│   ├── index.html                     # Projektübersicht
│   ├── About.html                     # Über uns / Projektbeschreibung
│   └── project.html                   # Einzelprojektansicht
Projekt/
├── backend/                   # Serverseitige Datenlogik
│   ├── customer_data.json              # API: Kundendaten
│   ├── project_data.json               # API: Rohdaten aller Projekte
│   ├── final_data.json                 # Transformierte Projektliste für Frontend
│   ├── customfields_structor.json      # Struktur der Custom Fields
│   ├── projectStatusHistory.json       # Meilenstein-/Statusverlauf eines Projekts
│   ├── dataManagement.js               # Logik zur Datenbearbeitung & Mappings
│   ├── dashboard.js                    # JS-Funktionalität für Dashboardseite
│   ├── details.js                      # JS für die Projekt-Detailseite
│   └── server.js                       # Hauptserver mit API-Endpunkten

├── frontend/                 # Benutzeroberfläche
│   ├── Bilder/                         # Logos & Profilbilder
│   │   ├── blueant.png
│   │   ├── BlueShark.png
│   │   ├── furkanbild.png
│   │   └── profilbild.png
│   │
│   ├── StylesCSS/                     # Zentrales Styling
│   │   └── style.css
│   │
│   ├── index.html                     # Projektübersicht
│   ├── About.html                     # Über uns / Projektbeschreibung
│   └── project.html                   # Einzelprojektansicht
```

# to do´s um den Webserver zu starten
## 1. **Node.js (lts)** muss installiert werden  
(https://nodejs.org/en)
## 2. Neues Node.js-Projekt initialisieren
```bash 
  npm init -y
```
## 3. Abhängigkeiten installieren
```bash 
  npm install express axios
```
```bash 
  npm install dotenv cors morgan
```
## 4. Webserver starten
```bash
    node backend/server.js
```
## 5. Webseite öffnen

Rufe http://localhost:3000 im Browser auf, um die Webanwendung live zu betrachten.