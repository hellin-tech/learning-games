const cases = [
  {
    title: "Offenes SSH",
    plan: `+ azurerm_network_security_rule.ssh
  destination_port_range = "22"
  source_address_prefix  = "*"
  access                 = "Allow"`,
    correct: "block",
    explanation: "Port 22 darf nicht für das Internet geöffnet werden. Eine OPA/Sentinel-Policy muss den Merge blockieren.",
    effects: {
      block: { compliance: 20, security: 25, noise: 0 },
      warn: { compliance: -10, security: -20, noise: 5 },
      allow: { compliance: -25, security: -30, noise: 10 }
    }
  },
  {
    title: "Fehlende Tags",
    plan: `+ azurerm_resource_group.dev
  name = "novatech-dev-rg"
  tags = {}`,
    correct: "block",
    explanation: "Pflicht-Tags wie environment, project und managed_by sind Compliance-relevant und sollten blockierend geprüft werden.",
    effects: {
      block: { compliance: 20, security: 5, noise: 0 },
      warn: { compliance: -10, security: 0, noise: 5 },
      allow: { compliance: -20, security: 0, noise: 10 }
    }
  },
  {
    title: "Dev-VM zu groß",
    plan: `+ azurerm_linux_virtual_machine.dev
  environment = "dev"
  size        = "Standard_D16s_v3"`,
    correct: "block",
    explanation: "Eine Dev-Policy kann große VM-SKUs verhindern, um Kosten und Fehlkonfigurationen zu begrenzen.",
    effects: {
      block: { compliance: 15, security: 5, noise: 0 },
      warn: { compliance: -5, security: 0, noise: 5 },
      allow: { compliance: -15, security: 0, noise: 10 }
    }
  },
  {
    title: "Nachts: echter Drift",
    plan: `~ azurerm_network_security_rule.web
  source_address_prefix = "10.0.0.0/24" -> "*"

terraform plan -detailed-exitcode returned 2`,
    correct: "alert",
    explanation: "Exit-Code 2 bedeutet: Änderungen erkannt. Bei Security-relevantem Drift sollte ein Alarm oder Ticket entstehen.",
    effects: {
      alert: { compliance: 20, security: 25, noise: 0 },
      ignore: { compliance: -20, security: -25, noise: 10 },
      allow: { compliance: -15, security: -20, noise: 5 }
    }
  },
  {
    title: "Bekannter Tag-Drift durch Monitoring",
    plan: `~ azurerm_virtual_machine.web
  tags.monitoring_last_seen = "2025-03-20" -> "2025-03-21"`,
    correct: "tune",
    explanation: "Wenn ein Monitoring-System erwartbar Tags setzt, sollte die Regel gezielt angepasst werden, statt alle Drift-Alarme abzuschalten.",
    effects: {
      tune: { compliance: 15, security: 5, noise: 20 },
      ignore: { compliance: -10, security: -5, noise: 10 },
      block: { compliance: 0, security: 0, noise: -20 }
    }
  }
];

const labels = {
  block: "Pipeline blockieren",
  warn: "Nur warnen",
  allow: "Durchlaufen lassen",
  alert: "Alarm/Jira-Ticket erstellen",
  ignore: "Ignorieren",
  tune: "Policy gezielt anpassen"
};

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const stats = {
  compliance: 50,
  security: 50,
  noise: 50
};

const incidentBox = document.getElementById("incidentBox");
const planBox = document.getElementById("planBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStats() {
  document.getElementById("compliance").textContent = stats.compliance;
  document.getElementById("security").textContent = stats.security;
  document.getElementById("noise").textContent = stats.noise;
  progressBar.style.width = `${Math.round((current / cases.length) * 100)}%`;
}

function renderCase() {
  const item = cases[current];

  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Entscheidung prüfen";

  incidentBox.innerHTML = `
    <h2>${item.title}</h2>
    <p>Wie soll NovaTechs Pipeline reagieren?</p>
  `;

  planBox.innerHTML = `<pre>${item.plan}</pre>`;
  answersBox.innerHTML = "";

  Object.keys(item.effects).forEach(key => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = labels[key];
    button.dataset.action = key;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = key;
    });

    answersBox.appendChild(button);
  });

  updateStats();
}

checkBtn.addEventListener("click", () => {
  const item = cases[current];

  if (!selected) {
    feedback.innerHTML = "Bitte wähle eine Pipeline-Reaktion.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === item.correct;
    if (correct) score++;

    const effect = item.effects[selected];
    stats.compliance = clamp(stats.compliance + effect.compliance);
    stats.security = clamp(stats.security + effect.security);
    stats.noise = clamp(stats.noise + effect.noise);

    document.querySelectorAll(".answer").forEach(button => {
      const action = button.dataset.action;
      if (action === item.correct) button.classList.add("correct");
      if (action === selected && !correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Richtige Governance-Entscheidung" : "Governance-Risiko"}</h3>
        <p>${item.explanation}</p>
      </div>
    `;

    updateStats();
    checkBtn.textContent = current === cases.length - 1 ? "Ergebnis anzeigen" : "Nächster Fall";
    return;
  }

  current++;

  if (current < cases.length) {
    renderCase();
  } else {
    progressBar.style.width = "100%";
    incidentBox.innerHTML = `
      <h2>Sentinel-Schicht aktiv</h2>
      <p>Du hast ${score} von ${cases.length} Policy- und Drift-Fällen korrekt bewertet.</p>
      <h3>Merksatz</h3>
      <p>Policy-as-Code verhindert riskante Änderungen vor dem Merge; Drift-Detection findet manuelle Änderungen danach.</p>
    `;
    planBox.innerHTML = "";
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderCase();