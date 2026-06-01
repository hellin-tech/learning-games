const decisions = [
  {
    title: "Drei identische Umgebungen",
    text: "Lisa braucht Dev, Staging und Prod mit möglichst gleicher Struktur. Welcher Ansatz passt am besten?",
    options: [
      {
        text: "Alles manuell in der Cloud-Konsole nachbauen.",
        effect: { compliance: -15, consistency: -25, future: -10 },
        correct: false,
        feedback: "ClickOps erzeugt schnell Abweichungen. Genau das war ein Audit-Befund."
      },
      {
        text: "Infrastruktur deklarativ als Code beschreiben.",
        effect: { compliance: 15, consistency: 25, future: 15 },
        correct: true,
        feedback: "Richtig. Deklarativer Code beschreibt den Soll-Zustand und macht Umgebungen reproduzierbar."
      },
      {
        text: "Eine Excel-Liste mit allen Einstellungen pflegen.",
        effect: { compliance: -10, consistency: -15, future: -15 },
        correct: false,
        feedback: "Eine Excel-Liste dokumentiert höchstens, setzt aber nichts automatisch und verhindert keinen Drift."
      }
    ]
  },
  {
    title: "Tool-Auswahl",
    text: "NovaTech nutzt Azure, prüft aber AWS für IoT-Services. Welches Tool ist strategisch passend?",
    options: [
      {
        text: "Terraform, weil es Multi-Cloud und ein großes Provider-Ökosystem bietet.",
        effect: { compliance: 15, consistency: 15, future: 25 },
        correct: true,
        feedback: "Richtig. Terraform passt gut, wenn Azure heute und AWS morgen relevant sein können."
      },
      {
        text: "Nur Azure Bicep, weil AWS später auch damit verwaltet wird.",
        effect: { compliance: 5, consistency: 10, future: -20 },
        correct: false,
        feedback: "Bicep ist stark für Azure, aber nicht für AWS ausgelegt."
      },
      {
        text: "Nur Bash-Skripte, weil sie überall laufen.",
        effect: { compliance: -20, consistency: -20, future: -15 },
        correct: false,
        feedback: "Bash ist imperativ und ohne viel Zusatzlogik nicht idempotent oder reviewfreundlich."
      }
    ]
  },
  {
    title: "Audit-Nachweis",
    text: "Dr. Weber fragt: Wer hat die Firewall-Regel geändert und warum?",
    options: [
      {
        text: "Änderungen über Git, Pull Request und Review nachvollziehbar machen.",
        effect: { compliance: 30, consistency: 10, future: 10 },
        correct: true,
        feedback: "Richtig. Git liefert Autor, Zeitpunkt, Änderung, Review und Begründung."
      },
      {
        text: "Screenshots aus der Cloud-Konsole speichern.",
        effect: { compliance: -10, consistency: -5, future: -10 },
        correct: false,
        feedback: "Screenshots sind Momentaufnahmen. Sie sind kein zuverlässiger Änderungsprozess."
      },
      {
        text: "Admins bitten, Änderungen in Slack zu posten.",
        effect: { compliance: -15, consistency: -5, future: -10 },
        correct: false,
        feedback: "Slack ersetzt keine versionierte, reviewbare und automatisierbare Änderungshistorie."
      }
    ]
  },
  {
    title: "Idempotenz",
    text: "Ein nächtlicher Job soll prüfen, ob die Infrastruktur noch dem Soll-Zustand entspricht.",
    options: [
      {
        text: "Idempotentes IaC nutzen: gleicher Code führt immer zum gleichen Zielzustand.",
        effect: { compliance: 10, consistency: 30, future: 15 },
        correct: true,
        feedback: "Richtig. Idempotenz verhindert, dass wiederholtes Ausführen immer neue Ressourcen erzeugt."
      },
      {
        text: "Ein Skript ausführen, das jedes Mal drei neue Server erstellt.",
        effect: { compliance: -10, consistency: -30, future: -10 },
        correct: false,
        feedback: "Nicht idempotent. Nach mehreren Läufen gäbe es zu viele Server."
      },
      {
        text: "Gar nicht prüfen, damit keine Änderungen passieren.",
        effect: { compliance: -20, consistency: -20, future: -10 },
        correct: false,
        feedback: "Dann bleibt Drift unentdeckt. IaC soll Abweichungen sichtbar machen."
      }
    ]
  },
  {
    title: "Plan vor Apply",
    text: "Tom will eine Änderung direkt anwenden. Lisa möchte vorher sehen, was passiert.",
    options: [
      {
        text: "terraform plan erzeugen und als Review-Artefakt prüfen.",
        effect: { compliance: 20, consistency: 15, future: 10 },
        correct: true,
        feedback: "Richtig. Der Plan ist wie ein Diff für Infrastrukturänderungen."
      },
      {
        text: "Direkt apply ausführen, weil IaC immer sicher ist.",
        effect: { compliance: -15, consistency: -20, future: -5 },
        correct: false,
        feedback: "IaC reduziert Risiken, ersetzt aber kein Review kritischer Änderungen."
      },
      {
        text: "Nur nach dem Apply prüfen, ob etwas kaputt ist.",
        effect: { compliance: -20, consistency: -15, future: -10 },
        correct: false,
        feedback: "Zu spät. Der Plan-Schritt existiert genau, um Risiken vorher sichtbar zu machen."
      }
    ]
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const stats = {
  compliance: 50,
  consistency: 50,
  future: 50
};

const caseBox = document.getElementById("caseBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateStats() {
  document.getElementById("compliance").textContent = stats.compliance;
  document.getElementById("consistency").textContent = stats.consistency;
  document.getElementById("future").textContent = stats.future;
  progressBar.style.width = `${Math.round((current / decisions.length) * 100)}%`;
}

function renderDecision() {
  const decision = decisions[current];

  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Entscheidung prüfen";

  caseBox.innerHTML = `
    <h2>${decision.title}</h2>
    <p>${decision.text}</p>
  `;

  answersBox.innerHTML = "";

  decision.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer";
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

nextBtn.addEventListener("click", () => {
  const decision = decisions[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte triff zuerst eine Entscheidung.";
    return;
  }

  if (!answered) {
    answered = true;
    const option = decision.options[selected];

    if (option.correct) score++;

    stats.compliance = clamp(stats.compliance + option.effect.compliance);
    stats.consistency = clamp(stats.consistency + option.effect.consistency);
    stats.future = clamp(stats.future + option.effect.future);

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (decision.options[index].correct) button.classList.add("correct");
      if (index === selected && !decision.options[index].correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${option.correct ? "correct-box" : "wrong-box"}">
        <h3>${option.correct ? "Architekturentscheidung passt" : "Entscheidung mit Risiko"}</h3>
        <p>${option.feedback}</p>
      </div>
    `;

    updateStats();
    nextBtn.textContent = current === decisions.length - 1 ? "Ergebnis anzeigen" : "Nächste Entscheidung";
    return;
  }

  current++;

  if (current < decisions.length) {
    renderDecision();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>Decision Room abgeschlossen</h2>
      <p>Du hast ${score} von ${decisions.length} IaC-Entscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>IaC ersetzt ClickOps durch versionierte, reviewbare und idempotente Infrastrukturänderungen.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderDecision();