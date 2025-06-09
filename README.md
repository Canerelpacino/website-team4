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

- Aufbau einer API-Verbindung zur Blue Ant Plattform
- Abrufen und Anzeigen von Projektdaten im Frontend
- Nutzerfreundliches UI mit responsivem Design

---

## ⚙️ Technologiestack

- **HTML**
- **CSS**
- **JavaScript**
- **Node.js**
- **API**: REST (Blue Ant API)


---


## 🗂️ Projektstruktur

**Projekt**/  
├── **backend**/ # Backend-Logik & Datenverarbeitung  
│ ├── customer_data.json # Rohdaten von Kundendaten (von API)  
│ ├── project_data.json # Rohdaten von Projekten (von API)  
│ ├── final_data.json # Transformierte Projektdaten (bereit fürs Frontend)  
│ ├── dataManagement.js # Transformationslogik für Projektdaten  
│ └── server.js # Express-Server (Webserver) + API-Routing  
│  
├── **frontend**/ # Benutzeroberfläche  
│ ├── Bilder/ # Alle Bilddateien  
│ │ ├── blueant.png  
│ │ ├── BlueShark.png # Logo mit Hai  
│ │ ├── furkanbild.png # Teammitglied-Bild  
│ │ └── profilbild.png # Platzhalterbild  
│ │  
│ ├── StylesCSS/ # Zentrales CSS-Styling  
│ │ └── style.css  
│ │  
│ ├── index.html # Startseite mit Projektübersicht  
│ ├── About.html # Team- & Projektbeschreibung  
│ └── project.html # Detailseite eines Projekts  

- Der `backend/`-Ordner ruft und verarbeitet die Daten von der BlueAnt-REST-API.
- Das `frontend/` liest die transformierten Daten aus `/api/final-data`.
- Bilder und Logos befinden sich im `frontend/Bilder/`-Verzeichnis.
- Das CSS befindet sich zentral in `frontend/StylesCSS/style.css`.

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