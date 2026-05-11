const cases = [
  {
    problem:
      "Sensor-Ingestion startet, bevor der Datenbank-Container überhaupt gestartet wurde.",
    answers: [
      "depends_on",
      "volumes",
      "ports",
      "docker compose down -v"
    ],
    correct: 0,
    explanation:
      "depends_on beschreibt Startabhängigkeiten zwischen Services."
  },

  {
    problem:
      "Die Datenbank ist gestartet, nimmt aber noch keine Verbindungen an.",
    answers: [
      "Nur ports verwenden",
      "Healthcheck + depends_on condition: service_healthy",
      "Den DB-Port öffentlich freigeben",
      "docker compose logs löschen"
    ],
    correct: 1,
    explanation:
      "Ein Healthcheck prüft, ob die DB wirklich bereit ist. depends_on allein reicht dafür nicht."
  },

  {
    problem:
      "Passwörter sollen nicht direkt in der docker-compose.yml stehen.",
    answers: [
      ".env-Datei und Variablen wie ${DB_PASSWORD}",
      "Port-Mapping",
      "container_name",
      "docker compose ps"
    ],
    correct: 0,
    explanation:
      "Secrets und Passwörter sollten über Umgebungsvariablen oder .env-Dateien eingebunden werden."
  },

  {
    problem:
      "Ein Service soll nach einem Absturz automatisch wieder starten.",
    answers: [
      "restart: unless-stopped",
      "EXPOSE",
      "build: false",
      "network_mode: none"
    ],
    correct: 0,
    explanation:
      "restart: unless-stopped ist eine passende Policy für dauerhaft laufende Services."
  },

  {
    problem:
      "Nina möchte Container stoppen, aber Datenbankdaten behalten.",
    answers: [
      "docker compose down",
      "docker compose down -v",
      "docker volume prune",
      "docker compose rm -v"
    ],
    correct: 0,
    explanation:
      "docker compose down entfernt Container und Netzwerke, aber nicht die benannten Volumes. down -v würde Volumes löschen."
  }
];

let currentCase = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

const caseBox =
  document.getElementById("caseBox");

const feedback =
  document.getElementById("feedback");

const nextBtn =
  document.getElementById("nextBtn");

const progressBar =
  document.getElementById("progressBar");

function updateProgress() {

  const progress =
    (currentCase / cases.length) * 100;

  progressBar.style.width =
    `${progress}%`;

}

function renderCase() {

  selectedAnswer = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const current =
    cases[currentCase];

  caseBox.innerHTML = `
    <div class="ch-card case-card">

      <h2>Diagnosefall ${currentCase + 1}</h2>

      <p>${current.problem}</p>

    </div>

    <div class="answer-grid">

      ${current.answers.map((answer, index) => `
        <button class="answer" data-index="${index}">
          ${answer}
        </button>
      `).join("")}

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

  const current =
    cases[currentCase];

  if (selectedAnswer === null) {

    feedback.innerHTML =
      "Bitte wähle zuerst eine Lösung aus.";

    return;

  }

  if (!answered) {

    answered = true;

    document.querySelectorAll(".answer")
      .forEach(button => {

        const index =
          Number(button.dataset.index);

        if (index === current.correct) {
          button.classList.add("correct");
        }

        if (
          index === selectedAnswer &&
          index !== current.correct
        ) {
          button.classList.add("wrong");
        }

      });

    if (selectedAnswer === current.correct) {

      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Richtig diagnostiziert!</h3>
          <p>${current.explanation}</p>
        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Nicht ganz.</h3>
          <p>${current.explanation}</p>
        </div>
      `;

    }

    nextBtn.textContent =
      currentCase === cases.length - 1
        ? "Ergebnis anzeigen"
        : "Nächster Fall";

    return;

  }

  currentCase++;

  if (currentCase < cases.length) {

    renderCase();

  } else {

    progressBar.style.width = "100%";

    caseBox.innerHTML = `
      <div class="ch-card">

        <h2>Diagnose abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${cases.length}</strong> Fällen richtig gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          Compose beschreibt die gewünschte Multi-Container-Umgebung
          deklarativ. Für echte Startbereitschaft brauchst du
          Healthchecks, nicht nur eine Startreihenfolge.
        </p>

      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";

  }

});

renderCase();