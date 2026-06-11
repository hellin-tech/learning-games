const cases = [
  {
    title: "Langsame Maschinenfilter",
    text:
      "Sarah filtert im Dashboard nach fraese12. Die Abfrage dauert unerwartet lange.",
    code:
`Measurement: maschinen_temperatur

time                  wert   maschine
2024-03-15T10:00:00Z  65.3   fraese12
2024-03-15T10:00:05Z  65.7   fraese12

Schema:
maschine = Field
wert     = Field`,
    choices: [
      {
        label: "maschine muss als Tag modelliert werden",
        correct: true,
        feedback:
          "Richtig. Tags sind indiziert. Häufige Filter wie Maschine, Standort und Sensorposition gehören in Tags.",
        effects: { evidence: 20, performance: 15, maintainability: 8 }
      },
      {
        label: "wert muss als Tag modelliert werden",
        feedback:
          "Nicht sinnvoll. Messwerte gehören als Fields gespeichert, damit sie aggregiert werden können.",
        effects: { evidence: 5, performance: -8, maintainability: -6 }
      },
      {
        label: "time sollte gelöscht werden",
        feedback:
          "Falsch. Zeit ist das zentrale Ordnungskriterium einer Zeitreihendatenbank.",
        effects: { evidence: 0, performance: -12, maintainability: -12 }
      }
    ]
  },
  {
    title: "Telegraf schreibt keine Daten",
    text:
      "MQTT empfängt Nachrichten, aber Telegraf schreibt nichts in InfluxDB.",
    code:
`[[inputs.mqtt_consumer]]
  servers = ['tcp://mqtt-broker:1883']
  topics = ['novatech/halle1/#']
  data_format = 'json'

[[outputs.influxdb_v2]]
  urls = ['http://influxdb:8086']
  organization = 'novatech'
  bucket = 'sensordaten'
  token = ''`,
    choices: [
      {
        label: "InfluxDB-Token fehlt",
        correct: true,
        feedback:
          "Richtig. Ohne gültigen Token kann Telegraf nicht in den InfluxDB-v2-Bucket schreiben.",
        effects: { evidence: 20, performance: 4, maintainability: 10 }
      },
      {
        label: "MQTT darf nicht mit tcp:// verbunden werden",
        feedback:
          "Doch, tcp://mqtt-broker:1883 ist für MQTT üblich.",
        effects: { evidence: 4, performance: -4, maintainability: -4 }
      },
      {
        label: "topics darf niemals Wildcards enthalten",
        feedback:
          "Falsch. MQTT-Subscriptions verwenden Wildcards wie # und +.",
        effects: { evidence: 3, performance: -6, maintainability: -5 }
      }
    ]
  },
  {
    title: "Falsche Topic-Auswertung",
    text:
      "Telegraf soll aus dem MQTT-Topic den Maschinennamen als Tag erzeugen. Das Tag bleibt aber leer.",
    code:
`mqtt_topic:
novatech/halle1/cnc/fraese12/temperatur/spindel

regex pattern:
novatech/(?P<standort>[^/]+)/(?P<maschine>[^/]+)/.*

expected:
maschine = fraese12

actual:
maschine = cnc`,
    choices: [
      {
        label: "Regex berücksichtigt den Maschinentyp cnc nicht als eigene Ebene",
        correct: true,
        feedback:
          "Richtig. Zwischen standort und maschine liegt noch typ. Deshalb wird cnc fälschlich als Maschine gelesen.",
        effects: { evidence: 20, performance: 6, maintainability: 12 }
      },
      {
        label: "InfluxDB kann keine Tags aus Topics speichern",
        feedback:
          "Doch. Telegraf kann Topic-Informationen als Tags weitergeben und per Processor verarbeiten.",
        effects: { evidence: 4, performance: -5, maintainability: -5 }
      },
      {
        label: "MQTT-Topics dürfen keine Schrägstriche enthalten",
        feedback:
          "Falsch. Hierarchische MQTT-Topics verwenden Schrägstriche als Ebenen.",
        effects: { evidence: 2, performance: -8, maintainability: -8 }
      }
    ]
  },
  {
    title: "Unklare Flow-Verantwortung",
    text:
      "Markus möchte mit Node-RED alles erledigen: Daten sammeln, dauerhaft speichern, hochperformante Abfragen liefern und Alarme prototypisieren.",
    code:
`Proposed:
MQTT In → Function → Dashboard
             ↓
          local variable array
          stores all sensor history`,
    choices: [
      {
        label: "Node-RED für Flow-Logik nutzen, InfluxDB für dauerhafte Zeitreihenspeicherung",
        correct: true,
        feedback:
          "Richtig. Node-RED orchestriert Flows; InfluxDB ist für persistente Zeitreihendaten zuständig.",
        effects: { evidence: 20, performance: 10, maintainability: 14 }
      },
      {
        label: "Alle Historienwerte dauerhaft in Node-RED-Variablen speichern",
        feedback:
          "Das ist nicht robust. Node-RED ist keine Zeitreihendatenbank.",
        effects: { evidence: 5, performance: -12, maintainability: -14 }
      },
      {
        label: "InfluxDB durch MQTT retained messages ersetzen",
        feedback:
          "Retained Messages speichern letzte Werte, aber keine Zeitreihenhistorie.",
        effects: { evidence: 6, performance: -10, maintainability: -10 }
      }
    ]
  },
  {
    title: "Flux-Abfrage liefert falschen Zeitraum",
    text:
      "Nina will die Durchschnittstemperatur der letzten Stunde sehen, aber die Query nutzt keinen Zeitbereich.",
    code:
`from(bucket: "sensordaten")
  |> filter(fn: (r) => r._measurement == "maschinen_temperatur")
  |> filter(fn: (r) => r.maschine == "fraese12")
  |> mean()`,
    choices: [
      {
        label: "range(start: -1h) ergänzen",
        correct: true,
        feedback:
          "Richtig. Zeitreihenabfragen brauchen einen klaren Zeitbereich, besonders bei großen Buckets.",
        effects: { evidence: 20, performance: 12, maintainability: 8 }
      },
      {
        label: "mean() entfernen und alle Daten ausgeben",
        feedback:
          "Das verschärft das Problem und liefert keinen Durchschnitt.",
        effects: { evidence: 3, performance: -10, maintainability: -4 }
      },
      {
        label: "Bucket löschen und neu anlegen",
        feedback:
          "Nicht nötig. Die Query ist unvollständig, nicht der Bucket defekt.",
        effects: { evidence: 2, performance: -8, maintainability: -10 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;

const state = {
  evidence: 0,
  performance: 70,
  maintainability: 70
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

function renderCase() {
  const item = cases[current];

  selected = null;
  answered = false;

  el("caseBadge").textContent = `Fall ${current + 1} / ${cases.length}`;
  el("caseTitle").textContent = item.title;
  el("caseText").textContent = item.text;
  el("codeBox").textContent = item.code;
  el("progressBar").style.width = `${(current / cases.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("checkBtn").textContent = "Analyse prüfen";

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

el("checkBtn").addEventListener("click", () => {
  const item = cases[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Analyse.</div>`;
      return;
    }

    answered = true;
    const choice = item.choices[selected];

    applyEffects(choice.effects);

    document.querySelectorAll(".answer").forEach((btn, index) => {
      if (item.choices[index].correct) btn.classList.add("correct");
      if (index === selected && !item.choices[index].correct) btn.classList.add("wrong");
    });

    el("feedback").innerHTML = `
      <div class="ch-card ${choice.correct ? "correct-box" : "wrong-box"}">
        <h3>${choice.correct ? "Fehler gefunden" : "Spur nicht überzeugend"}</h3>
        <p>${choice.feedback}</p>
      </div>
    `;

    el("checkBtn").textContent =
      current === cases.length - 1 ? "Abschlussbericht erstellen" : "Nächster Fall";

    return;
  }

  current++;

  if (current < cases.length) {
    renderCase();
  } else {
    showReport();
  }
});

function showReport() {
  el("progressBar").style.width = "100%";
  document.querySelector(".detective-layout").hidden = true;
  el("finalReport").hidden = false;
}

el("submitBtn").addEventListener("click", () => {
  const storage = el("storageChoice").value;
  const collector = el("collectorChoice").value;
  const nodered = el("noderedChoice").value;

  let reportScore = 0;
  let notes = [];

  if (storage === "influx") {
    reportScore++;
    notes.push("Datenbankwahl korrekt: InfluxDB passt zu Zeitreihen und zeitbasierten Abfragen.");
  } else {
    notes.push("Datenbankwahl nicht optimal: MQTT speichert keine Historie, PostgreSQL ist hier nicht spezialisiert.");
  }

  if (collector === "collector") {
    reportScore++;
    notes.push("Telegraf korrekt eingeordnet: Collector und Protokollübersetzer zwischen MQTT und InfluxDB.");
  } else {
    notes.push("Telegraf falsch eingeordnet: Es ist weder Broker noch Dashboard.");
  }

  if (nodered === "flows") {
    reportScore++;
    notes.push("Node-RED korrekt eingeordnet: visuelle Flows und schnelles Prototyping.");
  } else {
    notes.push("Node-RED falsch eingeordnet: Es ersetzt keine Zeitreihendatenbank.");
  }

  const perfect = reportScore === 3;

  if (perfect) {
    state.evidence += 20;
    state.performance += 8;
    state.maintainability += 10;
  } else {
    state.maintainability -= 8;
  }

  updateState();

  el("reportFeedback").innerHTML = `
    <div class="ch-card ${perfect ? "correct-box" : "wrong-box"}">
      <h3>${perfect ? "Fall abgeschlossen" : "Bericht unvollständig"}</h3>
      <p>${notes.join("<br>")}</p>
      <h3>Merksatz</h3>
      <p>
        Eine gute IoT-Plattform trennt klar:
        MQTT für Transport, Telegraf für Sammlung, InfluxDB für Zeitreihen
        und Node-RED für visuelle Flow-Orchestrierung.
      </p>
    </div>
  `;

  el("submitBtn").disabled = true;
});

updateState();
renderCase();