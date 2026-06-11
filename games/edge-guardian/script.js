const scenarios = [
  {
    title: "Kritische Spindeltemperatur",
    text:
      "Der Temperatursensor meldet 90 °C. Das WLAN ist gerade instabil. Die Kühlmittelpumpe muss sofort reagieren.",
    telemetry: [
      "[sensor] temperatur/spindel = 90.1 °C",
      "[network] WLAN packet loss",
      "[requirement] Reaktion innerhalb weniger Millisekunden"
    ],
    answers: [
      {
        label: "Schwellwertprüfung und Pumpensteuerung lokal am Edge ausführen",
        correct: true,
        feedback:
          "Richtig. Sicherheitskritische Entscheidungen dürfen nicht von Broker, Cloud oder WLAN abhängen.",
        effects: { safety: 15, bandwidth: 3, latency: 15, offline: 12 }
      },
      {
        label: "Messwert an die Cloud senden und dort entscheiden",
        feedback:
          "Zu riskant. Cloud- oder Serverlatenz kann für Notreaktionen zu hoch sein.",
        effects: { safety: -18, bandwidth: -6, latency: -15, offline: -14 }
      },
      {
        label: "Nur alle 5 Minuten einen Durchschnittswert senden",
        feedback:
          "Aggregation ist gut für Monitoring, aber nicht für akute Notabschaltung.",
        effects: { safety: -12, bandwidth: 10, latency: -10, offline: -6 }
      }
    ]
  },
  {
    title: "200 Millionen Rohdaten pro Tag",
    text:
      "47 Maschinen senden Rohdaten im 100-ms-Takt. Netzwerk und InfluxDB geraten an ihre Grenzen.",
    telemetry: [
      "[rate] 47 Maschinen × 5 Sensoren × 10 Werte/s",
      "[load] 2.350 Datenpunkte pro Sekunde",
      "[problem] Datenbank und Netzwerk überlastet"
    ],
    answers: [
      {
        label: "5-Sekunden-Fenster mit avg, min, max und std am Edge berechnen",
        correct: true,
        feedback:
          "Richtig. Aggregation reduziert Daten stark, ohne wichtige statistische Informationen zu verlieren.",
        effects: { safety: 3, bandwidth: 18, latency: 5, offline: 4 }
      },
      {
        label: "Alle Rohdaten unverändert an den zentralen Broker senden",
        feedback:
          "Das skaliert schlecht und verschiebt das Problem nur ins Netzwerk und Backend.",
        effects: { safety: 0, bandwidth: -18, latency: -4, offline: -3 }
      },
      {
        label: "Sensoren komplett deaktivieren",
        feedback:
          "Datenreduktion darf nicht bedeuten, dass Monitoring blind wird.",
        effects: { safety: -15, bandwidth: 15, latency: 0, offline: -6 }
      }
    ]
  },
  {
    title: "Stabile Temperatur",
    text:
      "Die Spindeltemperatur schwankt seit 20 Minuten nur zwischen 65,1 °C und 65,5 °C.",
    telemetry: [
      "[raw] 65.2 65.3 65.1 65.4 65.2 65.5",
      "[pattern] stabile Betriebsphase",
      "[goal] unnötige Wiederholungen vermeiden"
    ],
    answers: [
      {
        label: "Dead-Band-Filter mit 1 °C Schwelle einsetzen",
        correct: true,
        feedback:
          "Richtig. Bei kleinen Änderungen muss nicht jeder Wert gesendet werden.",
        effects: { safety: 2, bandwidth: 14, latency: 2, offline: 3 }
      },
      {
        label: "QoS 2 für jeden stabilen Messwert erzwingen",
        feedback:
          "Das erhöht Overhead massiv, ohne fachlichen Mehrwert bei stabilen Standardmesswerten.",
        effects: { safety: 2, bandwidth: -12, latency: -4, offline: 0 }
      },
      {
        label: "Nur noch Tagesdurchschnitt senden",
        feedback:
          "Zu grob. Kurzfristige Veränderungen und Maxima wären nicht mehr sichtbar.",
        effects: { safety: -8, bandwidth: 16, latency: -8, offline: 0 }
      }
    ]
  },
  {
    title: "30 Minuten Netzwerkausfall",
    text:
      "Der Broker ist nicht erreichbar. Die Maschine läuft weiter. Daten dürfen nicht verloren gehen.",
    telemetry: [
      "[network] broker unreachable",
      "[duration] 30 Minuten Ausfall",
      "[requirement] Nachsenden nach Wiederverbindung"
    ],
    answers: [
      {
        label: "Lokalen SQLite-Puffer mit Store-and-Forward verwenden",
        correct: true,
        feedback:
          "Richtig. Der Edge speichert lokal und sendet später nach.",
        effects: { safety: 8, bandwidth: 3, latency: 4, offline: 18 }
      },
      {
        label: "Daten während Ausfall verwerfen",
        feedback:
          "Für historische Analysen und Nachvollziehbarkeit ist das schlecht.",
        effects: { safety: -8, bandwidth: 6, latency: 2, offline: -16 }
      },
      {
        label: "Maschine stoppen, sobald der Broker nicht erreichbar ist",
        feedback:
          "Übertrieben. Kritische lokale Sicherheit muss bleiben, aber Monitoringdaten können gepuffert werden.",
        effects: { safety: 2, bandwidth: 0, latency: 0, offline: -6 }
      }
    ]
  },
  {
    title: "Schleichender Temperaturanstieg",
    text:
      "Die Dead-Band-Filterung unterdrückt kleine Änderungen. Dr. Weber fragt, wie man langsame Trends trotzdem erkennt.",
    telemetry: [
      "[trend] +0.1 °C pro Stunde",
      "[dead-band] 1 °C",
      "[risk] Trend bleibt lange unsichtbar"
    ],
    answers: [
      {
        label: "Zusätzlich Trendanalyse oder periodischen Heartbeat senden",
        correct: true,
        feedback:
          "Richtig. Dead-Band sollte mit Trendregeln oder periodischen Zusammenfassungen kombiniert werden.",
        effects: { safety: 10, bandwidth: -2, latency: 4, offline: 5 }
      },
      {
        label: "Dead-Band auf 10 °C erhöhen",
        feedback:
          "Das würde noch mehr relevante Veränderungen verbergen.",
        effects: { safety: -12, bandwidth: 10, latency: -4, offline: 0 }
      },
      {
        label: "Nur noch Anomalien senden und alle Normalwerte löschen",
        feedback:
          "Für Trends, Diagnose und historische Analyse fehlen dann wichtige Kontextdaten.",
        effects: { safety: -6, bandwidth: 12, latency: 2, offline: -2 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let correctCount = 0;

const state = {
  safety: 70,
  bandwidth: 70,
  latency: 70,
  offline: 70
};

const ids = key => document.getElementById(key);

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStatus() {
  Object.keys(state).forEach(key => {
    state[key] = clamp(state[key]);
    ids(key).textContent = state[key];

    const card = ids(key).parentElement;
    card.classList.remove("good", "warn", "bad");

    if (state[key] >= 70) card.classList.add("good");
    else if (state[key] >= 45) card.classList.add("warn");
    else card.classList.add("bad");
  });
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state[key] += value;
  });
  updateStatus();
}

function renderScenario() {
  selected = null;
  answered = false;

  const item = scenarios[current];

  ids("roundBadge").textContent = `Szenario ${current + 1} / ${scenarios.length}`;
  ids("title").textContent = item.title;
  ids("text").textContent = item.text;
  ids("progressBar").style.width = `${(current / scenarios.length) * 100}%`;
  ids("feedback").innerHTML = "";
  ids("nextBtn").textContent = "Entscheidung prüfen";

  ids("telemetry").innerHTML = item.telemetry
    .map(line => `<div class="story-line">${line}</div>`)
    .join("");

  ids("answers").innerHTML = "";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer edge-answer";
    button.textContent = answer.label;

    button.addEventListener("click", () => {
      if (answered) return;

      selected = index;
      document.querySelectorAll(".edge-answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    ids("answers").appendChild(button);
  });
}

ids("nextBtn").addEventListener("click", () => {
  const item = scenarios[current];

  if (!answered) {
    if (selected === null) {
      ids("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Maßnahme.</div>`;
      return;
    }

    answered = true;

    const answer = item.answers[selected];
    applyEffects(answer.effects);

    document.querySelectorAll(".edge-answer").forEach((btn, index) => {
      if (item.answers[index].correct) btn.classList.add("correct");
      if (index === selected && !item.answers[index].correct) btn.classList.add("wrong");
    });

    if (answer.correct) {
      correctCount++;
      ids("feedback").innerHTML = `
        <div class="ch-card correct-box">
          <h3>Edge-Entscheidung passt</h3>
          <p>${answer.feedback}</p>
        </div>
      `;
    } else {
      ids("feedback").innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Riskante Architektur</h3>
          <p>${answer.feedback}</p>
        </div>
      `;
    }

    ids("nextBtn").textContent =
      current === scenarios.length - 1 ? "Ergebnis anzeigen" : "Nächstes Szenario";

    return;
  }

  current++;

  if (current < scenarios.length) {
    renderScenario();
  } else {
    showResult();
  }
});

function showResult() {
  ids("progressBar").style.width = "100%";
  ids("answers").innerHTML = "";
  ids("nextBtn").style.display = "none";

  const average = Math.round(
    (state.safety + state.bandwidth + state.latency + state.offline) / 4
  );

  ids("title").textContent = "Edge-Schicht abgeschlossen";
  ids("text").innerHTML = `
    Du hast <strong>${correctCount}</strong> von <strong>${scenarios.length}</strong>
    Architekturentscheidungen korrekt getroffen.<br>
    Gesamtstabilität: <strong>${average} / 100</strong>
  `;

  ids("telemetry").innerHTML = `
    <div class="story-line">[MERKSATZ] Edge Computing verarbeitet Daten nah an der Maschine.</div>
    <div class="story-line">[MERKSATZ] Kritische Alarme gehören lokal auf das Gateway.</div>
    <div class="story-line">[MERKSATZ] Die Cloud bleibt stark für Langzeitanalyse und zentrale Speicherung.</div>
    <div class="story-line">[MERKSATZ] Aggregation, Dead-Band und Store-and-Forward reduzieren Last und Risiko.</div>
  `;

  ids("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Zusammenfassung</h3>
      <p>
        Edge und Cloud sind kein Entweder-oder: Der Edge reagiert schnell und offlinefähig,
        die Cloud analysiert langfristig und zentral.
      </p>
    </div>
  `;
}

updateStatus();
renderScenario();