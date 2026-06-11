const phases = [
  {
    title: "Alarm im Dashboard",
    text:
      "Nina meldet: Das Dashboard zeigt für Fräse12 keine neuen Temperaturdaten. Der MQTT-Subscriber ist verbunden.",
    evidence: [
      "$ mosquitto_sub -h broker -t 'novatech/halle1/cnc/+/temperatur/#'",
      "[connected] broker.novatech.local:1883",
      "[waiting] keine Nachrichten für fraese12"
    ],
    options: [
      {
        label: "Der Subscriber ist grundsätzlich verbunden, aber das erwartete Topic bekommt keine passenden Nachrichten.",
        correct: true,
        feedback:
          "Richtig. Die Verbindung steht. Der nächste Schritt ist Topic-Vergleich zwischen Publisher und Subscription."
      },
      {
        label: "Der Broker ist definitiv offline.",
        feedback:
          "Nein. Der Subscriber ist verbunden. Ein komplett ausgefallener Broker würde diese Verbindung verhindern."
      },
      {
        label: "MQTT unterstützt keine Wildcards.",
        feedback:
          "Falsch. MQTT unterstützt + für eine Ebene und # für mehrere Ebenen."
      }
    ]
  },
  {
    title: "Topic-Spur prüfen",
    text:
      "Tom findet die Publisher-Konfiguration des Raspberry Pi an Fräse12.",
    evidence: [
      "PUBLISH topic:",
      "novatech/halle1/cnc/fraese12/temp",
      "",
      "Dashboard subscription:",
      "novatech/halle1/cnc/+/temperatur/#"
    ],
    options: [
      {
        label: "Das Publisher-Topic nutzt temp statt temperatur und passt deshalb nicht zur Subscription.",
        correct: true,
        feedback:
          "Richtig. MQTT-Topics sind reine Strings. temp und temperatur sind unterschiedliche Topic-Level."
      },
      {
        label: "Das Pluszeichen verhindert Nachrichten von Fräse12.",
        feedback:
          "Nein. + ersetzt genau eine Ebene und würde fraese12 korrekt matchen."
      },
      {
        label: "Das # darf nie am Ende stehen.",
        feedback:
          "Falsch. # ist als Multi-Level-Wildcard am Ende einer Topic-Subscription typisch."
      }
    ]
  },
  {
    title: "WLAN ist instabil",
    text:
      "Markus meldet kurze Verbindungsabbrüche. Temperaturdaten kommen alle 5 Sekunden, Alarme sind selten, aber kritisch.",
    evidence: [
      "[network] packet loss 7%",
      "[sensor] temperature every 5s",
      "[alarm] emergency shutdown must not be lost",
      "[status] machine started/stopped should arrive at least once"
    ],
    options: [
      {
        label: "QoS 0 für Temperaturdaten, QoS 1 für Status, QoS 2 für kritische Alarme.",
        correct: true,
        feedback:
          "Richtig. Das ist eine pragmatische MQTT-Strategie: wenig Overhead für Messwerte, hohe Sicherheit für Alarme."
      },
      {
        label: "QoS 2 für alle Nachrichten.",
        feedback:
          "Zu teuer. QoS 2 erzeugt hohen Overhead und ist für häufige Standardmesswerte meist unnötig."
      },
      {
        label: "QoS 0 für alles, damit die Bandbreite niedrig bleibt.",
        feedback:
          "Gefährlich. Kritische Alarme dürfen nicht verloren gehen."
      }
    ]
  },
  {
    title: "Offline-Status fehlt",
    text:
      "Das Gateway von Fräse12 verliert plötzlich die Verbindung. Das Dashboard zeigt weiter den alten Zustand.",
    evidence: [
      "[client] fraese12-gateway connected",
      "[disconnect] unexpected network loss",
      "[dashboard] last value still visible",
      "[missing] no offline event received"
    ],
    options: [
      {
        label: "Beim Connect eine Last-Will-Nachricht für status=offline registrieren.",
        correct: true,
        feedback:
          "Richtig. Der Broker veröffentlicht den Last Will, wenn der Client unerwartet verschwindet."
      },
      {
        label: "QoS 0 für Statusmeldungen erzwingen.",
        feedback:
          "Nein. Das macht Statusmeldungen eher unzuverlässiger."
      },
      {
        label: "HTTP-Polling vom Dashboard alle 30 Minuten.",
        feedback:
          "Zu langsam und nicht ereignisgetrieben. MQTT-LWT ist der passende Mechanismus."
      }
    ]
  },
  {
    title: "Mosquitto-Test vorbereiten",
    text:
      "Du willst den Fix testen. Ein Terminal soll abonnieren, ein zweites veröffentlichen.",
    evidence: [
      "Terminal A:",
      "mosquitto_sub -h localhost -t 'novatech/halle1/cnc/+/temperatur/#' -v",
      "",
      "Terminal B:",
      "mosquitto_pub -h localhost -t '???' -m '72.5' -q 0"
    ],
    options: [
      {
        label: "novatech/halle1/cnc/fraese12/temperatur/spindel",
        correct: true,
        feedback:
          "Richtig. Dieses Topic passt zur Subscription und beschreibt sauber Maschine, Messart und Messpunkt."
      },
      {
        label: "novatech/halle1/cnc/fraese12/temp",
        feedback:
          "Das war genau das Problem: temp passt nicht auf temperatur/#."
      },
      {
        label: "halle1/novatech/temperatur/fraese12",
        feedback:
          "Nicht passend zur definierten Hierarchie. Eine konsistente Topic-Struktur ist wichtig für Wildcards."
      }
    ]
  }
];

let currentPhase = 0;
let selected = null;
let answered = false;
let analysisScore = 0;
let evidenceScore = 0;
let riskScore = 50;

const phaseBadge = document.getElementById("phaseBadge");
const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");
const evidenceBox = document.getElementById("evidenceBox");
const optionsBox = document.getElementById("options");
const checkBtn = document.getElementById("checkBtn");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");

const analysisScoreBox = document.getElementById("analysisScore");
const evidenceScoreBox = document.getElementById("evidenceScore");
const riskScoreBox = document.getElementById("riskScore");

const reportCard = document.getElementById("reportCard");
const submitReportBtn = document.getElementById("submitReportBtn");
const reportFeedback = document.getElementById("reportFeedback");

function updateScores() {
  analysisScoreBox.textContent = analysisScore;
  evidenceScoreBox.textContent = evidenceScore;
  riskScoreBox.textContent = riskScore;
}

function renderPhase() {
  selected = null;
  answered = false;

  const phase = phases[currentPhase];

  phaseBadge.textContent = `Phase ${currentPhase + 1} / ${phases.length}`;
  phaseTitle.textContent = phase.title;
  phaseText.textContent = phase.text;
  progressBar.style.width = `${(currentPhase / phases.length) * 100}%`;
  feedback.innerHTML = "";
  checkBtn.textContent = "Diagnose prüfen";

  evidenceBox.innerHTML = phase.evidence
    .map(line => `<div class="story-line">${line || "&nbsp;"}</div>`)
    .join("");

  optionsBox.innerHTML = "";

  phase.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer forensic-option";
    button.textContent = option.label;

    button.addEventListener("click", () => {
      if (answered) return;

      selected = index;

      document.querySelectorAll(".forensic-option").forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
    });

    optionsBox.appendChild(button);
  });
}

checkBtn.addEventListener("click", () => {
  const phase = phases[currentPhase];

  if (!answered) {
    if (selected === null) {
      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          Bitte wähle zuerst eine Diagnose.
        </div>
      `;
      return;
    }

    answered = true;

    const choice = phase.options[selected];

    document.querySelectorAll(".forensic-option").forEach((button, index) => {
      if (phase.options[index].correct) {
        button.classList.add("correct");
      }

      if (index === selected && !phase.options[index].correct) {
        button.classList.add("wrong");
      }
    });

    if (choice.correct) {
      analysisScore += 20;
      evidenceScore += 20;
      riskScore = Math.max(0, riskScore - 8);

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Beweis korrekt interpretiert</h3>
          <p>${choice.feedback}</p>
        </div>
      `;
    } else {
      analysisScore += 5;
      riskScore = Math.min(100, riskScore + 8);

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Diagnose unsauber</h3>
          <p>${choice.feedback}</p>
        </div>
      `;
    }

    updateScores();

    checkBtn.textContent =
      currentPhase === phases.length - 1 ? "Incident Report erstellen" : "Nächste Spur";

    return;
  }

  currentPhase++;

  if (currentPhase < phases.length) {
    renderPhase();
  } else {
    showReport();
  }
});

function showReport() {
  progressBar.style.width = "100%";
  document.querySelector(".investigation-layout").hidden = true;
  reportCard.hidden = false;
}

submitReportBtn.addEventListener("click", () => {
  const cause = document.getElementById("causeSelect").value;
  const qos = document.getElementById("qosSelect").value;
  const lwt = document.getElementById("lwtSelect").value;

  let reportScore = 0;
  const details = [];

  if (cause === "topic") {
    reportScore++;
    details.push("Primäre Ursache korrekt: Publisher und Subscriber nutzten unterschiedliche Topic-Strukturen.");
  } else {
    details.push("Primäre Ursache verfehlt: Der Broker lief, aber das Topic passte nicht zur Subscription.");
  }

  if (qos === "mixed") {
    reportScore++;
    details.push("QoS-Strategie korrekt: differenziert nach Kritikalität und Overhead.");
  } else {
    details.push("QoS-Strategie nicht optimal: Nicht jede Nachricht braucht dieselbe Zuverlässigkeitsstufe.");
  }

  if (lwt === "lwt") {
    reportScore++;
    details.push("Offline-Erkennung korrekt: Last Will veröffentlicht den Ausfall automatisch.");
  } else {
    details.push("Offline-Erkennung unzureichend: Für unerwartete Disconnects ist LWT der passende Mechanismus.");
  }

  let title = "Incident teilweise gelöst";
  let boxClass = "wrong-box";

  if (reportScore === 3) {
    title = "Incident sauber abgeschlossen";
    boxClass = "correct-box";
    analysisScore += 20;
    evidenceScore += 20;
    riskScore = Math.max(0, riskScore - 20);
  } else {
    riskScore = Math.min(100, riskScore + 10);
  }

  updateScores();

  reportFeedback.innerHTML = `
    <div class="ch-card ${boxClass}">
      <h3>${title}</h3>
      <p>${details.join("<br>")}</p>
      <h3>Merksatz</h3>
      <p>
        MQTT-Troubleshooting beginnt bei Verbindung, Topic-Match, QoS und Client-Lifecycle.
        Ein einzelner falscher Topic-Level reicht aus, damit scheinbar „keine Daten“ ankommen.
      </p>
    </div>
  `;

  submitReportBtn.disabled = true;
});

updateScores();
renderPhase();