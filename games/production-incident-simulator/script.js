const scenarios = [
  {
    text:
      "Der Processing-Container verbraucht plötzlich 14 GB RAM.",
    options: [
      {
        text: "Memory-Limits setzen",
        stability: +20,
        security: 0,
        availability: +10,
        feedback:
          "Richtig. Der Container wird begrenzt statt den ganzen Host zu zerstören."
      },
      {
        text: "Einfach mehr RAM kaufen",
        stability: -5,
        security: 0,
        availability: 0,
        feedback:
          "Das behandelt nur das Symptom, nicht das Problem."
      }
    ]
  },

  {
    text:
      "Logs wachsen auf 80 GB und die Festplatte läuft voll.",
    options: [
      {
        text: "Log-Rotation konfigurieren",
        stability: +10,
        security: 0,
        availability: +10,
        feedback:
          "Genau dafür sind max-size und max-file gedacht."
      },
      {
        text: "Logs komplett deaktivieren",
        stability: -10,
        security: -10,
        availability: +5,
        feedback:
          "Ohne Logs wird Debugging und Incident Response schwierig."
      }
    ]
  },

  {
    text:
      "Ein Angreifer kompromittiert einen Container.",
    options: [
      {
        text: "Read-only Filesystem + no-new-privileges",
        stability: +5,
        security: +20,
        availability: 0,
        feedback:
          "Das reduziert die Angriffsfläche deutlich."
      },
      {
        text: "Container als Root laufen lassen",
        stability: 0,
        security: -25,
        availability: 0,
        feedback:
          "Root-Container erhöhen das Risiko massiv."
      }
    ]
  },

  {
    text:
      "NovaTech möchte auf drei Server skalieren.",
    options: [
      {
        text: "Kubernetes evaluieren",
        stability: +10,
        security: +5,
        availability: +15,
        feedback:
          "Compose ist für Single-Host gedacht. Kubernetes löst Multi-Host-Probleme."
      },
      {
        text: "Weiter nur Docker Compose nutzen",
        stability: -10,
        security: 0,
        availability: -15,
        feedback:
          "Compose skaliert schlecht über mehrere Hosts."
      }
    ]
  }
];

let currentScenario = 0;

let stability = 50;
let security = 50;
let availability = 50;

function updateStats() {

  document.getElementById("stabilityValue")
    .textContent = stability;

  document.getElementById("securityValue")
    .textContent = security;

  document.getElementById("availabilityValue")
    .textContent = availability;

}

function renderScenario() {

  const scenario =
    scenarios[currentScenario];

  document.getElementById("scenarioBox")
    .innerHTML = `
      <div class="question">
        ${scenario.text}
      </div>
    `;

  document.getElementById("decisionGrid")
    .innerHTML =
      scenario.options.map((option, index) => `
        <button class="answer decision-btn" data-index="${index}">
          ${option.text}
        </button>
      `).join("");

  document.querySelectorAll(".decision-btn")
    .forEach(button => {

      button.addEventListener("click", () => {

        const option =
          scenario.options[
            Number(button.dataset.index)
          ];

        stability += option.stability;
        security += option.security;
        availability += option.availability;

        updateStats();

        document.getElementById("feedback")
          .innerHTML = `
            <div class="ch-card">
              <p>${option.feedback}</p>
            </div>
          `;

        currentScenario++;

        setTimeout(() => {

          if (currentScenario < scenarios.length) {

            renderScenario();

          } else {

            endGame();

          }

        }, 1800);

      });

    });

}

function endGame() {

  document.getElementById("scenarioBox")
    .innerHTML = `
      <div class="ch-card">

        <h2>Go-Live abgeschlossen</h2>

        <p>
          NovaTechs Plattform wurde produktionsreif abgesichert.
        </p>

      </div>
    `;

  document.getElementById("decisionGrid")
    .innerHTML = "";

}

updateStats();
renderScenario();