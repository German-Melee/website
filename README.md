# German Melee Website

Website für die deutsche Super Smash Bros. Melee Szene.

## Lokale Entwicklung

Event-Daten werden beim Build von Google Sheets geladen.

1. **Google Sheets konfigurieren:**

   Klone ein bestehendes Google Spreadsheet (wenn du den Link zu einem hast) oder erstelle ein Google Spreadsheet mit einem Sheet namens "Turniere". Siehe [src/\_data/events.js](src/_data/events.js) und [src/index.njk](src/index.njk) für die erwartete Spaltenstruktur.
   Wichtig: Das Google Sheet muss auf "Jeder der über den Link verfügt" gestellt sein, damit man per API Key dadrauf zugreifen kann.

   API-Zugangsdaten erstellen:
   - [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) aktivieren
   - [API Key](https://console.cloud.google.com/apis/credentials) erstellen
   - Spreadsheet ID aus der Sheet-URL kopieren

3. **Umgebungsvariablen setzen:**
   - `cp .env.example .env`
   - `.env` ausfüllen

4. `npm install`
5. `npm run dev`
