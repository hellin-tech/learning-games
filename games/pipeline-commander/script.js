const incidents = [
  {
    title: "Daten verschwinden nach MQTT",
    text:
      "Tom sieht MQTT-Nachrichten im Broker, aber in InfluxDB tauchen keine neuen Messwerte auf.",
    broken: "nodeTelegraf",
    logs: [
      "$ mosquitto_sub -t 'novatech/halle1/#' -v",
      "novatech/halle1/cnc/fraese12/temperatur {\"wert\":65.8}",
      "",
      "$ influx query ...",
      "no results"
    ],
    answers: [
      {
        label: "Telegraf mqtt_consumer und InfluxDB-Output prüfen",
        correct: true,
        feedback:
          "Richtig. MQTT liefert Daten. Die Übersetzung MQTT → InfluxDB ist Aufgabe von Telegraf.",
        effects: { throughput: 12, quality: 6, operations: 10 }
      },
      {
        label: "PostgreSQL als Zwischenspeicher einbauen",
        feedback:
          "Nicht passend. Für Zeitreihendaten ist InfluxDB vorgesehen; das Problem liegt im Collector.",
        effects: { throughput: -8, quality: -3, operations: -8 }
      },
      {
        label: "Alle Sensoren neu starten",
        feedback:
          "Die Sensoren senden bereits. Ein Neustart löst den Pipeline-Bruch nicht.",
        effects: { throughput: -6, quality: 0, operations: -5 }
      }
    ]
  },
  {
    title: "InfluxDB-Abfrage ist langsam",
    text:
      "Nina filtert nach Maschinenname, aber die Abfrage über 24 Stunden dauert viel zu lange.",
    broken: "nodeInflux",
    logs: [
      "Measurement: maschinen_temperatur",
      "Field: wert=65.3",
      "Field: maschine='fraese12'",
      "Query: filter machine == fraese12"
    ],
    answers: [
      {
        label: "maschine als Tag speichern, nicht als Field",
        correct: true,
        feedback:
          "Richtig. Tags sind indiziert und ideal für häufige Filter wie Maschine, Standort oder Sensorposition.",
        effects: { throughput: 4, quality: 14, operations: 8 }
      },
      {
        label: "Zeitstempel entfernen",
        feedback:
          "Falsch. Der Zeitstempel ist das zentrale Element einer Zeitreihendatenbank.",
        effects: { throughput: -8, quality: -15, operations: -8 }
      },
      {
        label: "Alle Werte als JSON-String in ein Field schreiben",
        feedback:
          "Das macht Auswertungen und Aggregationen schwerer und verschlechtert die Datenqualität.",
        effects: { throughput: -4, quality: -12, operations: -5 }
      }
    ]
  },
  {
    title: "Datenbank wächst unkontrolliert",
    text:
      "Nach einigen Wochen belegt InfluxDB immer mehr Speicher. Tom braucht eine Strategie für Rohdaten und Langzeitwerte.",
    broken: "nodeInflux",
    logs: [
      "raw bucket: 5-second values",
      "daily growth: millions of points",
      "requirement: ML trends later, raw detail not forever"
    ],
    answers: [
      {
        label: "Retention: Rohdaten 30 Tage, Downsampling für Langzeitwerte",
        correct: true,
        feedback:
          "Richtig. Retention Policies und verdichtete Langzeitdaten verhindern unkontrolliertes Wachstum.",
        effects: { throughput: 6, quality: 8, operations: 14 }
      },
      {
        label: "Alle Rohdaten unbegrenzt speichern",
        feedback:
          "Das ist teuer und belastet Abfragen. Für Langzeitanalyse reichen oft verdichtete Werte.",
        effects: { throughput: -8, quality: 3, operations: -14 }
      },
      {
        label: "Alle Daten nach 24 Stunden löschen",
        feedback:
          "Zu aggressiv. Für Trends, Störungen und Predictive Maintenance gehen wichtige Daten verloren.",
        effects: { throughput: 6, quality: -12, operations: -6 }
      }
    ]
  },
  {
    title: "Alarmregel soll schnell angepasst werden",
    text:
      "Sarah möchte testweise eine neue Alarmregel: Wenn Temperatur > 80 °C, soll zusätzlich eine Benachrichtigung ausgelöst werden.",
    broken: "nodeDash",
    logs: [
      "Need: MQTT Input → JSON Parse → Switch Temp>80 → Mail + InfluxDB",
      "Requirement: schneller Prototyp ohne eigenes Deployment"
    ],
    answers: [
      {
        label: "Node-RED-Flow für Prototyping einsetzen",
        correct: true,
        feedback:
          "Richtig. Node-RED ist stark für visuelle IoT-Flows und schnell änderbare Logik.",
        effects: { throughput: 2, quality: 6, operations: 12 }
      },
      {
        label: "InfluxDB als MQTT-Broker verwenden",
        feedback:
          "InfluxDB speichert Zeitreihen, ist aber kein MQTT-Broker.",
        effects: { throughput: -8, quality: -6, operations: -8 }
      },
      {
        label: "Telegraf für E-Mail-Alarmierung im Browser verwenden",
        feedback:
          "Telegraf ist ein Collector. Für visuelle Flow-Logik passt Node-RED besser.",
        effects: { throughput: -2, quality: -3, operations: -6 }
      }
    ]
  },
  {
    title: "Produktionsbetrieb statt Prototyp",
    text:
      "Die Node-RED-Logik funktioniert, aber Markus fragt, ob sie für sehr hohen Durchsatz im Dauerbetrieb geeignet ist.",
    broken: "nodeDash",
    logs: [
      "prototype: Node-RED successful",
      "production: high throughput, versioning, tests, CI/CD required",
      "question: keep visual flow or move logic?"
    ],
    answers: [
      {
        label: "Kritische Hochdurchsatzlogik als versionierten Service umsetzen",
        correct: true,
        feedback:
          "Richtig. Node-RED ist stark für Prototypen; produktionskritische Logik kann als getesteter Service robuster sein.",
        effects: { throughput: 12, quality: 8, operations: 10 }
      },
      {
        label: "Alle produktiven Tests abschalten, weil Node-RED visuell ist",
        feedback:
          "Falsch. Auch visuelle Flows brauchen Betriebskonzepte, Versionierung und Tests.",
        effects: { throughput: -4, quality: -10, operations: -12 }
      },
      {
        label: "InfluxDB durch Excel ersetzen",
        feedback:
          "Excel ist keine Plattform für industrielle Zeitreihenströme.",
        effects: { throughput: -14, quality: -12, operations: -15 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let correct = 0;

const state = {
  throughput: 70,
  quality: 70,
  operations: 70
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

function resetPipeline() {
  document.querySelectorAll(".pipe-node").forEach(node => {
    node.classList.remove("pipe-broken", "pipe-ok");
  });
}

function renderIncident() {
  const item = incidents[current];

  selected = null;
  answered = false;

  resetPipeline();
  el(item.broken).classList.add("pipe-broken");

  el("badge").textContent = `Incident ${current + 1} / ${incidents.length}`;
  el("title").textContent = item.title;
  el("text").textContent = item.text;
  el("progressBar").style.width = `${(current / incidents.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("nextBtn").textContent = "Maßnahme prüfen";

  el("logBox").innerHTML = item.logs
    .map(line => `<div class="story-line">${line || "&nbsp;"}</div>`)
    .join("");

  el("answers").innerHTML = "";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer.label;

    button.addEventListener("click", () => {
      if (answered) return;
      selected = index;

      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    el("answers").appendChild(button);
  });
}

function applyEffects(effects) {
  Object.keys(effects).forEach(key => {
    state[key] += effects[key];
  });
  updateState();
}

el("nextBtn").addEventListener("click", () => {
  const item = incidents[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Maßnahme.</div>`;
      return;
    }

    answered = true;
    const answer = item.answers[selected];

    applyEffects(answer.effects);

    document.querySelectorAll(".answer").forEach((btn, index) => {
      if (item.answers[index].correct) btn.classList.add("correct");
      if (index === selected && !item.answers[index].correct) btn.classList.add("wrong");
    });

    if (answer.correct) {
      correct++;
      el(item.broken).classList.remove("pipe-broken");
      el(item.broken).classList.add("pipe-ok");
      el("feedback").innerHTML = `
        <div class="ch-card correct-box">
          <h3>Pipeline stabilisiert</h3>
          <p>${answer.feedback}</p>
        </div>
      `;
    } else {
      el("feedback").innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Maßnahme greift nicht</h3>
          <p>${answer.feedback}</p>
        </div>
      `;
    }

    el("nextBtn").textContent =
      current === incidents.length - 1 ? "Ergebnis anzeigen" : "Nächster Incident";

    return;
  }

  current++;

  if (current < incidents.length) {
    renderIncident();
  } else {
    showResult();
  }
});

function showResult() {
  el("progressBar").style.width = "100%";
  el("answers").innerHTML = "";
  el("nextBtn").style.display = "none";
  resetPipeline();

  document.querySelectorAll(".pipe-node").forEach(node => node.classList.add("pipe-ok"));

  const avg = Math.round((state.throughput + state.quality + state.operations) / 3);

  el("title").textContent = "Pipeline wieder stabil";
  el("text").innerHTML = `
    Du hast <strong>${correct}</strong> von <strong>${incidents.length}</strong>
    Pipeline-Problemen sauber gelöst.<br>
    Betriebswert: <strong>${avg} / 100</strong>
  `;

  el("logBox").innerHTML = `
    <div class="story-line">[MERKSATZ] MQTT transportiert, Telegraf sammelt, InfluxDB speichert Zeitreihen.</div>
    <div class="story-line">[MERKSATZ] Tags sind für Filter, Fields sind für Messwerte.</div>
    <div class="story-line">[MERKSATZ] Retention und Downsampling verhindern Datenbank-Wachstum.</div>
    <div class="story-line">[MERKSATZ] Node-RED ist stark für Prototyping und visuelle IoT-Flows.</div>
  `;

  el("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Zusammenfassung</h3>
      <p>
        Eine saubere IoT-Pipeline trennt Transport, Sammlung, Verarbeitung und Speicherung.
        So bleibt sie erweiterbar, beobachtbar und wartbar.
      </p>
    </div>
  `;
}

updateState();
renderIncident();