const missions = [
  {
    title: "Spindeltemperatur überwachen",
    text: "Sarah möchte die Temperatur am Fräskopf zuverlässig messen. Es kann dort deutlich heiß werden.",
    options: [
      "Typ-K-Thermoelement + passender Wandler",
      "DS18B20 direkt in den Motorstromkreis",
      "Hall-Sensor am Kühlmittelschlauch",
      "ADXL345 per SPI"
    ],
    correct: 0,
    explanation: "Für hohe Temperaturen am Fräskopf ist ein Typ-K-Thermoelement geeignet. Es arbeitet über den Seebeck-Effekt und deckt sehr hohe Temperaturbereiche ab."
  },
  {
    title: "Umgebungstemperatur erfassen",
    text: "Tom braucht einen einfachen, digitalen Sensor für die Umgebung der Maschine.",
    options: [
      "DS18B20 über 1-Wire",
      "Stromzange mit Hall-Effekt",
      "Relaiskarte am GPIO",
      "Frequenzumrichter über SPI"
    ],
    correct: 0,
    explanation: "Der DS18B20 liefert bereits digitale Temperaturwerte über 1-Wire. Für einfache Temperaturmessungen ist kein externer ADC nötig."
  },
  {
    title: "Werkzeugverschleiß erkennen",
    text: "Steigende Vibrationen sollen auf ein verschlissenes Fräswerkzeug hinweisen.",
    options: [
      "MEMS-Beschleunigungssensor, z. B. ADXL345",
      "NTC-Thermistor im Kühlmittel",
      "Warnleuchte am GPIO",
      "UART-GPS-Modul"
    ],
    correct: 0,
    explanation: "Vibration wird mit Beschleunigungssensoren gemessen. MEMS-Sensoren erkennen Bewegungen und Schwingungen in mehreren Achsen."
  },
  {
    title: "Stromaufnahme nachrüsten",
    text: "Markus möchte den Motorstrom erfassen, ohne den bestehenden Stromkreis aufzutrennen.",
    options: [
      "Hall-Effekt-Stromsensor um die Leitung",
      "DS18B20 am GPIO 4",
      "Magnetventil am Relais",
      "1-Wire-Temperatursensor"
    ],
    correct: 0,
    explanation: "Hall-Sensoren messen das Magnetfeld um eine stromführende Leitung. Dadurch ist kontaktlose Nachrüstung möglich."
  },
  {
    title: "Analogsignal am Raspberry Pi",
    text: "Ein NTC-Thermistor liefert eine Spannung zwischen 0 und 3,3 Volt. Was braucht der Raspberry Pi?",
    options: [
      "Externen ADC, z. B. ADS1115",
      "Nur einen digitalen GPIO-Eingang",
      "Relaiskarte",
      "PWM-Ausgang"
    ],
    correct: 0,
    explanation: "Der Raspberry Pi hat keinen eingebauten ADC. Analoge Spannungen müssen zuerst digitalisiert werden."
  },
  {
    title: "Aktor bei Übertemperatur",
    text: "Bei über 80 °C soll die Anlage reagieren: Warnleuchte an und Kühlmittelpumpe hochfahren.",
    options: [
      "GPIO schaltet Relais oder Schütz für den Aktor",
      "Sensor direkt mit 230 V verbinden",
      "I2C-Adresse ändern",
      "ADC-Auflösung reduzieren"
    ],
    correct: 0,
    explanation: "GPIO-Pins liefern nur kleine Ströme. Industrielle Aktoren werden über Relais, Schütze oder Treiberstufen geschaltet."
  }
];

let current = 0;
let score = 0;
let selected = null;
let answered = false;

const mission = document.getElementById("mission");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function updateProgress() {
  progressBar.style.width = `${Math.round((current / missions.length) * 100)}%`;
}

function render() {
  updateProgress();
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Auswahl prüfen";

  const item = missions[current];
  mission.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.text}</p>
  `;

  answers.innerHTML = "";

  shuffle(item.options.map((text, originalIndex) => ({ text, originalIndex }))).forEach(option => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = option.text;
    button.dataset.index = option.originalIndex;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = Number(button.dataset.index);
    });

    answers.appendChild(button);
  });
}

checkBtn.addEventListener("click", () => {
  const item = missions[current];

  if (selected === null) {
    feedback.innerHTML = "<p><strong>Bitte wähle zuerst eine Option.</strong></p>";
    return;
  }

  if (!answered) {
    answered = true;

    document.querySelectorAll(".answer").forEach(button => {
      const index = Number(button.dataset.index);
      if (index === item.correct) button.classList.add("correct");
      if (index === selected && index !== item.correct) button.classList.add("wrong");
    });

    if (selected === item.correct) score++;

    feedback.innerHTML = `
      <div class="ch-card ${selected === item.correct ? "correct-box" : "wrong-box"}">
        <h3>${selected === item.correct ? "Passt!" : "Noch nicht optimal."}</h3>
        <p>${item.explanation}</p>
      </div>
    `;

    checkBtn.textContent = current === missions.length - 1 ? "Ergebnis anzeigen" : "Weiter";
    return;
  }

  current++;

  if (current < missions.length) {
    render();
  } else {
    progressBar.style.width = "100%";
    mission.innerHTML = `
      <h2>Sensorkonzept abgeschlossen</h2>
      <p>Du hast <strong>${score}</strong> von <strong>${missions.length}</strong> Entscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>Sensor auswählen heißt: Messgröße, Messbereich, Signalart, Schnittstelle, Montageort und Abtastrate gemeinsam betrachten.</p>
    `;
    answers.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

render();