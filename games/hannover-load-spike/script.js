const scenarios = [
  {
    title: "500 Sensoren senden gleichzeitig Daten",
    text:
      "Die API-CPU steigt auf 92%. Tom möchte automatisch zusätzliche Pods starten lassen.",
    choices: [
      {
        text: "HorizontalPodAutoscaler konfigurieren",
        stability: +10,
        visibility: 0,
        scaling: +30,
        feedback:
          "Richtig. Der HPA skaliert Deployments basierend auf Metriken."
      },
      {
        text: "Manuell alle 10 Minuten kubectl scale ausführen",
        stability: -10,
        visibility: 0,
        scaling: +5,
        feedback:
          "Manuell skaliert zu langsam und ist fehleranfällig."
      }
    ]
  },

  {
    title: "HPA zeigt unknown metrics",
    text:
      "Der HPA kann keine CPU-Werte lesen.",
    choices: [
      {
        text: "Metrics Server aktivieren",
        stability: +10,
        visibility: +10,
        scaling: +20,
        feedback:
          "Genau. Ohne Metrics Server fehlen dem HPA wichtige Ressourcenmetriken."
      },
      {
        text: "Grafana neu starten",
        stability: 0,
        visibility: -5,
        scaling: -10,
        feedback:
          "Grafana visualisiert Daten, liefert dem HPA aber nicht automatisch CPU-Metriken."
      }
    ]
  },

  {
    title: "Pods haben keine CPU requests",
    text:
      "Kubernetes kann die prozentuale CPU-Auslastung nicht sauber berechnen.",
    choices: [
      {
        text: "resources.requests.cpu setzen",
        stability: +15,
        visibility: +5,
        scaling: +20,
        feedback:
          "Richtig. HPA braucht Resource Requests, um Utilization zu berechnen."
      },
      {
        text: "Nur limits.memory setzen",
        stability: 0,
        visibility: 0,
        scaling: -10,
        feedback:
          "Memory-Limits helfen nicht bei CPU-basierter HPA-Berechnung."
      }
    ]
  },

  {
    title: "Sarah fragt: War die API um 14:30 langsam?",
    text:
      "Tom braucht historische Metriken und ein Dashboard.",
    choices: [
      {
        text: "Prometheus + Grafana-Dashboard nutzen",
        stability: +5,
        visibility: +30,
        scaling: 0,
        feedback:
          "Genau. Prometheus speichert Metriken, Grafana macht sie sichtbar."
      },
      {
        text: "Einmal kubectl get pods ausführen",
        stability: 0,
        visibility: -15,
        scaling: 0,
        feedback:
          "Das zeigt nur einen aktuellen Zustand, keine Historie."
      }
    ]
  },

  {
    title: "Ein Pod startet langsam wegen Cache-Aufbau",
    text:
      "Die livenessProbe tötet den Pod zu früh.",
    choices: [
      {
        text: "startupProbe ergänzen",
        stability: +25,
        visibility: 0,
        scaling: 0,
        feedback:
          "Richtig. startupProbe gibt langsam startenden Anwendungen Zeit."
      },
      {
        text: "Alle Probes entfernen",
        stability: -20,
        visibility: -10,
        scaling: 0,
        feedback:
          "Ohne Probes erkennt Kubernetes Probleme schlechter."
      }
    ]
  },

  {
    title: "Dr. Weber braucht Security-Events",
    text:
      "Fehlgeschlagene Logins sollen zentral suchbar sein.",
    choices: [
      {
        text: "Fluent Bit + Loki/Elasticsearch einsetzen",
        stability: +5,
        visibility: +25,
        scaling: 0,
        feedback:
          "Richtig. Zentrales Logging macht Security-Events clusterweit auffindbar."
      },
      {
        text: "Jeden Pod einzeln mit kubectl logs prüfen",
        stability: 0,
        visibility: -20,
        scaling: 0,
        feedback:
          "Das skaliert nicht bei vielen Pods und Replicas."
      }
    ]
  }
];

let current = 0;

let scores = {
  stability: 70,
  visibility: 40,
  scaling: 30
};

function updateScores() {
  document.getElementById("stabilityScore").textContent =
    scores.stability;

  document.getElementById("visibilityScore").textContent =
    scores.visibility;

  document.getElementById("scalingScore").textContent =
    scores.scaling;
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
  scores.stability += choice.stability;
  scores.visibility += choice.visibility;
  scores.scaling += choice.scaling;

  updateScores();

  document.getElementById("feedback").innerHTML = `
    <div class="ch-card">
      <p>${choice.feedback}</p>
    </div>
  `;

  current++;

  if (current < scenarios.length) {
    setTimeout(renderScenario, 1600);
  } else {
    setTimeout(showFinal, 1600);
  }
}

function showFinal() {
  let result = "";

  const total =
    scores.stability +
    scores.visibility +
    scores.scaling;

  if (total >= 300) {
    result =
      "NovaTech ist bereit für die Hannover Messe.";
  } else if (total >= 230) {
    result =
      "NovaTech ist teilweise vorbereitet, aber es gibt noch Risiken.";
  } else {
    result =
      "Die Plattform ist nicht production-ready.";
  }

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>Simulation abgeschlossen</h2>

      <p>${result}</p>

      <h3>Merksätze</h3>

      <ul>
        <li>HPA braucht Metriken und Resource Requests.</li>
        <li>Prometheus sammelt Metriken, Grafana visualisiert.</li>
        <li>Fluent Bit sammelt Logs clusterweit.</li>
        <li>Probes müssen zur Startzeit und Laufzeit der App passen.</li>
      </ul>
    </div>
  `;

  document.getElementById("choices").innerHTML = "";
}

updateScores();
renderScenario();