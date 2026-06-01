const incidents = [
  {
    title: "09:14 — Gefährlicher Plan",
    text: "Tom sieht im terraform plan plötzlich 4 Ressourcen zum Löschen. Nina hat parallel mit eigenem lokalem State gearbeitet.",
    options: [
      {
        text: "Beide lokalen terraform.tfstate-Dateien in Git committen.",
        effect: { stability: -20, security: -25, team: -15 },
        correct: false,
        feedback: "Falsch. State enthält potenziell Secrets, Git-Merges können ihn beschädigen und Git bietet kein Apply-Locking."
      },
      {
        text: "Einen gemeinsamen Remote State in Azure Blob Storage einrichten.",
        effect: { stability: 20, security: 10, team: 25 },
        correct: true,
        feedback: "Richtig. Ein Remote Backend schafft eine gemeinsame Wahrheit für Tom und Nina."
      },
      {
        text: "Tom und Nina sollen abwechselnd ihre lokalen State-Dateien per Slack schicken.",
        effect: { stability: -15, security: -20, team: -10 },
        correct: false,
        feedback: "Unsicher und fehleranfällig. Manuelles Verteilen löst weder Locking noch Zugriffsschutz."
      }
    ]
  },
  {
    title: "Backend-Konfiguration",
    text: "Lisa fordert eine dokumentierte Azure-Lösung für Staging.",
    options: [
      {
        text: "backend \"azurerm\" mit resource_group_name, storage_account_name, container_name und key konfigurieren.",
        effect: { stability: 20, security: 10, team: 20 },
        correct: true,
        feedback: "Richtig. Der key trennt z.B. staging/terraform.tfstate sauber von anderen Umgebungen."
      },
      {
        text: "Nur provider \"azurerm\" konfigurieren, Terraform findet den State automatisch.",
        effect: { stability: -15, security: 0, team: -15 },
        correct: false,
        feedback: "Nein. Provider und Backend sind unterschiedliche Dinge. Das Backend muss explizit konfiguriert werden."
      },
      {
        text: "Den State in eine Variable schreiben.",
        effect: { stability: -20, security: -15, team: -10 },
        correct: false,
        feedback: "Nein. Terraform State ist keine Variable, sondern die Zustandsdatenbank der verwalteten Infrastruktur."
      }
    ]
  },
  {
    title: "Migration",
    text: "Der lokale State existiert bereits. Was ist der saubere nächste Schritt?",
    options: [
      {
        text: "terraform init -migrate-state ausführen.",
        effect: { stability: 25, security: 10, team: 15 },
        correct: true,
        feedback: "Richtig. Terraform migriert den lokalen State ins konfigurierte Remote Backend."
      },
      {
        text: "terraform apply -auto-approve starten.",
        effect: { stability: -25, security: 0, team: -10 },
        correct: false,
        feedback: "Gefährlich. Erst Backend initialisieren und State migrieren, dann planen."
      },
      {
        text: "terraform.tfstate löschen, damit Terraform frisch startet.",
        effect: { stability: -30, security: 0, team: -20 },
        correct: false,
        feedback: "Sehr riskant. Terraform verliert die Zuordnung zu bestehenden Ressourcen."
      }
    ]
  },
  {
    title: "Gleichzeitiger Apply",
    text: "Tom startet apply. Nina startet zwei Sekunden später ebenfalls apply.",
    options: [
      {
        text: "Mit Azure Backend blockiert State Locking den zweiten Apply.",
        effect: { stability: 20, security: 5, team: 25 },
        correct: true,
        feedback: "Richtig. Azure Blob Leases verhindern paralleles Schreiben auf denselben State."
      },
      {
        text: "Beide Applies laufen parallel und Terraform merged danach automatisch.",
        effect: { stability: -30, security: 0, team: -20 },
        correct: false,
        feedback: "Nein. Terraform State ist kein Git-Branch. Paralleles Schreiben wäre gefährlich."
      },
      {
        text: "Nina soll den Lock mit force-unlock sofort entfernen.",
        effect: { stability: -25, security: -5, team: -15 },
        correct: false,
        feedback: "force-unlock ist nur für Sonderfälle gedacht, z.B. wenn ein Prozess abgestürzt ist."
      }
    ]
  },
  {
    title: "Secrets im State",
    text: "Lisa fragt: Wer darf den State lesen?",
    options: [
      {
        text: "Nur berechtigte Infra-Rollen mit minimal nötigen Rechten auf den Storage Account.",
        effect: { stability: 10, security: 30, team: 10 },
        correct: true,
        feedback: "Richtig. State kann sensitive Werte enthalten. Zugriff muss strikt begrenzt werden."
      },
      {
        text: "Alle Entwickler bekommen Owner-Rechte auf das Azure-Abo.",
        effect: { stability: -10, security: -30, team: 0 },
        correct: false,
        feedback: "Zu breit. Least Privilege ist bei State-Zugriff besonders wichtig."
      },
      {
        text: "State ist verschlüsselt, deshalb ist Zugriff egal.",
        effect: { stability: -5, security: -25, team: 0 },
        correct: false,
        feedback: "Falsch. Verschlüsselung at rest schützt nicht vor berechtigten Lesern."
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let stats = { stability: 50, security: 50, team: 50 };
let score = 0;

const scenario = document.getElementById("scenario");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStats() {
  document.getElementById("stability").textContent = stats.stability;
  document.getElementById("security").textContent = stats.security;
  document.getElementById("team").textContent = stats.team;
  progressBar.style.width = `${Math.round((current / incidents.length) * 100)}%`;
}

function render() {
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Antwort prüfen";

  const incident = incidents[current];

  scenario.innerHTML = `
    <h2>${incident.title}</h2>
    <p>${incident.text}</p>
  `;

  answers.innerHTML = "";

  incident.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = option.text;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = index;
    });

    answers.appendChild(button);
  });

  updateStats();
}

nextBtn.addEventListener("click", () => {
  const incident = incidents[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Maßnahme.";
    return;
  }

  if (!answered) {
    answered = true;
    const option = incident.options[selected];

    stats.stability = clamp(stats.stability + option.effect.stability);
    stats.security = clamp(stats.security + option.effect.security);
    stats.team = clamp(stats.team + option.effect.team);

    if (option.correct) score++;

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (incident.options[index].correct) button.classList.add("correct");
      if (index === selected && !incident.options[index].correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${option.correct ? "correct-box" : "wrong-box"}">
        <h3>${option.correct ? "Gute Entscheidung" : "Riskante Entscheidung"}</h3>
        <p>${option.feedback}</p>
      </div>
    `;

    updateStats();
    nextBtn.textContent = current === incidents.length - 1 ? "Ergebnis anzeigen" : "Nächster Incident";
    return;
  }

  current++;

  if (current < incidents.length) {
    render();
  } else {
    progressBar.style.width = "100%";
    scenario.innerHTML = `
      <h2>Lockdown abgeschlossen</h2>
      <p>Du hast ${score} von ${incidents.length} kritischen Entscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>Terraform State gehört im Team in ein geschütztes Remote Backend mit Locking, Versionierung und minimalen Zugriffsrechten.</p>
    `;
    answers.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

render();