const scenes = [

  {
    text:
      "Tom startet TimescaleDB ohne Volume. Die Datenbank läuft.",
    choices: [
      {
        label:
          "Weiterarbeiten",
        next: 1
      }
    ]
  },

  {
    text:
      "72 Stunden später: Ein Update steht an.",
    choices: [
      {
        label:
          "Container mit docker rm löschen",
        next: 2
      },

      {
        label:
          "Vorher Named Volume konfigurieren",
        next: 4
      }
    ]
  },

  {
    text:
      "Container gelöscht. Alle Sensordaten verschwunden.",
    choices: [
      {
        label:
          "Incident Report öffnen",
        next: 3
      }
    ]
  },

  {
    text:
      "Sarah meldet kritischen Datenverlust. Produktionsanalyse nicht mehr möglich.",
    choices: [
      {
        label:
          "Spiel neu starten",
        next: 0
      }
    ],
    ending: true,
    success: false
  },

  {
    text:
      "Named Volume eingerichtet: novatech-sensor-db",
    choices: [
      {
        label:
          "Container aktualisieren",
        next: 5
      }
    ]
  },

  {
    text:
      "Container entfernt und neu gestartet. Alle Daten sind noch vorhanden.",
    choices: [
      {
        label:
          "Backup konfigurieren",
        next: 6
      }
    ]
  },

  {
    text:
      "Wie möchtest du die Datenbank zusätzlich absichern?",
    choices: [
      {
        label:
          "Tägliche SQL-Dumps",
        next: 7
      },

      {
        label:
          "Gar keine Backups",
        next: 8
      }
    ]
  },

  {
    text:
      "Backup erfolgreich eingerichtet. NovaTech ist abgesichert.",
    choices: [
      {
        label:
          "Mission abschließen",
        next: 9
      }
    ],
    success: true
  },

  {
    text:
      "Festplattenausfall. Keine Wiederherstellung möglich.",
    choices: [
      {
        label:
          "Spiel neu starten",
        next: 0
      }
    ],
    ending: true,
    success: false
  },

  {
    text:
      "Erfolg! Daten überleben Updates UND Ausfälle.",
    choices: [],
    ending: true,
    success: true
  }

];

let currentScene = 0;

const story =
  document.getElementById("story");

const choices =
  document.getElementById("choices");

function renderScene() {

  const scene =
    scenes[currentScene];

  story.innerHTML = `
    <div class="story-line">
      ${scene.text}
    </div>
  `;

  choices.innerHTML = "";

  if (scene.success === true) {

    story.innerHTML += `
      <div class="success-banner">
        SUCCESS
      </div>
    `;
  }

  if (scene.success === false) {

    story.innerHTML += `
      <div class="failure-banner">
        DATA LOSS
      </div>
    `;
  }

  scene.choices.forEach(choice => {

    const button =
      document.createElement("button");

    button.className = "answer";

    button.textContent = choice.label;

    button.addEventListener("click", () => {

      currentScene = choice.next;

      renderScene();

    });

    choices.appendChild(button);

  });

}

renderScene();