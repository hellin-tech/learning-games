const stages = [
  {
    title: "1. Infrastruktur-Änderung",
    text: "Nina möchte eine Firewall-Regel ändern. Wie startet der sichere Workflow?",
    answers: [
      "Pull Request mit Terraform-Code erstellen",
      "Direkt terraform apply vom Laptop ausführen",
      "Cloud-Konsole öffnen und Regel manuell ändern",
      "terraform destroy ausführen"
    ],
    correct: 0,
    explanation: "Änderungen starten als Pull Request, damit Code, Plan und Review nachvollziehbar sind."
  },
  {
    title: "2. Codequalität",
    text: "Die Pipeline soll zuerst prüfen, ob HCL sauber formatiert und syntaktisch gültig ist.",
    answers: [
      "terraform fmt --check und terraform validate",
      "terraform apply -auto-approve",
      "terraform force-unlock",
      "terraform state rm"
    ],
    correct: 0,
    explanation: "fmt prüft Formatierung, validate prüft die Terraform-Konfiguration."
  },
  {
    title: "3. Plan erzeugen",
    text: "Bevor jemand merged, soll sichtbar sein, was Terraform ändern würde.",
    answers: [
      "terraform plan -no-color -out=tfplan",
      "terraform apply",
      "terraform destroy",
      "terraform output -json"
    ],
    correct: 0,
    explanation: "Der Plan zeigt geplante Adds, Changes und Deletes, ohne Infrastruktur zu ändern."
  },
  {
    title: "4. Sicherheitsprüfung",
    text: "Dr. Weber will verhindern, dass Port 22 offen für das Internet wird.",
    answers: [
      "Policy-as-Code mit OPA oder Sentinel ausführen",
      "Plan ignorieren",
      "Provider-Version entfernen",
      "State lokal speichern"
    ],
    correct: 0,
    explanation: "Policy-as-Code blockiert unsichere Änderungen automatisch vor dem Apply."
  },
  {
    title: "5. Freigabe",
    text: "Der Plan ist sauber. Wer gibt die Änderung frei?",
    answers: [
      "Lisa oder Dr. Weber über PR-Review",
      "Ein beliebiger Entwickler per Slack-Emoji",
      "Niemand, die Pipeline soll immer sofort applyen",
      "Der Cloud-Provider automatisch"
    ],
    correct: 0,
    explanation: "Der menschliche Review ersetzt in der Pipeline die interaktive Apply-Bestätigung."
  },
  {
    title: "6. Merge nach main",
    text: "Nach dem Approval wird gemerged. Was darf jetzt automatisch passieren?",
    answers: [
      "terraform apply -auto-approve in der Pipeline",
      "terraform destroy in Produktion",
      "Manuelle Änderung in Azure",
      "State-Datei ins Repository committen"
    ],
    correct: 0,
    explanation: "Nach Review und Merge darf die Pipeline applyen. Entwickler brauchen keine Cloud-Credentials lokal."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const caseBox = document.getElementById("caseBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function renderStage() {
  const stage = stages[current];
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Schritt prüfen";
  progressBar.style.width = `${Math.round((current / stages.length) * 100)}%`;

  caseBox.innerHTML = `
    <h2>${stage.title}</h2>
    <p>${stage.text}</p>
  `;

  answersBox.innerHTML = "";

  stage.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer code-card";
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = index;
    });

    answersBox.appendChild(button);
  });
}

nextBtn.addEventListener("click", () => {
  const stage = stages[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle den nächsten Pipeline-Schritt.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === stage.correct;
    if (correct) score++;

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (index === stage.correct) button.classList.add("correct");
      if (index === selected && !correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Pipeline-Schritt passt" : "Pipeline-Risiko"}</h3>
        <p>${stage.explanation}</p>
      </div>
    `;

    nextBtn.textContent = current === stages.length - 1 ? "Ergebnis anzeigen" : "Nächster Schritt";
    return;
  }

  current++;

  if (current < stages.length) {
    renderStage();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>Pipeline aktiviert</h2>
      <p>Du hast ${score} von ${stages.length} CI/CD-Schritten korrekt aufgebaut.</p>
      <h3>Merksatz</h3>
      <p>Infrastrukturänderungen gehören in Pull Requests: Plan, Policy, Review, Merge, Apply.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderStage();