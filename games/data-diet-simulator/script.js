const sensors = [
  {
    name: "Temperatur · Spindel",
    text:
      "Temperaturdaten sind relativ träge. Einzelne Rohwerte sind weniger wichtig als Durchschnitt, Maximum und Alarmgrenze.",
    stream: [
      "65.2 65.3 65.1 65.4 65.2 65.5",
      "65.3 65.4 65.2 65.6 78.5 80.2",
      "Muster: meist stabil, aber kritische Spitzen möglich"
    ],
    ideal: {
      window: "5s",
      deadband: "1c",
      alarm: "local-qos2"
    }
  },
  {
    name: "Vibration · X-Achse",
    text:
      "Vibrationen ändern sich schnell. Rohdaten sind hochfrequent, aber Anomalien müssen sofort erkannt werden.",
    stream: [
      "0.11 0.12 0.10 0.13 0.12 0.11",
      "0.12 0.14 0.19 0.34 0.81 1.20",
      "Muster: schnelle Peaks deuten auf Lagerproblem hin"
    ],
    ideal: {
      window: "1s",
      deadband: "small",
      alarm: "local-anomaly"
    }
  },
  {
    name: "Strom · Hauptantrieb",
    text:
      "Stromdaten zeigen Lastprofile. Für die Cloud reichen verdichtete Kennzahlen, aber Ausreißer müssen sichtbar bleiben.",
    stream: [
      "12.1A 12.4A 12.2A 12.3A 12.5A",
      "13.1A 14.8A 18.9A 15.2A 13.4A",
      "Muster: Lastwechsel und kurzzeitige Spitzen"
    ],
    ideal: {
      window: "5s",
      deadband: "5percent",
      alarm: "local-threshold"
    }
  }
];

const options = {
  window: [
    { value: "none", label: "Keine Aggregation", rateFactor: 1 },
    { value: "1s", label: "1-Sekunden-Fenster", rateFactor: 0.2 },
    { value: "5s", label: "5-Sekunden-Fenster", rateFactor: 0.04 },
    { value: "60s", label: "60-Sekunden-Fenster", rateFactor: 0.005 }
  ],
  deadband: [
    { value: "none", label: "Kein Dead-Band", rateFactor: 1 },
    { value: "small", label: "Kleines Dead-Band", rateFactor: 0.65 },
    { value: "1c", label: "1 °C / moderate Schwelle", rateFactor: 0.35 },
    { value: "5percent", label: "5 % Änderung", rateFactor: 0.45 },
    { value: "large", label: "Sehr großes Dead-Band", rateFactor: 0.12 }
  ],
  alarm: [
    { value: "cloud-only", label: "Alarmprüfung nur in der Cloud" },
    { value: "local-qos2", label: "Lokaler Alarm + QoS 2 Publish" },
    { value: "local-threshold", label: "Lokale Schwellwertprüfung" },
    { value: "local-anomaly", label: "Lokale Anomalie-Erkennung" }
  ]
};

let current = 0;
let results = [];
const baseRatePerSensorGroup = 47 * 10;

function fillSelect(id, items) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
}

function renderSensor() {
  const sensor = sensors[current];

  document.getElementById("sensorBadge").textContent =
    `Sensor ${current + 1} / ${sensors.length}`;

  document.getElementById("sensorTitle").textContent = sensor.name;
  document.getElementById("sensorText").textContent = sensor.text;

  document.getElementById("dataStream").innerHTML = sensor.stream
    .map(line => `<div class="story-line">${line}</div>`)
    .join("");

  document.getElementById("feedback").innerHTML = "";
}

function getOption(group, value) {
  return options[group].find(item => item.value === value);
}

function calculateRate(windowValue, deadbandValue) {
  const windowFactor = getOption("window", windowValue).rateFactor;
  const deadbandFactor = getOption("deadband", deadbandValue).rateFactor;
  return Math.max(1, Math.round(baseRatePerSensorGroup * windowFactor * deadbandFactor));
}

function evaluateChoice(sensor, windowValue, deadbandValue, alarmValue) {
  let score = 0;
  let warnings = [];

  if (windowValue === sensor.ideal.window) score++;
  else warnings.push("Aggregationsfenster nicht ideal für diese Messgröße.");

  if (deadbandValue === sensor.ideal.deadband) score++;
  else warnings.push("Dead-Band passt noch nicht optimal zum Signalverhalten.");

  if (alarmValue === sensor.ideal.alarm) score++;
  else warnings.push("Alarmstrategie sollte stärker lokal und sensorbezogen sein.");

  if (windowValue === "60s") {
    score--;
    warnings.push("60 Sekunden sind für industrielle Zustände oft zu grob.");
  }

  if (deadbandValue === "large") {
    score--;
    warnings.push("Ein zu großes Dead-Band kann schleichende Trends verbergen.");
  }

  if (alarmValue === "cloud-only") {
    score--;
    warnings.push("Sicherheitskritische Alarme dürfen nicht nur in der Cloud geprüft werden.");
  }

  return {
    score,
    warnings
  };
}

document.getElementById("simulateBtn").addEventListener("click", () => {
  const sensor = sensors[current];

  const windowValue = document.getElementById("windowSelect").value;
  const deadbandValue = document.getElementById("deadbandSelect").value;
  const alarmValue = document.getElementById("alarmSelect").value;

  const rate = calculateRate(windowValue, deadbandValue);
  const evaluation = evaluateChoice(sensor, windowValue, deadbandValue, alarmValue);

  results.push({
    sensor: sensor.name,
    rate,
    score: evaluation.score,
    windowValue,
    deadbandValue,
    alarmValue
  });

  const raw = baseRatePerSensorGroup;
  const reduction = Math.round((1 - rate / raw) * 100);

  document.getElementById("edgeRate").textContent = rate;
  document.getElementById("reduction").textContent = `${reduction}%`;

  const good = evaluation.score >= 3;

  document.getElementById("feedback").innerHTML = `
    <div class="ch-card ${good ? "correct-box" : "wrong-box"}">
      <h3>${good ? "Gute Edge-Diät" : "Noch riskant"}</h3>
      <p>
        Rohdatenrate für diese Messgröße: ${raw}/s<br>
        Nach Edge-Verarbeitung: ${rate}/s<br>
        Reduktion: ${reduction}%
      </p>
      <p>
        ${evaluation.warnings.length
          ? evaluation.warnings.join("<br>")
          : "Konfiguration passt sehr gut zur Messgröße."}
      </p>
    </div>
  `;

  current++;

  if (current < sensors.length) {
    setTimeout(renderSensor, 1200);
  } else {
    setTimeout(showSummary, 1200);
  }
});

function showSummary() {
  document.querySelector(".sim-layout").hidden = true;
  document.getElementById("summaryCard").hidden = false;

  const totalRaw = 2350;
  const totalEdge = results.reduce((sum, item) => sum + item.rate, 0);
  const reduction = Math.round((1 - totalEdge / totalRaw) * 100);
  const score = results.reduce((sum, item) => sum + item.score, 0);

  let rating = "Solide Edge-Strategie";
  if (score >= 9) rating = "Sehr starke Edge-Strategie";
  if (score < 5) rating = "Nachbesserung nötig";

  document.getElementById("summary").innerHTML = `
    <div class="status-grid">
      <div class="status-card"><span>Vorher</span><div>${totalRaw}/s</div></div>
      <div class="status-card"><span>Nachher</span><div>${totalEdge}/s</div></div>
      <div class="status-card"><span>Reduktion</span><div>${reduction}%</div></div>
    </div>

    <h3>${rating}</h3>

    <p>
      Deine Strategie reduziert die Datenmenge deutlich.
      Wichtig bleibt: Alarme werden niemals durch Aggregation oder Dead-Band unterdrückt.
    </p>

    <div class="terminal sim-terminal">
      <div class="story-line">[MERKSATZ] Aggregation reduziert Rohdaten, bewahrt aber Min/Max/Std.</div>
      <div class="story-line">[MERKSATZ] Dead-Band spart Bandbreite bei stabilen Werten.</div>
      <div class="story-line">[MERKSATZ] Lokale Alarme haben Vorrang vor Datenreduktion.</div>
      <div class="story-line">[MERKSATZ] Store-and-Forward schützt bei Netzwerkausfall vor Datenverlust.</div>
    </div>
  `;

  document.getElementById("edgeRate").textContent = totalEdge;
  document.getElementById("reduction").textContent = `${reduction}%`;
}

fillSelect("windowSelect", options.window);
fillSelect("deadbandSelect", options.deadband);
fillSelect("alarmSelect", options.alarm);
renderSensor();