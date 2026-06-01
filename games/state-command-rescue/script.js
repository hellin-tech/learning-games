const cases = [
  {
    title: "Inventur im State",
    text: "Nina möchte zuerst sehen, welche Ressourcen Terraform aktuell verwaltet.",
    correct: "terraform state list",
    commands: [
      "terraform state list",
      "terraform state rm azurerm_subnet.internal",
      "terraform apply -destroy",
      "terraform import azurerm_resource_group.legacy /subscriptions/.../old-rg"
    ],
    explanation: "state list zeigt alle Ressourcenadressen im aktuellen State."
  },
  {
    title: "Details prüfen",
    text: "Tom will die gespeicherte ID und Attribute der Resource Group sehen.",
    correct: "terraform state show azurerm_resource_group.main",
    commands: [
      "terraform state mv azurerm_resource_group.main azurerm_resource_group.prod",
      "terraform state show azurerm_resource_group.main",
      "terraform init -migrate-state",
      "terraform force-unlock abc123"
    ],
    explanation: "state show zeigt Details einer Ressource im State, inklusive ID und Attribute."
  },
  {
    title: "Refactoring ohne Neubau",
    text: "Im Code wird azurerm_subnet.internal in azurerm_subnet.backend umbenannt. Die echte Azure-Ressource soll bestehen bleiben.",
    correct: "terraform state mv azurerm_subnet.internal azurerm_subnet.backend",
    commands: [
      "terraform state rm azurerm_subnet.internal",
      "terraform state mv azurerm_subnet.internal azurerm_subnet.backend",
      "terraform destroy azurerm_subnet.internal",
      "terraform plan -refresh=false"
    ],
    explanation: "state mv passt die Adresse im State an und verhindert unnötiges destroy/create beim Refactoring."
  },
  {
    title: "ClickOps-Ressource übernehmen",
    text: "Eine alte Resource Group wurde manuell in Azure erstellt und soll jetzt von Terraform verwaltet werden.",
    correct: "terraform import azurerm_resource_group.legacy /subscriptions/.../resourceGroups/old-rg",
    commands: [
      "terraform state list",
      "terraform import azurerm_resource_group.legacy /subscriptions/.../resourceGroups/old-rg",
      "terraform state rm azurerm_resource_group.legacy",
      "terraform apply -replace=azurerm_resource_group.legacy"
    ],
    explanation: "terraform import übernimmt bestehende Cloud-Ressourcen in den Terraform State."
  },
  {
    title: "Terraform soll eine Ressource vergessen",
    text: "Ein altes Subnet soll aus dem State entfernt werden, aber in Azure bestehen bleiben.",
    correct: "terraform state rm azurerm_subnet.old_subnet",
    commands: [
      "terraform destroy azurerm_subnet.old_subnet",
      "terraform state rm azurerm_subnet.old_subnet",
      "terraform apply -auto-approve",
      "terraform refresh"
    ],
    explanation: "state rm entfernt nur die Zuordnung aus dem State. Die echte Cloud-Ressource wird nicht gelöscht."
  },
  {
    title: "Remote Backend aktivieren",
    text: "Die Backend-Konfiguration wurde ergänzt. Der lokale State soll sauber ins Azure Backend migriert werden.",
    correct: "terraform init -migrate-state",
    commands: [
      "terraform init -migrate-state",
      "terraform state mv local remote",
      "terraform apply -lock=false",
      "terraform workspace delete staging"
    ],
    explanation: "init -migrate-state initialisiert das Backend und migriert den vorhandenen lokalen State."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const caseBox = document.getElementById("caseBox");
const commandsBox = document.getElementById("commands");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderCase() {
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Befehl ausführen";
  progressBar.style.width = `${Math.round((current / cases.length) * 100)}%`;

  const item = cases[current];

  caseBox.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.text}</p>
  `;

  commandsBox.innerHTML = "";

  shuffle(item.commands).forEach(command => {
    const line = document.createElement("div");
    line.className = "line";
    line.textContent = "$ " + command;
    line.dataset.command = command;

    line.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".line").forEach(entry => entry.classList.remove("selected"));
      line.classList.add("selected");
      selected = command;
    });

    commandsBox.appendChild(line);
  });
}

checkBtn.addEventListener("click", () => {
  const item = cases[current];

  if (!selected) {
    feedback.innerHTML = "Bitte wähle zuerst einen Terraform-Befehl.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === item.correct;
    if (correct) score++;

    document.querySelectorAll(".line").forEach(line => {
      if (line.dataset.command === item.correct) line.classList.add("correct");
      if (line.dataset.command === selected && !correct) line.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Richtig ausgeführt" : "Falscher Befehl"}</h3>
        <p>${item.explanation}</p>
      </div>
    `;

    checkBtn.textContent = current === cases.length - 1 ? "Ergebnis anzeigen" : "Nächster Fall";
    return;
  }

  current++;

  if (current < cases.length) {
    renderCase();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>State gerettet</h2>
      <p>Du hast ${score} von ${cases.length} Wartungsfällen korrekt gelöst.</p>
      <h3>Merksatz</h3>
      <p>State-Befehle ändern nicht automatisch deine Infrastruktur. Sie ändern vor allem Terraforms Wissen über diese Infrastruktur.</p>
    `;
    commandsBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderCase();