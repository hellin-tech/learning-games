const missions = [
  {
    title: "TimescaleDB Produktionsdaten",
    description:
      "Die Sensordaten müssen Container-Updates überleben.",
    options: [
      "tmpfs",
      "Named Volume",
      "Bind-Mount",
      "Kein Speicher"
    ],
    correct: 1,
    explanation:
      "Datenbanken sollten in Named Volumes gespeichert werden."
  },

  {
    title: "Lokaler Quellcode in Entwicklung",
    description:
      "Code soll live im Container aktualisiert werden.",
    options: [
      "Bind-Mount",
      "tmpfs",
      "Named Volume",
      "Kein Speicher"
    ],
    correct: 0,
    explanation:
      "Bind-Mounts sind ideal für Entwicklung und Live-Reload."
  },

  {
    title: "JWT Session Tokens",
    description:
      "Temporäre Secrets sollen niemals auf Festplatte landen.",
    options: [
      "Named Volume",
      "Bind-Mount",
      "tmpfs",
      "Dockerfile Layer"
    ],
    correct: 2,
    explanation:
      "tmpfs speichert Daten nur im RAM."
  },

  {
    title: "nginx Reverse Proxy",
    description:
      "Container speichert keine wichtigen Daten.",
    options: [
      "Named Volume",
      "Bind-Mount",
      "tmpfs",
      "Kein persistenter Speicher nötig"
    ],
    correct: 3,
    explanation:
      "Stateless Services brauchen oft keine Persistenz."
  }
];

let currentMission = 0;
let selectedAnswer = null;
let score = 0;
let answered = false;

const missionContainer =
  document.getElementById("missionContainer");

const feedback =
  document.getElementById("feedback");

const nextBtn =
  document.getElementById("nextBtn");

function renderMission() {

  selectedAnswer = null;
  answered = false;

  feedback.innerHTML = "";

  const mission =
    missions[currentMission];

  missionContainer.innerHTML = `
    <div class="mission-card">

      <h2>${mission.title}</h2>

      <p>${mission.description}</p>

      <div class="answer-grid">

        ${mission.options.map((option, index) => `
          <button class="answer" data-index="${index}">
            ${option}
          </button>
        `).join("")}

      </div>

    </div>
  `;

  document.querySelectorAll(".answer")
    .forEach(button => {

      button.addEventListener("click", () => {

        if (answered) return;

        document.querySelectorAll(".answer")
          .forEach(btn =>
            btn.classList.remove("selected")
          );

        button.classList.add("selected");

        selectedAnswer =
          Number(button.dataset.index);

      });

    });

}

nextBtn.addEventListener("click", () => {

  const mission =
    missions[currentMission];

  if (selectedAnswer === null) {

    feedback.innerHTML =
      "Bitte zuerst eine Antwort auswählen.";

    return;
  }

  if (!answered) {

    answered = true;

    document.querySelectorAll(".answer")
      .forEach(button => {

        const index =
          Number(button.dataset.index);

        if (index === mission.correct) {
          button.classList.add("correct");
        }

        if (
          index === selectedAnswer &&
          index !== mission.correct
        ) {
          button.classList.add("wrong");
        }

      });

    if (selectedAnswer === mission.correct) {

      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Richtig!</h3>
          <p>${mission.explanation}</p>
        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Nicht ganz.</h3>
          <p>${mission.explanation}</p>
        </div>
      `;

    }

    nextBtn.textContent =
      currentMission === missions.length - 1
        ? "Ergebnis anzeigen"
        : "Nächste Mission";

    return;
  }

  currentMission++;

  if (currentMission < missions.length) {

    renderMission();

  } else {

    missionContainer.innerHTML = `
      <div class="ch-card">

        <h2>Mission abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${missions.length}</strong>
          Missionen erfolgreich gelöst.
        </p>

      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";

  }

});

renderMission();