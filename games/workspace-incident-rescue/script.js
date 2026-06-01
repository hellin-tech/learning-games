const missions = [
  {
    title: "Alarm im Plan",
    text: "Nina sieht: Plan: 8 to add, 0 to change, 8 to destroy. Sie wollte nur Dev aktualisieren. Was ist der erste sichere Schritt?",
    answers: [
      "Apply abbrechen und den aktuellen Workspace prüfen",
      "terraform apply bestätigen",
      "terraform destroy ausführen",
      "prod.tfvars löschen"
    ],
    correct: 0,
    explanation: "Bei unerwarteten Deletes gilt: sofort abbrechen und Kontext prüfen. Besonders Workspace und State sind kritisch."
  },
  {
    title: "Workspace prüfen",
    text: "Welcher Befehl zeigt, in welchem Workspace Nina gerade arbeitet?",
    answers: [
      "terraform workspace show",
      "terraform state rm",
      "terraform output",
      "terraform fmt"
    ],
    correct: 0,
    explanation: "terraform workspace show gibt den aktuell aktiven Workspace aus."
  },
  {
    title: "Richtige Umgebung auswählen",
    text: "Nina ist im Workspace prod, möchte aber Dev ändern. Was ist korrekt?",
    answers: [
      "terraform workspace select dev",
      "terraform workspace delete prod",
      "terraform init -destroy",
      "terraform apply -var-file=dev.tfvars im prod Workspace"
    ],
    correct: 0,
    explanation: "Der Workspace muss zur Umgebung passen. Dev-Variablen im Prod-State sind gefährlich."
  },
  {
    title: "State-Trennung verstehen",
    text: "Warum helfen Workspaces gegen Ninas Problem?",
    answers: [
      "Jeder Workspace hat einen eigenen State",
      "Alle Workspaces teilen automatisch denselben State",
      "Workspaces ersetzen Git",
      "Workspaces verhindern jede manuelle Cloud-Änderung"
    ],
    correct: 0,
    explanation: "Workspaces trennen States pro Umgebung. Dadurch beschreibt Dev nicht denselben State wie Prod."
  },
  {
    title: "Code-Zugriff",
    text: "Wie kann Terraform im Code den aktuellen Workspace-Namen nutzen?",
    answers: [
      "terraform.workspace",
      "var.workspace.name",
      "local.tfvars",
      "provider.workspace"
    ],
    correct: 0,
    explanation: "terraform.workspace liefert den aktuellen Workspace und kann z.B. für Namen oder env_config genutzt werden."
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

function updateStatus() {
  if (current >= 2) {
    document.getElementById("workspace").textContent = "dev";
    document.getElementById("risk").textContent = "niedrig";
  }
  progressBar.style.width = `${Math.round((current / missions.length) * 100)}%`;
}

function renderMission() {
  const mission = missions[current];
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Entscheidung prüfen";

  caseBox.innerHTML = `
    <h2>${mission.title}</h2>
    <p>${mission.text}</p>
  `;

  answersBox.innerHTML = "";

  mission.answers.forEach((answer, index) => {
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

  updateStatus();
}

nextBtn.addEventListener("click", () => {
  const mission = missions[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Reaktion.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === mission.correct;
    if (correct) score++;

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (index === mission.correct) button.classList.add("correct");
      if (index === selected && !correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Incident entschärft" : "Riskante Entscheidung"}</h3>
        <p>${mission.explanation}</p>
      </div>
    `;

    nextBtn.textContent = current === missions.length - 1 ? "Ergebnis anzeigen" : "Nächster Schritt";
    return;
  }

  current++;

  if (current < missions.length) {
    renderMission();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>Prod gerettet</h2>
      <p>Du hast ${score} von ${missions.length} Workspace-Entscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p>tfvars trennt Werte, aber nicht automatisch States. Umgebungstrennung braucht getrennten State: per Workspace oder Verzeichnisstruktur.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderMission();