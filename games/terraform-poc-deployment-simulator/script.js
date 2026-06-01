const steps = [
  {
    title: "Projektstart",
    text: "Tom hat providers.tf mit dem Docker-Provider erstellt. Was muss als Erstes passieren?",
    correct: "terraform init",
    actions: [
      "terraform apply",
      "terraform init",
      "terraform destroy",
      "terraform fmt"
    ],
    feedback: "Richtig. terraform init lädt Provider, initialisiert das Backend und erstellt .terraform.lock.hcl."
  },
  {
    title: "Änderungen vorausschauen",
    text: "Jetzt soll Tom prüfen, was Terraform erstellen würde, bevor etwas passiert.",
    correct: "terraform plan",
    actions: [
      "terraform plan",
      "terraform destroy",
      "terraform version",
      "terraform init"
    ],
    feedback: "Richtig. terraform plan zeigt den Ausführungsplan vor dem Apply."
  },
  {
    title: "Plan bewerten",
    text: "Der Plan zeigt: Plan: 2 to add, 0 to change, 0 to destroy. Was ist die sichere Bewertung?",
    correct: "Plan reviewen und dann freigeben",
    actions: [
      "Plan ignorieren und direkt destroy ausführen",
      "Plan reviewen und dann freigeben",
      "Provider-Version entfernen",
      "terraform.tfstate ins Git committen"
    ],
    feedback: "Richtig. Ein Plan ohne Destroy ist für den PoC plausibel, sollte aber trotzdem reviewed werden."
  },
  {
    title: "PoC ausrollen",
    text: "Tom möchte den nginx-Container und das Image jetzt wirklich erstellen.",
    correct: "terraform apply",
    actions: [
      "terraform apply",
      "terraform init",
      "terraform fmt",
      "terraform version"
    ],
    feedback: "Richtig. terraform apply führt den geprüften Plan aus."
  },
  {
    title: "Demo beendet",
    text: "Nach der Demo soll die Testumgebung sauber entfernt werden.",
    correct: "terraform destroy",
    actions: [
      "terraform destroy",
      "terraform init",
      "terraform plan -destroy=false",
      "terraform providers lock"
    ],
    feedback: "Richtig. terraform destroy entfernt die von Terraform verwalteten Ressourcen in passender Reihenfolge."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;
let state = { provider: false, review: false, resources: 0 };

const mission = document.getElementById("mission");
const actions = document.getElementById("actions");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function updateStatus() {
  document.getElementById("provider").textContent = state.provider ? "✅" : "❌";
  document.getElementById("review").textContent = state.review ? "✅" : "❌";
  document.getElementById("resources").textContent = state.resources;
  progressBar.style.width = `${Math.round((current / steps.length) * 100)}%`;
}

function render() {
  const step = steps[current];
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Aktion ausführen";

  mission.innerHTML = `
    <h2>${step.title}</h2>
    <p>${step.text}</p>
  `;

  actions.innerHTML = "";

  shuffle(step.actions).forEach(action => {
    const button = document.createElement("button");
    button.className = "answer code-card";
    button.textContent = "$ " + action;

    button.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = action;
    });

    actions.appendChild(button);
  });

  updateStatus();
}

nextBtn.addEventListener("click", () => {
  const step = steps[current];

  if (!selected) {
    feedback.innerHTML = "Bitte wähle eine Aktion.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === step.correct;

    if (correct) {
      score++;
      if (selected === "terraform init") state.provider = true;
      if (selected === "Plan reviewen und dann freigeben") state.review = true;
      if (selected === "terraform apply") state.resources = 2;
      if (selected === "terraform destroy") state.resources = 0;
    }

    document.querySelectorAll(".answer").forEach(button => {
      const raw = button.textContent.replace("$ ", "");
      if (raw === step.correct) button.classList.add("correct");
      if (raw === selected && !correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Guter Schritt" : "Riskanter Schritt"}</h3>
        <p>${correct ? step.feedback : "Prüfe den Terraform-Workflow: erst initialisieren, dann planen, dann anwenden und am Ende gezielt aufräumen."}</p>
      </div>
    `;

    updateStatus();
    nextBtn.textContent = current === steps.length - 1 ? "Ergebnis anzeigen" : "Nächster Schritt";
    return;
  }

  current++;

  if (current < steps.length) {
    render();
  } else {
    progressBar.style.width = "100%";
    mission.innerHTML = `
      <h2>PoC abgeschlossen</h2>
      <p>Du hast ${score} von ${steps.length} Workflow-Schritten korrekt ausgeführt.</p>
      <h3>Merksatz</h3>
      <p>Terraform arbeitet sicher, wenn du immer in dieser Reihenfolge denkst: init, plan, review, apply, destroy.</p>
    `;
    actions.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

render();