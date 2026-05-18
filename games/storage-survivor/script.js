const scenarios = [
  {
    title: "Datenbank-Deployment",
    text:
      "Tom deployt PostgreSQL als normales Deployment mit replicas: 3.",
    choices: [
      {
        text: "Deployment mit 3 Replicas behalten",
        effect: {
          data: -40,
          uptime: +10,
          cost: -10
        },
        result:
          "PostgreSQL repliziert nicht automatisch. Mehrere Pods mit getrennten Daten führen zu Inkonsistenzen."
      },
      {
        text: "StatefulSet mit dediziertem Storage verwenden",
        effect: {
          data: +20,
          uptime: +10,
          cost: -5
        },
        result:
          "Richtig. StatefulSets geben jedem Pod stabile Identität und eigenen Storage."
      }
    ]
  },

  {
    title: "Storage auswählen",
    text:
      "Der PostgreSQL-Pod speichert Daten aktuell im Container-Filesystem.",
    choices: [
      {
        text: "Ephemeral Storage behalten",
        effect: {
          data: -50,
          uptime: 0,
          cost: +5
        },
        result:
          "Nach Pod-Neustarts gehen die Daten verloren."
      },
      {
        text: "PersistentVolumeClaim verwenden",
        effect: {
          data: +25,
          uptime: +10,
          cost: -10
        },
        result:
          "Der Storage überlebt Pod-Restarts."
      }
    ]
  },

  {
    title: "reclaimPolicy",
    text:
      "Die Produktionsdatenbank soll vor versehentlichem Löschen geschützt werden.",
    choices: [
      {
        text: "reclaimPolicy: Delete",
        effect: {
          data: -30,
          uptime: 0,
          cost: +10
        },
        result:
          "Beim Löschen des PVC könnten auch die Daten verschwinden."
      },
      {
        text: "reclaimPolicy: Retain",
        effect: {
          data: +20,
          uptime: +5,
          cost: -10
        },
        result:
          "Sicherer für Produktionsdaten, aber erzeugt mögliche Storage-Leichen."
      }
    ]
  },

  {
    title: "Backups",
    text:
      "Wie schützt NovaTech sich vor fehlerhaften Anwendungen oder versehentlichem Löschen?",
    choices: [
      {
        text: "Keine Backups, PVC reicht",
        effect: {
          data: -40,
          uptime: -10,
          cost: +10
        },
        result:
          "PVC schützt nur vor Pod-Verlust, nicht vor logischen Fehlern."
      },
      {
        text: "pg_dump + Volume Snapshots kombinieren",
        effect: {
          data: +30,
          uptime: +15,
          cost: -15
        },
        result:
          "Best Practice: logische UND Storage-basierte Backups."
      }
    ]
  }
];

let current = 0;

let scores = {
  data: 100,
  uptime: 100,
  cost: 100
};

function updateScores() {
  document.getElementById("dataScore").textContent =
    scores.data;

  document.getElementById("uptimeScore").textContent =
    scores.uptime;

  document.getElementById("costScore").textContent =
    scores.cost;
}

function renderScenario() {

  const scenario = scenarios[current];

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>${scenario.title}</h2>
      <p>${scenario.text}</p>
    </div>
  `;

  const choicesBox = document.getElementById("choices");

  choicesBox.innerHTML = "";

  scenario.choices.forEach(choice => {

    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = choice.text;

    button.onclick = () => handleChoice(choice);

    choicesBox.appendChild(button);

  });

}

function handleChoice(choice) {

  scores.data += choice.effect.data;
  scores.uptime += choice.effect.uptime;
  scores.cost += choice.effect.cost;

  updateScores();

  document.getElementById("feedback").innerHTML = `
    <div class="ch-card">
      <p>${choice.result}</p>
    </div>
  `;

  current++;

  if (current < scenarios.length) {

    setTimeout(() => {
      renderScenario();
    }, 1600);

  } else {

    setTimeout(showFinal, 1600);

  }
}

function showFinal() {

  let result = "";

  if (scores.data >= 120) {
    result =
      "NovaTechs Datenbank ist produktionsreif abgesichert.";
  } else if (scores.data >= 80) {
    result =
      "Die Plattform läuft, aber die Storage-Strategie hat Risiken.";
  } else {
    result =
      "Produktionsvorfall: Datenverlust bei NovaTech.";
  }

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>Simulation abgeschlossen</h2>

      <p>${result}</p>

      <h3>Merksätze</h3>

      <ul>
        <li>Deployments sind für stateless Workloads.</li>
        <li>StatefulSets geben stabile Identitäten.</li>
        <li>PVCs machen Storage persistent.</li>
        <li>Backups bleiben trotzdem Pflicht.</li>
      </ul>
    </div>
  `;

  document.getElementById("choices").innerHTML = "";
}

updateScores();
renderScenario();