const scenarios = [
  {
    question:
      "Eine CRITICAL-CVE wurde im Base-Image entdeckt. Was sollte zuerst passieren?",
    answers: [
      "Die Warnung ignorieren",
      "Alle betroffenen Images neu bauen und scannen",
      "Container einfach neu starten",
      "Nur das Frontend aktualisieren"
    ],
    correct: 1,
    explanation:
      "Die betroffenen Images müssen mit gepatchtem Base-Image neu gebaut werden."
  },

  {
    question:
      "Warum ist :latest problematisch in der Produktion?",
    answers: [
      "Es ist langsamer",
      "latest ist nicht reproduzierbar und mutable",
      "latest funktioniert nicht mit Docker Compose",
      "latest kann keine Ports öffnen"
    ],
    correct: 1,
    explanation:
      "latest kann sich jederzeit ändern. Deployments werden dadurch unvorhersehbar."
  },

  {
    question:
      "Was prüft Cosign beim Deployment?",
    answers: [
      "RAM-Verbrauch",
      "Port-Mappings",
      "Image-Authentizität und Integrität",
      "Docker-Netzwerke"
    ],
    correct: 2,
    explanation:
      "Cosign verifiziert kryptographische Signaturen."
  },

  {
    question:
      "Was passiert typischerweise bei einem Trivy-Scan?",
    answers: [
      "Docker startet neue Container",
      "CVE-Datenbanken werden mit installierten Paketen verglichen",
      "Volumes werden gelöscht",
      "Container werden automatisch deployed"
    ],
    correct: 1,
    explanation:
      "Scanner vergleichen Paketversionen mit bekannten Schwachstellen."
  },

  {
    question:
      "Welche Tagging-Strategie ist für Produktion sinnvoll?",
    answers: [
      "Nur :latest",
      "Nur Zufallsnamen",
      "Semantic Versioning + Git-SHA",
      "Container-IP-Adressen"
    ],
    correct: 2,
    explanation:
      "Semantic Versions sind nachvollziehbar, Git-SHAs bieten Traceability."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const scenarioBox =
  document.getElementById("scenarioBox");

const feedback =
  document.getElementById("feedback");

const nextBtn =
  document.getElementById("nextBtn");

const progressBar =
  document.getElementById("progressBar");

function updateProgress() {

  const progress =
    (current / scenarios.length) * 100;

  progressBar.style.width =
    `${progress}%`;

}

function renderScenario() {

  selected = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const scenario =
    scenarios[current];

  scenarioBox.innerHTML = `
    <div class="question">
      ${current + 1}. ${scenario.question}
    </div>

    ${scenario.answers.map((answer, index) => `
      <button class="answer" data-index="${index}">
        ${answer}
      </button>
    `).join("")}
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

        selected =
          Number(button.dataset.index);

      });

    });

}

nextBtn.addEventListener("click", () => {

  const scenario =
    scenarios[current];

  if (selected === null) {

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

        if (index === scenario.correct) {
          button.classList.add("correct");
        }

        if (
          index === selected &&
          index !== scenario.correct
        ) {
          button.classList.add("wrong");
        }

      });

    if (selected === scenario.correct) {

      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">

          <h3>Richtige Incident-Reaktion!</h3>

          <p>${scenario.explanation}</p>

        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">

          <h3>Problem erkannt — aber falsche Reaktion.</h3>

          <p>${scenario.explanation}</p>

        </div>
      `;

    }

    nextBtn.textContent =
      current === scenarios.length - 1
        ? "Ergebnis anzeigen"
        : "Nächster Vorfall";

    return;

  }

  current++;

  if (current < scenarios.length) {

    renderScenario();

  } else {

    progressBar.style.width = "100%";

    scenarioBox.innerHTML = `
      <div class="ch-card">

        <h2>Incident abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${scenarios.length}</strong>
          Sicherheitsvorfällen korrekt gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          Sichere Container-Distribution bedeutet:
          private Registry, reproduzierbare Tags,
          automatisches CVE-Scanning
          und signierte Images.
        </p>

      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";

  }

});

renderScenario();