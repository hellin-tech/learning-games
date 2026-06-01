const reviews = [
  {
    title: "Registry-Modul nutzen",
    text: "Tom möchte ein Azure-VNet-Modul aus der Terraform Registry verwenden. Was muss unbedingt ergänzt werden?",
    options: [
      {
        text: 'version = "4.1.0" pinnen',
        correct: true,
        effect: { reuse: 10, stability: 25, maintainability: 10 },
        explanation: "Registry-Module sollten versioniert werden, damit ein späteres terraform init keinen Breaking Change zieht."
      },
      {
        text: "Immer die neueste Version ohne Pinning laden",
        correct: false,
        effect: { reuse: 5, stability: -25, maintainability: -10 },
        explanation: "Ohne Versionierung können unerwartete Moduländerungen die Pipeline brechen."
      },
      {
        text: "Das Modul in terraform.tfstate kopieren",
        correct: false,
        effect: { reuse: -10, stability: -15, maintainability: -20 },
        explanation: "State ist keine Modulbibliothek."
      }
    ]
  },
  {
    title: "Single Responsibility",
    text: "Nina schlägt ein Modul vor, das Netzwerk, VM, Datenbank, Monitoring und DNS gleichzeitig erstellt.",
    options: [
      {
        text: "In kleinere Module wie networking, compute und database trennen",
        correct: true,
        effect: { reuse: 25, stability: 10, maintainability: 25 },
        explanation: "Gute Module machen eine Sache gut. Kleine Module sind leichter zu testen, zu versionieren und wiederzuverwenden."
      },
      {
        text: "Alles in ein Mega-Modul packen",
        correct: false,
        effect: { reuse: -20, stability: -10, maintainability: -25 },
        explanation: "Mega-Module sind schwer anpassbar und führen schnell zu vielen Sonderfällen."
      },
      {
        text: "Alle Ressourcen direkt im Root-Modul duplizieren",
        correct: false,
        effect: { reuse: -30, stability: -10, maintainability: -20 },
        explanation: "Das löst die ursprüngliche Code-Duplizierung nicht."
      }
    ]
  },
  {
    title: "Outputs vergessen",
    text: "Das Networking-Modul erstellt Subnets, gibt aber keine subnet_ids aus. Das Compute-Modul braucht sie.",
    options: [
      {
        text: 'output "subnet_ids" im Networking-Modul ergänzen',
        correct: true,
        effect: { reuse: 20, stability: 10, maintainability: 20 },
        explanation: "Module kommunizieren über Outputs. Alles, was andere Module brauchen, sollte gezielt ausgegeben werden."
      },
      {
        text: "Subnet-IDs manuell aus Azure kopieren",
        correct: false,
        effect: { reuse: -15, stability: -15, maintainability: -20 },
        explanation: "Manuelles Kopieren ist fehleranfällig und nicht reproduzierbar."
      },
      {
        text: "Compute-Modul soll das Netzwerk neu erstellen",
        correct: false,
        effect: { reuse: -20, stability: -20, maintainability: -15 },
        explanation: "Dann entstehen doppelte Ressourcen statt sauberer Modulkommunikation."
      }
    ]
  },
  {
    title: "Provider im Modul",
    text: "Tom möchte im Child-Modul provider \"azurerm\" konfigurieren.",
    options: [
      {
        text: "Provider im Root-Modul konfigurieren und vom Child-Modul erben lassen",
        correct: true,
        effect: { reuse: 15, stability: 15, maintainability: 20 },
        explanation: "Child-Module sollten möglichst keine Provider-Konfiguration enthalten. Der Aufrufer steuert Provider und Credentials."
      },
      {
        text: "Credentials direkt im Child-Modul hinterlegen",
        correct: false,
        effect: { reuse: -10, stability: -20, maintainability: -25 },
        explanation: "Credentials im Modul sind unsicher und machen das Modul schlecht wiederverwendbar."
      },
      {
        text: "Provider-Version zufällig wählen",
        correct: false,
        effect: { reuse: 0, stability: -20, maintainability: -10 },
        explanation: "Provider- und Modulversionen sollten bewusst gesteuert werden."
      }
    ]
  },
  {
    title: "Custom Firewall-Regeln",
    text: "Nina braucht für ein anderes Projekt eine zusätzliche Firewall-Regel, ohne das Netzwerk-Modul zu forken.",
    options: [
      {
        text: 'Variable vom Typ list(object) für custom_rules anbieten',
        correct: true,
        effect: { reuse: 25, stability: 10, maintainability: 15 },
        explanation: "Ein flexibler Input erweitert das Modul, ohne Kopien oder Forks zu erzeugen."
      },
      {
        text: "Modul für jedes Projekt kopieren und ändern",
        correct: false,
        effect: { reuse: -25, stability: -10, maintainability: -25 },
        explanation: "Kopien führen erneut zu Drift und Wartungsproblemen."
      },
      {
        text: "Firewall-Regel manuell in der Cloud-Konsole setzen",
        correct: false,
        effect: { reuse: -10, stability: -20, maintainability: -15 },
        explanation: "Manuelle Änderungen umgehen IaC und erzeugen Drift."
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const stats = {
  reuse: 50,
  stability: 50,
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
  document.getElementById("reuse").textContent = stats.reuse;
  document.getElementById("stability").textContent = stats.stability;
  document.getElementById("maintainability").textContent = stats.maintainability;
  progressBar.style.width = `${Math.round((current / reviews.length) * 100)}%`;
}

function renderReview() {
  const review = reviews[current];

  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Review prüfen";

  caseBox.innerHTML = `
    <h2>${review.title}</h2>
    <p>${review.text}</p>
  `;

  answersBox.innerHTML = "";

  review.options.forEach((option, index) => {
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
  const review = reviews[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Review-Entscheidung.";
    return;
  }

  if (!answered) {
    answered = true;
    const option = review.options[selected];

    if (option.correct) score++;

    stats.reuse = clamp(stats.reuse + option.effect.reuse);
    stats.stability = clamp(stats.stability + option.effect.stability);
    stats.maintainability = clamp(stats.maintainability + option.effect.maintainability);

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (review.options[index].correct) button.classList.add("correct");
      if (index === selected && !option.correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${option.correct ? "correct-box" : "wrong-box"}">
        <h3>${option.correct ? "Review bestanden" : "Modul-Risiko erkannt"}</h3>
        <p>${option.explanation}</p>
      </div>
    `;

    updateStats();
    checkBtn.textContent = current === reviews.length - 1 ? "Ergebnis anzeigen" : "Nächster Review";
    return;
  }

  current++;

  if (current < reviews.length) {
    renderReview();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>Modul-Review abgeschlossen</h2>
      <p>Du hast ${score} von ${reviews.length} Modulentscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>Gute Module sind klein, versioniert, dokumentiert, flexibel konfigurierbar und geben wichtige Werte als Outputs aus.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderReview();