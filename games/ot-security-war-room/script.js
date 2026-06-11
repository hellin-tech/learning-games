const cases = [
  {
    title: "Jeder kann MQTT publishen",
    text: "Dr. Weber findet: Der Broker akzeptiert jeden Client. Ein Angreifer könnte gefälschte Sensorwerte senden.",
    evidence: [
      "$ mosquitto_pub -h broker -t novatech/halle1/cnc/fraese12/temperatur -m 999",
      "[broker] accepted anonymous client",
      "[dashboard] temperature = 999 °C"
    ],
    choices: [
      {
        label: "Client-Zertifikate erzwingen: require_certificate true",
        correct: true,
        feedback: "Richtig. Zertifikatsbasierte Client-Authentifizierung stellt sicher, dass nur autorisierte Geräte publishen.",
        effects: { confidentiality: 5, integrity: 18, segmentation: 2 }
      },
      {
        label: "Nur den Topic-Namen komplizierter machen",
        feedback: "Security by obscurity reicht nicht. Wer den Broker erreicht, kann Topics erraten oder mitschneiden.",
        effects: { confidentiality: -4, integrity: -12, segmentation: 0 }
      },
      {
        label: "Dashboard-Passwort ändern",
        feedback: "Das schützt das Dashboard, aber nicht den MQTT-Broker vor gefälschten Nachrichten.",
        effects: { confidentiality: 2, integrity: -8, segmentation: 0 }
      }
    ]
  },
  {
    title: "MQTT läuft im Klartext",
    text: "Sensordaten werden auf Port 1883 unverschlüsselt übertragen. Jeder im Netz kann mitlesen.",
    evidence: [
      "[tcpdump] MQTT PUBLISH visible",
      "topic: novatech/halle1/cnc/fraese12/status",
      "payload: running"
    ],
    choices: [
      {
        label: "MQTT über TLS auf Port 8883 konfigurieren",
        correct: true,
        feedback: "Richtig. TLS schützt Vertraulichkeit und Integrität der Verbindung zwischen Client und Broker.",
        effects: { confidentiality: 20, integrity: 8, segmentation: 2 }
      },
      {
        label: "QoS 2 aktivieren",
        feedback: "QoS 2 verbessert Zustellung, aber verschlüsselt keine Daten.",
        effects: { confidentiality: -8, integrity: 3, segmentation: 0 }
      },
      {
        label: "Retained Messages deaktivieren",
        feedback: "Das löst nicht das Klartextproblem auf der Leitung.",
        effects: { confidentiality: -6, integrity: 0, segmentation: 0 }
      }
    ]
  },
  {
    title: "Office-PC erreicht Edge-Gateway",
    text: "Ein kompromittierter Laptop im Büronetz kann direkt auf einen Raspberry Pi in der Produktion zugreifen.",
    evidence: [
      "Office VLAN → ping edge-fraese12: OK",
      "Office VLAN → ssh edge-fraese12: reachable",
      "Purdue-Verstoß: Level 5 erreicht Level 2 direkt"
    ],
    choices: [
      {
        label: "OT-VLAN, Firewall und IT/OT-DMZ nach Purdue-Modell einführen",
        correct: true,
        feedback: "Richtig. Office und Produktion müssen getrennt sein. Kommunikation läuft nur über definierte Übergänge.",
        effects: { confidentiality: 8, integrity: 12, segmentation: 22 }
      },
      {
        label: "Alle Geräte in ein größeres gemeinsames Subnetz legen",
        feedback: "Das vergrößert die Angriffsfläche massiv.",
        effects: { confidentiality: -8, integrity: -12, segmentation: -20 }
      },
      {
        label: "Nur neue Hostnamen vergeben",
        feedback: "Hostnamen ersetzen keine Netzwerksegmentierung.",
        effects: { confidentiality: -2, integrity: -4, segmentation: -8 }
      }
    ]
  },
  {
    title: "Unsichere Firmware-Updates",
    text: "47 Edge-Gateways müssten im Ernstfall manuell aktualisiert werden. Signaturprüfung und Rollback fehlen.",
    evidence: [
      "[fleet] 47 Raspberry Pis",
      "[update] manual SSH planned",
      "[risk] manipulated update package possible"
    ],
    choices: [
      {
        label: "OTA-Updates mit Signaturprüfung und automatischem Rollback planen",
        correct: true,
        feedback: "Richtig. Updates müssen skalierbar, verifizierbar und rückrollbar sein.",
        effects: { confidentiality: 5, integrity: 14, segmentation: 4 }
      },
      {
        label: "Updates nur einmal pro Jahr durchführen",
        feedback: "Sicherheitslücken bleiben dadurch viel zu lange offen.",
        effects: { confidentiality: -5, integrity: -12, segmentation: 0 }
      },
      {
        label: "Update-Pakete per unverschlüsseltem FTP verteilen",
        feedback: "Das wäre ein zusätzliches Risiko. Updates müssen kryptographisch geschützt sein.",
        effects: { confidentiality: -10, integrity: -16, segmentation: -2 }
      }
    ]
  },
  {
    title: "Cloud-Anbindung geplant",
    text: "Ein Teil der Sensordaten soll an AWS IoT Core gesendet werden. Daten verlassen damit das Firmennetz.",
    evidence: [
      "target: cloud endpoint",
      "data path: OT → DMZ → Internet",
      "question: additional controls required"
    ],
    choices: [
      {
        label: "DMZ-Gateway, minimale Daten, TLS, Zertifikate und klare Egress-Regeln verwenden",
        correct: true,
        feedback: "Richtig. Cloud-Anbindung braucht kontrollierte Übergänge, starke Identitäten und Datenminimierung.",
        effects: { confidentiality: 14, integrity: 10, segmentation: 12 }
      },
      {
        label: "Edge-Gateways direkt ins Internet routen",
        feedback: "Das verletzt Segmentierung und erhöht das Risiko für die Produktion.",
        effects: { confidentiality: -14, integrity: -12, segmentation: -18 }
      },
      {
        label: "Cloud nur per Passwort schützen",
        feedback: "Für Gerätekommunikation sind Zertifikate, Rollen und kontrollierte Netzwerkpfade deutlich robuster.",
        effects: { confidentiality: -6, integrity: -8, segmentation: -6 }
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let solved = 0;

const state = {
  confidentiality: 60,
  integrity: 60,
  segmentation: 40
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

  el("caseBadge").textContent = `Audit-Fund ${current + 1} / ${cases.length}`;
  el("caseTitle").textContent = item.title;
  el("caseText").textContent = item.text;
  el("progressBar").style.width = `${(current / cases.length) * 100}%`;
  el("feedback").innerHTML = "";
  el("nextBtn").textContent = "Maßnahme prüfen";

  el("evidenceBox").innerHTML = item.evidence
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
  const item = cases[current];

  if (!answered) {
    if (selected === null) {
      el("feedback").innerHTML = `<div class="ch-card wrong-box">Bitte wähle zuerst eine Security-Maßnahme.</div>`;
      return;
    }

    answered = true;
    const choice = item.choices[selected];

    applyEffects(choice.effects);

    document.querySelectorAll(".answer").forEach((btn, index) => {
      if (item.choices[index].correct) btn.classList.add("correct");
      if (index === selected && !item.choices[index].correct) btn.classList.add("wrong");
    });

    if (choice.correct) solved++;

    el("feedback").innerHTML = `
      <div class="ch-card ${choice.correct ? "correct-box" : "wrong-box"}">
        <h3>${choice.correct ? "Audit-Fund geschlossen" : "Risiko bleibt bestehen"}</h3>
        <p>${choice.feedback}</p>
      </div>
    `;

    el("nextBtn").textContent =
      current === cases.length - 1 ? "Security-Report anzeigen" : "Nächster Audit-Fund";

    return;
  }

  current++;

  if (current < cases.length) {
    renderCase();
  } else {
    showResult();
  }
});

function showResult() {
  el("progressBar").style.width = "100%";
  el("choices").innerHTML = "";
  el("nextBtn").style.display = "none";

  const avg = Math.round((state.confidentiality + state.integrity + state.segmentation) / 3);

  el("caseTitle").textContent = "Security-Audit abgeschlossen";
  el("caseText").innerHTML = `
    Geschlossene Audit-Funde: <strong>${solved}</strong> von <strong>${cases.length}</strong><br>
    Security-Reifegrad: <strong>${avg} / 100</strong>
  `;

  el("evidenceBox").innerHTML = `
    <div class="story-line">[MERKSATZ] MQTT braucht TLS, Authentifizierung und saubere Autorisierung.</div>
    <div class="story-line">[MERKSATZ] Client-Zertifikate verhindern anonyme oder gefälschte Geräte.</div>
    <div class="story-line">[MERKSATZ] Office und Produktion gehören in getrennte Zonen.</div>
    <div class="story-line">[MERKSATZ] OT-Security schützt nicht nur Daten, sondern auch physische Prozesse.</div>
  `;

  el("feedback").innerHTML = `
    <div class="ch-card correct-box">
      <h3>Zusammenfassung</h3>
      <p>
        NovaTech ist erst rolloutfähig, wenn Verschlüsselung, Geräteidentitäten,
        Netzwerksegmentierung und sichere Updates gemeinsam umgesetzt sind.
      </p>
    </div>
  `;
}

updateState();
renderCase();