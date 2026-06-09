const incidents = [
  {
    log: [
      "10:14:02 sensor_ntc: Spannung 1.87V erkannt",
      "10:14:03 raspberrypi: GPIO17 liest nur HIGH/LOW",
      "10:14:04 status: Temperaturwert springt unbrauchbar"
    ],
    question: "Was ist die richtige Maßnahme?",
    choices: [
      "ADS1115 als externen ADC über I2C einsetzen",
      "NTC direkt an 5V anschließen",
      "GPIO17 als UART TX verwenden",
      "Warnleuchte entfernen"
    ],
    correct: 0,
    impact: { stability: 0, quality: 0, safety: 0 },
    wrongImpact: { stability: -5, quality: -25, safety: -5 },
    explanation: "Ein Raspberry Pi kann analoge Spannungen nicht direkt messen. Ein ADC wandelt das Signal in digitale Werte."
  },
  {
    log: [
      "10:21:15 vibration_adxl345: 3200 Samples/s geplant",
      "10:21:16 bus: I2C ausgelastet",
      "10:21:17 analyse: Frequenzanteile fehlen"
    ],
    question: "Welche Schnittstelle ist für hohe Messraten besser?",
    choices: [
      "SPI",
      "1-Wire",
      "Relais",
      "GPIO Pull-up deaktivieren"
    ],
    correct: 0,
    impact: { stability: 0, quality: 0, safety: 0 },
    wrongImpact: { stability: -10, quality: -20, safety: 0 },
    explanation: "SPI ist deutlich schneller als I2C und eignet sich besser für hohe Abtastraten, z. B. bei Vibrationsanalyse."
  },
  {
    log: [
      "10:33:40 ds18b20: Sensoren über lange Leitung geplant",
      "10:33:41 bus: nur eine Datenleitung verfügbar",
      "10:33:42 ziel: mehrere Temperaturpunkte erfassen"
    ],
    question: "Welche Lösung passt am besten?",
    choices: [
      "DS18B20 über 1-Wire mit eindeutigen Sensor-IDs",
      "Alle Sensoren parallel auf denselben Analogpin",
      "SPI ohne Chip-Select",
      "UART TX und RX kurzschließen"
    ],
    correct: 0,
    impact: { stability: 0, quality: 0, safety: 0 },
    wrongImpact: { stability: -15, quality: -15, safety: 0 },
    explanation: "1-Wire eignet sich gut für mehrere digitale Temperatursensoren an einer Leitung. Jeder Sensor besitzt eine eindeutige Adresse."
  },
  {
    log: [
      "10:45:07 alarm: Spindeltemperatur 82.4°C",
      "10:45:08 gpio: WARN_LED_PIN = HIGH",
      "10:45:09 pumpe: keine Reaktion"
    ],
    question: "Warum reagiert die Kühlmittelpumpe nicht?",
    choices: [
      "GPIO braucht Relais, Schütz oder Treiberstufe für den Aktor",
      "Der ADC hat zu viele Bits",
      "1-Wire ist zu schnell",
      "Der Sensor muss auf UART umgestellt werden"
    ],
    correct: 0,
    impact: { stability: 0, quality: 0, safety: 0 },
    wrongImpact: { stability: -10, quality: 0, safety: -25 },
    explanation: "GPIO-Pins liefern nur 3,3V und wenige Milliampere. Pumpen und andere Aktoren müssen über geeignete Leistungsschalter gesteuert werden."
  },
  {
    log: [
      "11:02:22 adc: 10-Bit Testmessung 0–150°C",
      "11:02:23 auflösung: ca. 0.15°C pro Stufe",
      "11:02:24 lisa: Für Trendanalyse möglichst feinere Werte gewünscht"
    ],
    question: "Welche Verbesserung ist sinnvoll?",
    choices: [
      "16-Bit ADC verwenden, z. B. ADS1115",
      "ADC entfernen",
      "Temperatur nur als HIGH/LOW speichern",
      "Sensor an die Warnleuchte löten"
    ],
    correct: 0,
    impact: { stability: 0, quality: 0, safety: 0 },
    wrongImpact: { stability: 0, quality: -20, safety: -5 },
    explanation: "Ein 16-Bit ADC unterscheidet 65.536 Stufen und liefert deutlich feinere Messwerte als ein 10-Bit ADC."
  }
];

let current = 0;
let stability = 100;
let quality = 100;
let safety = 100;

const terminal = document.getElementById("terminal");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const stabilityBox = document.getElementById("stability");
const qualityBox = document.getElementById("quality");
const safetyBox = document.getElementById("safety");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function updateStatus() {
  stabilityBox.textContent = `${stability}%`;
  qualityBox.textContent = `${quality}%`;
  safetyBox.textContent = `${safety}%`;
}

function renderIncident() {
  feedback.innerHTML = "";

  const incident = incidents[current];

  terminal.innerHTML = `
    ${incident.log.map(line => `<div class="story-line">Novatech-Gateway $ ${line}</div>`).join("")}
    <div class="story-line"><strong>${incident.question}</strong></div>
  `;

  choices.innerHTML = "";

  shuffle(incident.choices.map((text, index) => ({ text, index }))).forEach(choice => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = choice.text;

    button.addEventListener("click", () => answer(choice.index, button));
    choices.appendChild(button);
  });
}

function answer(index, clickedButton) {
  const incident = incidents[current];
  const correct = index === incident.correct;

  document.querySelectorAll(".answer").forEach(button => {
    button.disabled = true;
  });

  if (correct) {
    clickedButton.classList.add("correct");
  } else {
    clickedButton.classList.add("wrong");
    stability = Math.max(0, stability + incident.wrongImpact.stability);
    quality = Math.max(0, quality + incident.wrongImpact.quality);
    safety = Math.max(0, safety + incident.wrongImpact.safety);
  }

  updateStatus();

  feedback.innerHTML = `
    <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
      <h3>${correct ? "Gateway stabilisiert!" : "Fehler erkannt."}</h3>
      <p>${incident.explanation}</p>
      <button class="primary" id="nextBtn">
        ${current === incidents.length - 1 ? "Auswertung anzeigen" : "Nächster Incident"}
      </button>
    </div>
  `;

  document.getElementById("nextBtn").addEventListener("click", () => {
    current++;

    if (current < incidents.length) {
      renderIncident();
    } else {
      showResult();
    }
  });
}

function showResult() {
  terminal.innerHTML = `
    <div class="story-line">Novatech-Gateway $ Diagnose abgeschlossen</div>
    <div class="story-line">Stabilität: ${stability}%</div>
    <div class="story-line">Datenqualität: ${quality}%</div>
    <div class="story-line">Sicherheit: ${safety}%</div>
  `;

  choices.innerHTML = "";

  feedback.innerHTML = `
    <div class="ch-card">
      <h2>Signal Rescue beendet</h2>
      <p>
        Markus hat jetzt ein sauberes Grundkonzept:
        Digitale Sensoren direkt über passende Busse,
        analoge Sensoren über ADC und Aktoren nur über geeignete Treiber.
      </p>
      <h3>Merksatz</h3>
      <p>
        Ein IoT-System ist erst vollständig, wenn Messen, Digitalisieren,
        Auswerten und Handeln sicher zusammenspielen.
      </p>
    </div>
  `;
}

updateStatus();
renderIncident();