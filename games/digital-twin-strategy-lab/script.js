const decisions = [
  {
    title: "Dashboard oder Digital Twin?",
    text:
      "Sarah fragt: Was unterscheidet einen Digital Twin vom bestehenden Grafana-Dashboard?",
    context: [
      "Dashboard: zeigt aktuellen Zustand und historische Trends",
      "Digital Twin: modelliert Verhalten und sagt zukünftige Zustände voraus",
      "Beispiel: Prognose 85 °C in 45 Minuten"
    ],
    display: ["Ist-Zustand", "Modell", "Prognose"],
    choices: [
      {
        label: "Digital Twin ergänzt Dashboard um Modell, Simulation und Prognose",
        correct: true,
        feedback:
          "Richtig. Ein Dashboard zeigt, was passiert. Ein Digital Twin hilft zu verstehen und vorherzusagen, was passieren wird.",
        effects: { business: 16, maturity: 10, risk: -4 }
      },
      {
        label: "Digital Twin ist nur ein anderes Wort für Dashboard",
        feedback:
          "Nein. Der Digital Twin enthält ein Modell des physischen Systems und ermöglicht Simulationen.",
        effects: { business: -10, maturity: -8, risk: 8 }
      },
      {
        label: "Digital Twin ersetzt Sensoren",
        feedback:
          "Falsch. Ohne Sensordaten kann der digitale Zwilling nicht aktuell bleiben.",
        effects: { business: -8, maturity: -10, risk: 10 }
      }
    ]
  },
  {
    title: "Welche Voraussetzung fehlt?",
    text:
      "NovaTech hat Sensoren, MQTT, Edge, InfluxDB und Grafana. Was braucht der Digital Twin zusätzlich?",
    context: [
      "Vorhanden: Echtzeitdaten und historische Zeitreihen",
      "Fehlt: Maschinenmodell, ML/Physikmodell, Validierung",
      "Ziel: Verhalten simulieren und Prognosen ableiten"
    ],
    display: ["Zeitreihen", "+ Modell", "+ Simulation"],
    choices: [
      {
        label: "Ein validiertes Maschinenmodell plus historische Trainingsdaten",
        correct: true,
        feedback:
          "Richtig. Echtzeitdaten allein reichen nicht; der Twin braucht ein Modell und Lern-/Validierungsdaten.",
        effects: { business: 10, maturity: 16, risk: -6 }
      },
      {
        label: "Nur mehr Grafana-Panels",
        feedback:
          "Mehr Panels verbessern Sichtbarkeit, erzeugen aber kein Simulationsmodell.",
        effects: { business: 2, maturity: -8, risk: 4 }
      },
      {
        label: "Nur einen größeren MQTT-Broker",
        feedback:
          "Skalierung ist wichtig, aber kein Ersatz für Modellierung und Prognosefähigkeit.",
        effects: { business: 0, maturity: -4, risk: 4 }
      }
    ]
  },
  {
    title: "Build vs. Buy",
    text:
      "Ein Konkurrent nutzt eine fertige IoT-Plattform. Lisa fragt, wann NovaTech kaufen statt selbst bauen sollte.",
    context: [
      "Build: mehr Kontrolle, höhere Eigenverantwortung",
      "Buy: schneller Start, Herstellerfunktionen, Lizenzkosten",
      "Bewertung: Know-how, Zeit, Compliance, Integrationen"
    ],
    display: ["Build", "Buy", "Hybrid"],
    choices: [
      {
        label: "Hybrid bewerten: Kernkompetenz selbst, Standardfunktionen ggf. Plattform",
        correct: true,
        feedback:
          "Richtig. Build-vs.-Buy ist eine Abwägung aus Kontrolle, Kosten, Geschwindigkeit und Betrieb.",
        effects: { business: 14, maturity: 8, risk: -8 }
      },
      {
        label: "Immer alles selbst bauen",
        feedback:
          "Das kann Kontrolle bringen, aber Betrieb, Security und Time-to-Market stark belasten.",
        effects: { business: -4, maturity: -4, risk: 10 }
      },
      {
        label: "Immer sofort vollständige Fremdplattform kaufen",
        feedback:
          "Das kann schnell sein, aber Vendor-Lock-in und Anpassungsgrenzen erzeugen.",
        effects: { business: 0, maturity: 2, risk: 6 }
      }
    ]
  },
  {
    title: "ROI für Lisa",
    text:
      "Lisa möchte wissen, ob sich der Rollout wirtschaftlich lohnt. Welche Kennzahlen sind überzeugend?",
    context: [
      "Ziel: ungeplante Ausfallzeit reduzieren",
      "Messbar: Verfügbarkeit, Alarme, Wartungskosten, Stillstandsdauer",
      "Nutzen: Predictive Maintenance"
    ],
    display: ["Ausfallzeit", "Verfügbarkeit", "Wartungskosten"],
    choices: [
      {
        label: "Eingesparte Stillstandszeit, Verfügbarkeit und vermiedene Wartungskosten berechnen",
        correct: true,
        feedback:
          "Richtig. Für Management-Entscheidungen zählen technische und wirtschaftliche Kennzahlen zusammen.",
        effects: { business: 18, maturity: 4, risk: -4 }
      },
      {
        label: "Nur Anzahl der MQTT-Nachrichten berichten",
        feedback:
          "Technisch interessant, aber kein ausreichender Business Case.",
        effects: { business: -12, maturity: 2, risk: 2 }
      },
      {
        label: "Nur Screenshots des Dashboards zeigen",
        feedback:
          "Visualisierung ist hilfreich, ersetzt aber keine ROI-Bewertung.",
        effects: { business: -10, maturity: 0, risk: 4 }
      }
    ]
  },
  {
    title: "IHK-taugliches Projekt",
    text:
      "Markus sucht einen geeigneten Projektrahmen. Welche Variante ist am besten dokumentierbar?",
    context: [
      "IHK-Struktur: Analyse, Planung, Durchführung, Kontrolle, Dokumentation",
      "Geeignet: klarer Ausgangszustand, technische Auswahl, messbares Ergebnis",
      "Ziel: nachvollziehbare Entscheidungen"
    ],
    display: ["Analyse", "Planung", "Kontrolle"],
    choices: [
      {
        label: "MQTT-zu-InfluxDB-Pipeline mit Edge-Filterung, Security und Grafana-Validierung",
        correct: true,
        feedback:
          "Richtig. Das Projekt hat klare Anforderungen, Technologieauswahl, Umsetzung und überprüfbare Ergebnisse.",
        effects: { business: 6, maturity: 14, risk: -6 }
      },
      {
        label: "Unbegrenztes Forschungsprojekt Digital Twin für alle Maschinen",
        feedback:
          "Zu groß und schwer abgrenzbar für eine IHK-Projektdokumentation.",
        effects: { business: 4, maturity: -8, risk: 12 }
      },
      {
        label: "Nur eine allgemeine IoT-Begriffserklärung",
        feedback:
          "Zu theoretisch. Eine Projektarbeit braucht konkrete Planung und Durchführung.",
        effects: { business: -6, maturity: -12, risk: 6 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let correct = 0;

const state = {
  business: 65,
  maturity: 60,
  risk: 45
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

function renderDecision() {
  const item = decisions[current];
  selected = null;
  answered = false;

  el("labBadge").textContent = `Strategiefrage ${current + 1} / ${decisions.length}`;
  el("title").textContent = item.title;
  el("text").textContent = item.text;
  el("progressBar").style.width = `${(current / decisions.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("nextBtn").textContent = "Entscheidung bewerten";

  el("contextBox").innerHTML = item.context
    .map(line => `<div class="story-line">${line}</div>`)
    .join("");

  el("twinDisplay").innerHTML = item.display
    .map(label => `<div class="machine-box">${label}</div>`)
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
  const item = decisions[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Strategieentscheidung.</div>`;
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
        <h3>${choice.correct ? "Strategisch sauber" : "Strategisches Risiko"}</h3>
        <p>${choice.feedback}</p>
      </div>
    `;

    el("nextBtn").textContent =
      current === decisions.length - 1 ? "Strategie-Fazit anzeigen" : "Nächste Strategiefrage";

    return;
  }

  current++;

  if (current < decisions.length) {
    renderDecision();
  } else {
    showResult();
  }
});

function showResult() {
  el("progressBar").style.width = "100%";
  el("choices").innerHTML = "";
  el("nextBtn").style.display = "none";

  const readiness = Math.round((state.business + state.maturity + (100 - state.risk)) / 3);

  el("title").textContent = "Strategie-Lab abgeschlossen";
  el("text").innerHTML = `
    Korrekte Strategieentscheidungen: <strong>${correct}</strong> von <strong>${decisions.length}</strong><br>
    Digital-Twin-Readiness: <strong>${readiness} / 100</strong>
  `;

  el("twinDisplay").innerHTML = `
    <div class="machine-box ok">Datenbasis</div>
    <div class="machine-box ok">Modell</div>
    <div class="machine-box ok">Prognose</div>
  `;

  el("contextBox").innerHTML = `
    <div class="story-line">[MERKSATZ] Ein Dashboard zeigt Zustand. Ein Digital Twin modelliert Verhalten.</div>
    <div class="story-line">[MERKSATZ] Skalierung braucht Device Management, Zertifikatsverwaltung und Betriebskonzepte.</div>
    <div class="story-line">[MERKSATZ] Build-vs.-Buy ist eine Architektur- und Businessentscheidung.</div>
    <div class="story-line">[MERKSATZ] IHK-Projekte brauchen klare Analyse, Planung, Durchführung und Kontrolle.</div>
  `;

  el("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Zusammenfassung</h3>
      <p>
        NovaTech hat mit Sensorik, Edge, MQTT, InfluxDB, Security und Grafana das Fundament gelegt.
        Der Digital Twin ist die nächste Stufe: Er braucht zusätzlich Modelle, Prognosen und klare Business-Ziele.
      </p>
    </div>
  `;
}

updateState();
renderDecision();