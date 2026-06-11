const reviews = [
  {
    title: "Von 12 auf 47 Maschinen",
    text:
      "Lisa fragt: Welche Komponente wird beim Rollout operativ am kritischsten, obwohl die reine Datenrate noch beherrschbar ist?",
    briefing: [
      "Ist-Zustand: 12 Maschinen angebunden",
      "Ziel: 47 Maschinen",
      "Problem: Updates, Zertifikate, Konfigurationen, Monitoring aller Edge-Gateways"
    ],
    choices: [
      {
        label: "Device Management für Edge-Gateways einführen",
        correct: true,
        feedback:
          "Richtig. Bei 47 Geräten werden Zertifikate, OTA-Updates und Konfigurationen operativ zur Hauptaufgabe.",
        effects: { scale: 18, security: 8, documentation: 8 }
      },
      {
        label: "Nur größere SD-Karten in alle Raspberry Pis einbauen",
        feedback:
          "Speicher hilft lokal, löst aber kein Flottenmanagement, keine Updates und keine Zertifikatsrotation.",
        effects: { scale: -8, security: -4, documentation: 0 }
      },
      {
        label: "Alle Gateways manuell per SSH verwalten",
        feedback:
          "Für Prototypen machbar, aber für 47 Maschinen fehleranfällig und schlecht skalierbar.",
        effects: { scale: -15, security: -10, documentation: -4 }
      }
    ]
  },
  {
    title: "Architekturschicht falsch eingeordnet",
    text:
      "Markus erstellt die IHK-Dokumentation. Er ordnet Grafana direkt auf die Sensorebene. Was ist die korrekte Begründung?",
    briefing: [
      "Sensoren: Level 0/1",
      "Edge-Gateways: Level 2",
      "MQTT/InfluxDB/Telegraf: Level 3",
      "Grafana/SAP/ML: Level 4/5"
    ],
    choices: [
      {
        label: "Grafana gehört in Business/Analytics und liest verdichtete Daten, nicht direkt Sensoren",
        correct: true,
        feedback:
          "Richtig. Dashboards greifen auf gespeicherte oder aggregierte Daten zu, nicht direkt auf physische Sensoren.",
        effects: { scale: 5, security: 8, documentation: 18 }
      },
      {
        label: "Grafana muss direkt jeden Sensor abfragen",
        feedback:
          "Das verletzt Entkopplung und erzeugt schlechte Skalierbarkeit.",
        effects: { scale: -10, security: -8, documentation: -12 }
      },
      {
        label: "Grafana ersetzt MQTT und InfluxDB",
        feedback:
          "Grafana visualisiert, transportiert und speichert aber keine IoT-Zeitreihenpipeline.",
        effects: { scale: -12, security: -4, documentation: -14 }
      }
    ]
  },
  {
    title: "MQTT-Broker als Engpass",
    text:
      "Tom fragt, wann Mosquitto als Single Node nicht mehr reicht.",
    briefing: [
      "47 Maschinen: meist unkritisch",
      "Perspektive: 200 Maschinen, mehrere Standorte, höhere Abtastraten",
      "Anforderung: Failover und horizontale Skalierung"
    ],
    choices: [
      {
        label: "Bei größerer Skalierung Cluster-Broker wie EMQX oder HiveMQ prüfen",
        correct: true,
        feedback:
          "Richtig. Für hohe Last und Failover braucht man einen clusterfähigen MQTT-Broker.",
        effects: { scale: 16, security: 2, documentation: 6 }
      },
      {
        label: "MQTT durch einzelne HTTP-POSTs pro Sensor ersetzen",
        feedback:
          "Das verschlechtert Entkopplung und skaliert für viele Empfänger schlechter.",
        effects: { scale: -14, security: 0, documentation: -6 }
      },
      {
        label: "Alle Sensoren direkt an Grafana senden lassen",
        feedback:
          "Grafana ist keine Transport- oder Broker-Komponente.",
        effects: { scale: -16, security: -6, documentation: -10 }
      }
    ]
  },
  {
    title: "Sicherheitsgrenze im Zielbild",
    text:
      "Dr. Weber prüft, ob IT und OT sauber getrennt sind. Welche Architekturentscheidung ist korrekt?",
    briefing: [
      "Office/ERP: Level 4/5",
      "MQTT/Historian: Level 3",
      "Edge-Gateways: Level 2",
      "Regel: keine direkten Zugriffe von Office auf Edge oder Sensoren"
    ],
    choices: [
      {
        label: "IT/OT-DMZ und Firewall-Regeln zwischen Level 3 und 4 definieren",
        correct: true,
        feedback:
          "Richtig. Das Purdue-Modell trennt Zonen und erlaubt nur kontrollierte Kommunikation.",
        effects: { scale: 4, security: 20, documentation: 8 }
      },
      {
        label: "Alle Komponenten in ein gemeinsames VLAN legen",
        feedback:
          "Das war bereits Dr. Webers Audit-Kritik und ist für industrielle Umgebungen ungeeignet.",
        effects: { scale: -4, security: -20, documentation: -8 }
      },
      {
        label: "Nur starke Dashboard-Passwörter verwenden",
        feedback:
          "Passwörter helfen, ersetzen aber keine Segmentierung, TLS und Geräteidentitäten.",
        effects: { scale: 0, security: -12, documentation: -4 }
      }
    ]
  },
  {
    title: "IHK-Projektstruktur",
    text:
      "Markus möchte die IoT-Transformation als IHK-Projekt dokumentieren. Welche Struktur passt am besten?",
    briefing: [
      "Gefordert: Analyse, Planung, Durchführung, Kontrolle, Dokumentation",
      "Projekt: Sensorik, MQTT, Edge, InfluxDB, Security, Grafana",
      "Ziel: nachvollziehbare technische Begründungen"
    ],
    choices: [
      {
        label: "Analyse → Planung → Umsetzung → Test/Kontrolle → Dokumentation mit Technologiebegründung",
        correct: true,
        feedback:
          "Richtig. So wird aus der technischen Lösung eine prüfungsfähige Projektdokumentation.",
        effects: { scale: 4, security: 4, documentation: 22 }
      },
      {
        label: "Nur Screenshots aus Grafana abgeben",
        feedback:
          "Screenshots reichen nicht. Die IHK-Dokumentation braucht Analyse, Entscheidungen und Bewertung.",
        effects: { scale: 0, security: 0, documentation: -18 }
      },
      {
        label: "Nur den Python-Code dokumentieren",
        feedback:
          "Das Projekt ist eine Gesamtarchitektur. Code allein bildet Planung, Betrieb und Sicherheit nicht ab.",
        effects: { scale: -2, security: -2, documentation: -14 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let correct = 0;

const state = {
  scale: 70,
  security: 70,
  documentation: 60
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

function renderReview() {
  const item = reviews[current];
  selected = null;
  answered = false;

  el("roundBadge").textContent = `Review ${current + 1} / ${reviews.length}`;
  el("title").textContent = item.title;
  el("text").textContent = item.text;
  el("progressBar").style.width = `${(current / reviews.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("nextBtn").textContent = "Entscheidung prüfen";

  el("briefing").innerHTML = item.briefing
    .map(line => `<div class="story-line">${line}</div>`)
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
  const item = reviews[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Architekturentscheidung.</div>`;
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
        <h3>${choice.correct ? "Review bestanden" : "Architekturrisiko"}</h3>
        <p>${choice.feedback}</p>
      </div>
    `;

    el("nextBtn").textContent =
      current === reviews.length - 1 ? "Architekturfreigabe anzeigen" : "Nächster Review-Punkt";

    return;
  }

  current++;

  if (current < reviews.length) {
    renderReview();
  } else {
    showResult();
  }
});

function showResult() {
  el("progressBar").style.width = "100%";
  el("choices").innerHTML = "";
  el("nextBtn").style.display = "none";

  const avg = Math.round((state.scale + state.security + state.documentation) / 3);

  el("title").textContent = "Zielarchitektur freigegeben";
  el("text").innerHTML = `
    Korrekte Entscheidungen: <strong>${correct}</strong> von <strong>${reviews.length}</strong><br>
    Architektur-Reifegrad: <strong>${avg} / 100</strong>
  `;

  el("briefing").innerHTML = `
    <div class="story-line">[REFERENZ] Level 0/1: Sensoren, Aktoren, Maschinen</div>
    <div class="story-line">[REFERENZ] Level 2: Edge-Gateways mit Filterung, Puffern und lokalen Alarmen</div>
    <div class="story-line">[REFERENZ] Level 3: MQTT, Telegraf, InfluxDB, Node-RED</div>
    <div class="story-line">[REFERENZ] Level 4/5: Grafana, SAP, ML und Management-Analytics</div>
  `;

  el("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Merksatz</h3>
      <p>
        Eine Smart-Factory-Architektur ist mehr als Sensoren:
        Sie braucht Edge-Logik, sichere Kommunikation, Datenpipeline,
        Visualisierung, Betriebskonzept und eine prüfbare Dokumentation.
      </p>
    </div>
  `;
}

updateState();
renderReview();