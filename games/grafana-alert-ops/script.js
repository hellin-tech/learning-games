const rounds = [
  {
    title: "Sarah braucht den Temperaturverlauf",
    text:
      "Sarah möchte sehen, wie sich die Spindeltemperatur der letzten 24 Stunden entwickelt hat.",
    data: [
      "query: maschinen_temperatur",
      "time range: last 24h",
      "goal: Trend, Peaks und Verlauf erkennen"
    ],
    dashboard: ["Time Series", "Zoom 24h", "Threshold line"],
    choices: [
      {
        label: "Time-Series-Panel mit Verlauf und Schwellenlinie verwenden",
        correct: true,
        feedback: "Richtig. Zeitreihen zeigen Trends, Spitzen und historische Entwicklung am besten.",
        effects: { overview: 6, alerts: 2, analysis: 14 }
      },
      {
        label: "Nur ein einzelnes Stat-Panel anzeigen",
        feedback: "Ein Stat-Panel zeigt den aktuellen Wert, aber nicht den Verlauf.",
        effects: { overview: 2, alerts: 0, analysis: -10 }
      },
      {
        label: "Alle 235 Sensoren gleichzeitig in ein Panel legen",
        feedback: "Das erzeugt ein unlesbares Dashboard. Gute Dashboards arbeiten mit Detailstufen.",
        effects: { overview: -14, alerts: -4, analysis: -8 }
      }
    ]
  },
  {
    title: "Lisa will Management-KPIs",
    text:
      "Lisa möchte keine Einzelwerte, sondern Verfügbarkeit, Alarme pro Woche und eingesparte Ausfallzeit sehen.",
    data: [
      "role: CTO / Management",
      "need: KPIs, Trends, Wochenvergleich",
      "avoid: Rohdatenflut"
    ],
    dashboard: ["Availability 98.7%", "Alarms/week", "Downtime saved"],
    choices: [
      {
        label: "Management-View mit Stat-Panels und aggregierten KPIs erstellen",
        correct: true,
        feedback: "Richtig. Management braucht verdichtete Kennzahlen, nicht Sensorrohdaten.",
        effects: { overview: 16, alerts: 2, analysis: 6 }
      },
      {
        label: "Lisa dieselbe Techniker-Detailansicht geben",
        feedback: "Zu detailliert. Unterschiedliche Nutzergruppen brauchen unterschiedliche Dashboard-Ebenen.",
        effects: { overview: -12, alerts: 0, analysis: -2 }
      },
      {
        label: "Nur InfluxDB-Konsole bereitstellen",
        feedback: "Das ist keine geeignete Management-Visualisierung.",
        effects: { overview: -14, alerts: -2, analysis: -6 }
      }
    ]
  },
  {
    title: "Kurzer Temperatur-Peak",
    text:
      "Die Temperatur springt für 10 Sekunden auf 81 °C und fällt danach wieder auf 65 °C. Sarah will keine Fehlalarme.",
    data: [
      "condition: temperature > 80 °C",
      "peak duration: 10s",
      "normal after: 65 °C"
    ],
    dashboard: ["Alert rule", "Evaluate 30s", "For 2m"],
    choices: [
      {
        label: "Alert Rule mit For: 2m konfigurieren",
        correct: true,
        feedback: "Richtig. Der For-Parameter verhindert Alarme bei kurzen Spitzen.",
        effects: { overview: 2, alerts: 16, analysis: 6 }
      },
      {
        label: "Sofort bei jedem Einzelwert > 80 °C alarmieren",
        feedback: "Das erzeugt Fehlalarme bei kurzen Messspitzen.",
        effects: { overview: -2, alerts: -14, analysis: 2 }
      },
      {
        label: "Grenzwert komplett entfernen",
        feedback: "Dann bleiben echte Überhitzungen unsichtbar.",
        effects: { overview: -4, alerts: -18, analysis: -8 }
      }
    ]
  },
  {
    title: "Gerät sendet keine Daten",
    text:
      "Fräse07 hat seit sechs Minuten keine Daten mehr gesendet. Das Dashboard soll das als Offline-Problem zeigen.",
    data: [
      "last data point: 6 minutes ago",
      "required alert: no data > 5m",
      "target: shift lead"
    ],
    dashboard: ["No data alert", "Alert list", "Slack #iot-alerts"],
    choices: [
      {
        label: "No-Data-Alert > 5 Minuten plus Alert-List-Panel einrichten",
        correct: true,
        feedback: "Richtig. Fehlende Daten sind in IoT-Systemen selbst ein Alarmzustand.",
        effects: { overview: 8, alerts: 14, analysis: 5 }
      },
      {
        label: "Offline-Zustände ignorieren, solange keine Grenzwerte überschritten werden",
        feedback: "Gefährlich. Ohne Daten kann kein Grenzwert erkannt werden.",
        effects: { overview: -8, alerts: -16, analysis: -4 }
      },
      {
        label: "Dashboard-Refresh auf 24 Stunden stellen",
        feedback: "Für operative IoT-Überwachung viel zu langsam.",
        effects: { overview: -12, alerts: -10, analysis: -6 }
      }
    ]
  },
  {
    title: "Schleichender Temperaturanstieg",
    text:
      "Über mehrere Wochen steigt die Temperatur langsam. Der Grenzwert wurde nie überschritten, aber der Trend ist eindeutig.",
    data: [
      "week 1: 64 °C avg",
      "week 2: 66 °C avg",
      "week 3: 68 °C avg",
      "week 4: 71 °C avg"
    ],
    dashboard: ["Trend", "Moving average", "Anomaly hint"],
    choices: [
      {
        label: "Trendregel mit gleitendem Durchschnitt und Abweichung vom Normalwert ergänzen",
        correct: true,
        feedback: "Richtig. Anomalie-Erkennung braucht mehr als starre Grenzwerte.",
        effects: { overview: 5, alerts: 8, analysis: 18 }
      },
      {
        label: "Nur kritische Grenzwerte > 85 °C anzeigen",
        feedback: "Dann werden schleichende Veränderungen zu spät erkannt.",
        effects: { overview: -2, alerts: -6, analysis: -14 }
      },
      {
        label: "Alle alten Daten löschen, damit das Dashboard schneller wird",
        feedback: "Dann fehlen historische Trends für Predictive Maintenance.",
        effects: { overview: 2, alerts: -4, analysis: -16 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let correct = 0;

const state = {
  overview: 70,
  alerts: 70,
  analysis: 70
};

function el(id) {
  return document.getElementById(id);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateState() {
  Object.keys(state).forEach(key => {
    state[key] = clamp(state[key]);
    el(key).textContent = state[key];
  });
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state[key] += value;
  });
  updateState();
}

function renderRound() {
  const item = rounds[current];
  selected = null;
  answered = false;

  el("roundBadge").textContent = `Auftrag ${current + 1} / ${rounds.length}`;
  el("title").textContent = item.title;
  el("text").textContent = item.text;
  el("progressBar").style.width = `${(current / rounds.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("nextBtn").textContent = "Entscheidung prüfen";

  el("dataBox").innerHTML = item.data
    .map(line => `<div class="story-line">${line}</div>`)
    .join("");

  el("mockDashboard").innerHTML = item.dashboard
    .map(panel => `<div class="mock-panel">${panel}</div>`)
    .join("");

  el("choices").innerHTML = "";

  item.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = choice.label;

    button.addEventListener("click", () => {
      if (answered) return;
      selected = index;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    el("choices").appendChild(button);
  });
}

el("nextBtn").addEventListener("click", () => {
  const item = rounds[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Grafana-Entscheidung.</div>`;
      return;
    }

    answered = true;
    const choice = item.choices[selected];

    applyEffects(choice.effects);

    document.querySelectorAll(".answer").forEach((btn, index) => {
      if (item.choices[index].correct) btn.classList.add("correct");
      if (index === selected && !item.choices[index].correct) btn.classList.add("wrong");
    });

    if (choice.correct) correct++;

    el("feedback").innerHTML = `
      <div class="ch-card ${choice.correct ? "correct-box" : "wrong-box"}">
        <h3>${choice.correct ? "Gute Dashboard-Entscheidung" : "Nicht optimal"}</h3>
        <p>${choice.feedback}</p>
      </div>
    `;

    el("nextBtn").textContent =
      current === rounds.length - 1 ? "Dashboard-Review anzeigen" : "Nächster Auftrag";

    return;
  }

  current++;

  if (current < rounds.length) {
    renderRound();
  } else {
    showResult();
  }
});

function showResult() {
  el("progressBar").style.width = "100%";
  el("choices").innerHTML = "";
  el("nextBtn").style.display = "none";

  const avg = Math.round((state.overview + state.alerts + state.analysis) / 3);

  el("title").textContent = "Dashboard-Review abgeschlossen";
  el("text").innerHTML = `
    Richtige Entscheidungen: <strong>${correct}</strong> von <strong>${rounds.length}</strong><br>
    Dashboard-Reifegrad: <strong>${avg} / 100</strong>
  `;

  el("mockDashboard").innerHTML = `
    <div class="mock-panel ok">Level 1<br>Management</div>
    <div class="mock-panel ok">Level 2<br>Produktion</div>
    <div class="mock-panel ok">Level 3<br>Technik</div>
  `;

  el("dataBox").innerHTML = `
    <div class="story-line">[MERKSATZ] Gute Dashboards zeigen erst Überblick, dann Details.</div>
    <div class="story-line">[MERKSATZ] Time Series für Verläufe, Gauges für aktuelle Werte, Stat Panels für KPIs.</div>
    <div class="story-line">[MERKSATZ] Alerts brauchen Schwelle, Zeitraum, For-Parameter und Eskalationsweg.</div>
    <div class="story-line">[MERKSATZ] Trends erkennt man nicht nur mit Grenzwerten, sondern mit Zeitreihenanalyse.</div>
  `;

  el("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Zusammenfassung</h3>
      <p>
        Sarah braucht operative Echtzeit-Transparenz, Lisa verdichtete KPIs.
        Ein gutes Grafana-Setup liefert beides und alarmiert nur dann, wenn wirklich Handlung nötig ist.
      </p>
    </div>
  `;
}

updateState();
renderRound();