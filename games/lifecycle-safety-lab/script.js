const cases = [
  {
    title: "Produktionsdatenbank schützen",
    text: "Lisa fordert: Die Produktionsdatenbank darf niemals versehentlich durch terraform destroy gelöscht werden.",
    options: [
      {
        text: "lifecycle { prevent_destroy = true }",
        correct: true,
        effect: { availability: 25, security: 20, maintainability: 5 },
        explanation: "prevent_destroy blockiert Pläne, die diese Ressource löschen würden."
      },
      {
        text: "ignore_changes = all",
        correct: false,
        effect: { availability: -10, security: -15, maintainability: -25 },
        explanation: "ignore_changes = all versteckt fast alle Diffs und macht Terraform blind für echte Abweichungen."
      },
      {
        text: "terraform destroy regelmäßig testen",
        correct: false,
        effect: { availability: -30, security: -10, maintainability: -5 },
        explanation: "Destroy ist kein Schutzmechanismus. Kritische Ressourcen brauchen explizite Lifecycle-Regeln."
      }
    ]
  },
  {
    title: "Web-VM ohne Downtime ersetzen",
    text: "Eine Änderung erzwingt Replacement. Die alte VM soll erst gelöscht werden, wenn die neue bereit ist.",
    options: [
      {
        text: "lifecycle { create_before_destroy = true }",
        correct: true,
        effect: { availability: 25, security: 5, maintainability: 10 },
        explanation: "create_before_destroy minimiert Downtime bei Ressourcen, die ersetzt werden müssen."
      },
      {
        text: "prevent_destroy auf alle Web-VMs setzen",
        correct: false,
        effect: { availability: -10, security: 0, maintainability: -10 },
        explanation: "prevent_destroy würde notwendige Ersetzungen blockieren, löst aber nicht das Downtime-Problem."
      },
      {
        text: "Provider-Version entfernen",
        correct: false,
        effect: { availability: -15, security: -5, maintainability: -15 },
        explanation: "Provider-Pinning hat nichts mit Ersatzreihenfolge zu tun."
      }
    ]
  },
  {
    title: "Monitoring setzt Tags",
    text: "Ein Monitoring-System aktualisiert tags[\"monitoring_id\"]. Terraform will den Tag bei jedem Plan zurücksetzen.",
    options: [
      {
        text: 'ignore_changes = [tags["monitoring_id"]]',
        correct: true,
        effect: { availability: 5, security: 5, maintainability: 20 },
        explanation: "Gezieltes ignore_changes ist sinnvoll, wenn ein externes System bestimmte Attribute verwaltet."
      },
      {
        text: "ignore_changes = all",
        correct: false,
        effect: { availability: -5, security: -20, maintainability: -25 },
        explanation: "Zu breit. Dadurch übersieht Terraform auch wichtige Fehlkonfigurationen."
      },
      {
        text: "Monitoring abschalten",
        correct: false,
        effect: { availability: -15, security: -10, maintainability: -10 },
        explanation: "Besser ist eine präzise Lifecycle-Regel statt das Monitoring zu entfernen."
      }
    ]
  },
  {
    title: "Kubernetes-VM initial einrichten",
    text: "Tom will Docker und kubeadm auf einer neuen VM installieren. Welche Lösung ist meistens besser als remote-exec?",
    options: [
      {
        text: "Cloud-Init über custom_data nutzen",
        correct: true,
        effect: { availability: 10, security: 10, maintainability: 25 },
        explanation: "Cloud-Init ist cloud-nativ und besser für initiale Server-Konfiguration geeignet als Provisioner."
      },
      {
        text: "remote-exec für jede Konfigurationsänderung verwenden",
        correct: false,
        effect: { availability: -10, security: -5, maintainability: -20 },
        explanation: "Provisioner sind imperativ, laufen nicht zuverlässig bei Updates und gelten als letzter Ausweg."
      },
      {
        text: "Alles manuell per SSH installieren",
        correct: false,
        effect: { availability: -10, security: -10, maintainability: -25 },
        explanation: "Manuelle SSH-Schritte sind schwer reproduzierbar und schlecht auditierbar."
      }
    ]
  },
  {
    title: "Provisioner schlägt fehl",
    text: "Der remote-exec-Provisioner bricht nach VM-Erstellung ab. Die VM existiert, aber Terraform markiert sie als tainted.",
    options: [
      {
        text: "Ursache beheben und beim nächsten apply mit Ersatz der tainted Ressource rechnen",
        correct: true,
        effect: { availability: 5, security: 5, maintainability: 15 },
        explanation: "Tainted bedeutet: Terraform betrachtet die Ressource als potenziell fehlerhaft und ersetzt sie beim nächsten Apply."
      },
      {
        text: "Fehler ignorieren, weil die VM ja existiert",
        correct: false,
        effect: { availability: -15, security: -10, maintainability: -15 },
        explanation: "Eine existierende VM ist nicht automatisch korrekt konfiguriert."
      },
      {
        text: "State-Datei manuell editieren",
        correct: false,
        effect: { availability: -20, security: -15, maintainability: -20 },
        explanation: "Manuelles Editieren des States ist riskant und sollte vermieden werden."
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const stats = {
  availability: 50,
  security: 50,
  maintainability: 50
};

const caseBox = document.getElementById("caseBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStats() {
  document.getElementById("availability").textContent = stats.availability;
  document.getElementById("security").textContent = stats.security;
  document.getElementById("maintainability").textContent = stats.maintainability;
  progressBar.style.width = `${Math.round((current / cases.length) * 100)}%`;
}

function renderCase() {
  const item = cases[current];

  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Maßnahme prüfen";

  caseBox.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.text}</p>
  `;

  answersBox.innerHTML = "";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer code-card";
    button.textContent = option.text;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = index;
    });

    answersBox.appendChild(button);
  });

  updateStats();
}

checkBtn.addEventListener("click", () => {
  const item = cases[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Maßnahme.";
    return;
  }

  if (!answered) {
    answered = true;
    const option = item.options[selected];

    if (option.correct) score++;

    stats.availability = clamp(stats.availability + option.effect.availability);
    stats.security = clamp(stats.security + option.effect.security);
    stats.maintainability = clamp(stats.maintainability + option.effect.maintainability);

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (item.options[index].correct) button.classList.add("correct");
      if (index === selected && !option.correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${option.correct ? "correct-box" : "wrong-box"}">
        <h3>${option.correct ? "Richtig geschützt" : "Riskante Maßnahme"}</h3>
        <p>${option.explanation}</p>
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
    caseBox.innerHTML = `
      <h2>Lifecycle Safety bestanden</h2>
      <p>Du hast ${score} von ${cases.length} Schutzentscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>Lifecycle-Regeln schützen Ressourcen gezielt. Provisioner sind möglich, aber meist nur der letzte Ausweg.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderCase();