const incidents = [
  {
    title: "Dashboard bleibt leer",
    text:
      "Sarah öffnet morgens das Monitoring-Dashboard. Es zeigt keine Werte, bis der nächste Sensorzyklus eintrifft. Wie sorgst du dafür, dass neue Subscriber sofort den letzten bekannten Wert erhalten?",
    log: [
      "[08:02:11] Dashboard connected",
      "[08:02:12] SUB novatech/halle1/cnc/+/temperatur/spindel",
      "[08:02:13] Keine Daten bis zum nächsten Publish"
    ],
    choices: [
      {
        label: "Retained Message für aktuelle Sensorwerte aktivieren",
        explanation:
          "Richtig. Retained Messages speichern pro Topic den letzten Wert. Neue Subscriber erhalten ihn sofort.",
        effects: { reliability: 12, bandwidth: 0, scalability: 6, safety: 3 },
        correct: true
      },
      {
        label: "QoS 2 für alle Temperaturdaten erzwingen",
        explanation:
          "Nicht optimal. QoS 2 garantiert Zustellung, löst aber nicht das Problem leerer Dashboards beim Verbinden.",
        effects: { reliability: 4, bandwidth: -12, scalability: -5, safety: 2 }
      },
      {
        label: "Alle Sensoren per HTTP pollen",
        explanation:
          "Schlecht für IoT-Skalierung. Polling erzeugt unnötige Requests und koppelt Dashboard und Sensoren stärker.",
        effects: { reliability: -4, bandwidth: -15, scalability: -12, safety: 0 }
      }
    ]
  },
  {
    title: "Instabiles WLAN in Halle 1",
    text:
      "Ein Raspberry Pi sendet alle 5 Sekunden Temperaturdaten. Einzelne Werte dürfen verloren gehen, weil sofort neue Messwerte folgen. Welche QoS-Stufe wählst du?",
    log: [
      "[09:14:02] WLAN packet loss detected",
      "[09:14:05] Sensor cycle: 5 Sekunden",
      "[09:14:06] Messwert nicht kritisch, nächster Wert folgt"
    ],
    choices: [
      {
        label: "QoS 0",
        explanation:
          "Richtig. Für regelmäßige, unkritische Sensordaten ist QoS 0 effizient: geringer Overhead, verlorene Einzelwerte sind akzeptabel.",
        effects: { reliability: 4, bandwidth: 12, scalability: 8, safety: 0 },
        correct: true
      },
      {
        label: "QoS 1",
        explanation:
          "Akzeptabel, aber nicht ideal. QoS 1 erzeugt Bestätigungen und mögliche Duplikate. Für einfache Temperaturzyklen oft zu viel.",
        effects: { reliability: 8, bandwidth: -4, scalability: -2, safety: 1 }
      },
      {
        label: "QoS 2",
        explanation:
          "Zu schwergewichtig. QoS 2 ist für kritische Alarme geeignet, nicht für häufige Standardmesswerte.",
        effects: { reliability: 10, bandwidth: -16, scalability: -10, safety: 2 }
      }
    ]
  },
  {
    title: "Kritischer Spindelalarm",
    text:
      "Fräse12 meldet: Spindeltemperatur über 85 °C. Der Alarm darf weder verloren gehen noch doppelt verarbeitet werden. Welche MQTT-Zustellung ist passend?",
    log: [
      "[10:31:44] ALARM temperature=87.4",
      "[10:31:45] Target: emergency shutdown workflow",
      "[10:31:45] Verlust oder Duplikat nicht akzeptabel"
    ],
    choices: [
      {
        label: "QoS 2",
        explanation:
          "Richtig. QoS 2 garantiert Exactly once und passt für kritische Alarme oder Steuerbefehle.",
        effects: { reliability: 15, bandwidth: -6, scalability: -2, safety: 15 },
        correct: true
      },
      {
        label: "QoS 0",
        explanation:
          "Gefährlich. Fire-and-forget kann Nachrichten verlieren und ist für Notabschaltung ungeeignet.",
        effects: { reliability: -15, bandwidth: 8, scalability: 4, safety: -18 }
      },
      {
        label: "HTTP GET vom Dashboard",
        explanation:
          "Falsches Muster. Ein Alarm muss aktiv gepusht werden, nicht darauf warten, dass ein Dashboard ihn abfragt.",
        effects: { reliability: -8, bandwidth: -8, scalability: -10, safety: -10 }
      }
    ]
  },
  {
    title: "Machine-Learning-System kommt dazu",
    text:
      "Tom will morgen eine ML-Pipeline anschließen, die alle Vibrationsdaten aus Halle 1 konsumiert. Die Sensoren sollen nicht umkonfiguriert werden.",
    log: [
      "[11:07:21] Neuer Consumer: ML Pipeline",
      "[11:07:22] Benötigt: alle Vibrationen aus Halle 1",
      "[11:07:23] Sensor-Firmware darf unverändert bleiben"
    ],
    choices: [
      {
        label: "ML-Pipeline abonniert novatech/halle1/+/+/+/vibration/#",
        explanation:
          "Richtig gedacht: Ein neuer Subscriber kann passende Topics abonnieren, ohne Publisher zu ändern.",
        effects: { reliability: 3, bandwidth: 3, scalability: 14, safety: 2 },
        correct: true
      },
      {
        label: "Jeden Sensor neu konfigurieren und direkt an ML senden lassen",
        explanation:
          "Das widerspricht Publish/Subscribe. Sensoren sollten Empfänger nicht kennen.",
        effects: { reliability: -3, bandwidth: -8, scalability: -16, safety: -2 }
      },
      {
        label: "Für ML komplett auf HTTP umstellen",
        explanation:
          "Unnötig. MQTT kann mehrere Subscriber elegant versorgen. HTTP ist eher für Backend-APIs geeignet.",
        effects: { reliability: -2, bandwidth: -10, scalability: -10, safety: 0 }
      }
    ]
  },
  {
    title: "Gateway verschwindet plötzlich",
    text:
      "Das Edge-Gateway von Fräse12 stürzt ab. Das Dashboard soll automatisch sehen, dass die Maschine offline ist.",
    log: [
      "[12:22:09] Client fraese12-gateway connected",
      "[12:28:41] Unexpected disconnect",
      "[12:28:42] Dashboard zeigt weiterhin alten Status"
    ],
    choices: [
      {
        label: "Last Will and Testament auf status=offline setzen",
        explanation:
          "Richtig. Der Broker veröffentlicht die LWT-Nachricht automatisch bei unerwartetem Verbindungsabbruch.",
        effects: { reliability: 12, bandwidth: 0, scalability: 4, safety: 10 },
        correct: true
      },
      {
        label: "Nur Retained Messages aktivieren",
        explanation:
          "Retained Messages helfen neuen Subscribern, erkennen aber keinen unerwarteten Client-Ausfall.",
        effects: { reliability: 2, bandwidth: 0, scalability: 2, safety: -4 }
      },
      {
        label: "QoS 0 für Statusmeldungen verwenden",
        explanation:
          "Statusmeldungen sollten zuverlässig sein. Für Offline-Erkennung ist LWT der passende MQTT-Mechanismus.",
        effects: { reliability: -6, bandwidth: 4, scalability: 0, safety: -8 }
      }
    ]
  },
  {
    title: "SAP-Integration gefordert",
    text:
      "Das ERP-System SAP bietet eine REST-API. Die Sensoren sprechen MQTT. Wie sollte NovaTech die Architektur sauber koppeln?",
    log: [
      "[14:05:00] SAP endpoint: REST",
      "[14:05:01] IoT side: MQTT Broker",
      "[14:05:03] Ziel: entkoppelte, robuste Integration"
    ],
    choices: [
      {
        label: "MQTT-zu-REST-Adapter zwischen Broker und SAP einsetzen",
        explanation:
          "Richtig. Ein Adapter entkoppelt IoT und ERP, transformiert Daten und behandelt Fehler gezielt.",
        effects: { reliability: 10, bandwidth: 2, scalability: 8, safety: 6 },
        correct: true
      },
      {
        label: "Alle Sensoren direkt gegen SAP REST senden lassen",
        explanation:
          "Schlecht skalierbar und stark gekoppelt. Sensoren sollten nicht SAP-spezifisch konfiguriert werden.",
        effects: { reliability: -8, bandwidth: -12, scalability: -15, safety: -4 }
      },
      {
        label: "SAP direkt als MQTT-Broker verwenden",
        explanation:
          "Nur sinnvoll, wenn SAP diese Rolle explizit bietet. Sauberer ist ein Adapter oder eine IoT-Plattform.",
        effects: { reliability: -2, bandwidth: 0, scalability: -6, safety: -3 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;
let timeLeft = 30;
let timerId = null;

const state = {
  reliability: 70,
  bandwidth: 70,
  scalability: 70,
  safety: 70
};

const elements = {
  reliability: document.getElementById("reliability"),
  bandwidth: document.getElementById("bandwidth"),
  scalability: document.getElementById("scalability"),
  safety: document.getElementById("safety"),
  progressBar: document.getElementById("progressBar"),
  roundBadge: document.getElementById("roundBadge"),
  timer: document.getElementById("timer"),
  incidentTitle: document.getElementById("incidentTitle"),
  incidentText: document.getElementById("incidentText"),
  console: document.getElementById("console"),
  choices: document.getElementById("choices"),
  confirmBtn: document.getElementById("confirmBtn"),
  feedback: document.getElementById("feedback")
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStatus() {
  Object.keys(state).forEach(key => {
    state[key] = clamp(state[key]);
    elements[key].textContent = state[key];

    elements[key].parentElement.classList.remove("status-good", "status-warn", "status-bad");

    if (state[key] >= 70) {
      elements[key].parentElement.classList.add("status-good");
    } else if (state[key] >= 45) {
      elements[key].parentElement.classList.add("status-warn");
    } else {
      elements[key].parentElement.classList.add("status-bad");
    }
  });
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state[key] += value;
  });
  updateStatus();
}

function renderIncident() {
  clearInterval(timerId);

  selected = null;
  answered = false;
  timeLeft = 30;

  const incident = incidents[current];

  elements.roundBadge.textContent = `Ereignis ${current + 1} / ${incidents.length}`;
  elements.incidentTitle.textContent = incident.title;
  elements.incidentText.textContent = incident.text;
  elements.feedback.innerHTML = "";
  elements.confirmBtn.textContent = "Entscheidung übernehmen";
  elements.confirmBtn.style.display = "inline-block";
  elements.progressBar.style.width = `${(current / incidents.length) * 100}%`;

  elements.console.innerHTML = incident.log
    .map(line => `<div class="story-line">${line}</div>`)
    .join("");

  elements.choices.innerHTML = "";

  incident.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "answer control-choice";
    button.textContent = choice.label;

    button.addEventListener("click", () => {
      if (answered) return;

      document.querySelectorAll(".control-choice").forEach(btn => {
        btn.classList.remove("selected");
      });

      selected = index;
      button.classList.add("selected");
    });

    elements.choices.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  elements.timer.textContent = `${timeLeft}s`;

  timerId = setInterval(() => {
    timeLeft--;
    elements.timer.textContent = `${timeLeft}s`;

    if (timeLeft <= 10) {
      elements.timer.classList.add("timer-danger");
    } else {
      elements.timer.classList.remove("timer-danger");
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  if (answered) return;

  answered = true;
  applyEffects({
    reliability: -8,
    bandwidth: -3,
    scalability: -4,
    safety: -8
  });

  elements.feedback.innerHTML = `
    <div class="ch-card wrong-box">
      <h3>Zu spät reagiert</h3>
      <p>
        Im Betrieb zählt eine klare Entscheidung. NovaTech verliert durch die Verzögerung Stabilität und Sicherheit.
      </p>
    </div>
  `;

  elements.confirmBtn.textContent =
    current === incidents.length - 1 ? "Ergebnis anzeigen" : "Nächstes Ereignis";
}

elements.confirmBtn.addEventListener("click", () => {
  const incident = incidents[current];

  if (!answered) {
    if (selected === null) {
      elements.feedback.innerHTML = `
        <div class="ch-card wrong-box">
          Bitte wähle zuerst eine Betriebsentscheidung.
        </div>
      `;
      return;
    }

    clearInterval(timerId);
    answered = true;

    const choice = incident.choices[selected];

    applyEffects(choice.effects);

    document.querySelectorAll(".control-choice").forEach((button, index) => {
      if (incident.choices[index].correct) {
        button.classList.add("correct");
      }

      if (index === selected && !incident.choices[index].correct) {
        button.classList.add("wrong");
      }
    });

    if (choice.correct) {
      score++;
      elements.feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Gute Leitstellenentscheidung</h3>
          <p>${choice.explanation}</p>
        </div>
      `;
    } else {
      elements.feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Riskante Entscheidung</h3>
          <p>${choice.explanation}</p>
        </div>
      `;
    }

    elements.confirmBtn.textContent =
      current === incidents.length - 1 ? "Ergebnis anzeigen" : "Nächstes Ereignis";

    return;
  }

  current++;

  if (current < incidents.length) {
    renderIncident();
  } else {
    showResult();
  }
});

function averageScore() {
  return Math.round(
    (state.reliability + state.bandwidth + state.scalability + state.safety) / 4
  );
}

function showResult() {
  clearInterval(timerId);
  elements.progressBar.style.width = "100%";
  elements.confirmBtn.style.display = "none";
  elements.choices.innerHTML = "";

  const finalScore = averageScore();

  let rating = "Solider Betrieb";
  let message =
    "Du hast die wichtigsten MQTT-Entscheidungen verstanden. Achte im Betrieb weiter auf passende QoS-Stufen und Entkopplung.";

  if (finalScore >= 85 && score >= 5) {
    rating = "Control-Room-Profi";
    message =
      "Sehr stark. Du hast MQTT wie ein echter IoT-Engineer eingesetzt: effizient, zuverlässig und skalierbar.";
  } else if (finalScore < 55) {
    rating = "Nachschulung empfohlen";
    message =
      "Die Architektur ist noch riskant. Wiederhole QoS, Publish/Subscribe, Retained Messages und Last Will.";
  }

  elements.incidentTitle.textContent = "Schicht beendet";
  elements.incidentText.innerHTML = `
    <strong>${rating}</strong><br>
    Richtige Entscheidungen: ${score} von ${incidents.length}<br>
    Betriebswert: ${finalScore} / 100
  `;

  elements.console.innerHTML = `
    <div class="story-line">[SUMMARY] MQTT eignet sich für viele Sensoren und viele Empfänger.</div>
    <div class="story-line">[SUMMARY] QoS 0 für unkritische Messwerte, QoS 1 für wichtige Statusmeldungen, QoS 2 für kritische Alarme.</div>
    <div class="story-line">[SUMMARY] Retained Messages liefern neuen Subscribern sofort den letzten Wert.</div>
    <div class="story-line">[SUMMARY] Last Will macht unerwartete Ausfälle sichtbar.</div>
  `;

  elements.feedback.innerHTML = `
    <div class="ch-card correct-box">
      <h3>Merksatz</h3>
      <p>${message}</p>
    </div>
  `;
}

updateStatus();
renderIncident();