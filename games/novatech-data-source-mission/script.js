const missions = [
  {
    title: "Bestehendes Hub-Netzwerk",
    text: "Die IT-Abteilung verwaltet bereits novatech-hub-vnet. Tom braucht nur die ID für ein Peering.",
    answers: [
      'data "azurerm_virtual_network" "hub" verwenden',
      'resource "azurerm_virtual_network" "hub" neu definieren',
      "terraform destroy ausführen",
      "Hub-Netzwerk in .tfvars kopieren"
    ],
    correct: 0,
    explanation: "Data Sources lesen existierende Ressourcen schreibgeschützt aus. Terraform erstellt oder verändert das Hub-Netzwerk nicht."
  },
  {
    title: "Zentrale Key Vault",
    text: "NovaTechs Key Vault existiert bereits und wird vom Security-Team verwaltet.",
    answers: [
      'data "azurerm_key_vault" "main"',
      'resource "azurerm_key_vault" "main"',
      "Key Vault löschen und neu erstellen",
      "Key Vault-Passwort in Git speichern"
    ],
    correct: 0,
    explanation: "Ein data-Block ist korrekt, wenn Terraform nur Attribute einer bestehenden Ressource benötigt."
  },
  {
    title: "Datenbank-Passwort",
    text: "Das DB-Passwort soll nicht in tfvars oder Git stehen. Woher sollte Terraform es lesen?",
    answers: [
      'data "azurerm_key_vault_secret" "db_password"',
      'variable "db_password" mit default im Code',
      "terraform.tfvars ins Git committen",
      "Passwort als Output ohne sensitive ausgeben"
    ],
    correct: 0,
    explanation: "Secrets sollten aus einem Secret Store wie Azure Key Vault gelesen und nicht im Repository abgelegt werden."
  },
  {
    title: "Neue Staging-Resource-Group",
    text: "Tom soll eine neue Resource Group für Staging erstellen und verwalten.",
    answers: [
      'resource "azurerm_resource_group" "main"',
      'data "azurerm_resource_group" "main"',
      "Nur einen output-Block erstellen",
      "ignore_changes = all setzen"
    ],
    correct: 0,
    explanation: "Neue Infrastruktur, die Terraform besitzen soll, gehört in einen resource-Block."
  },
  {
    title: "Peering zur Hub-VNet-ID",
    text: "Das Peering braucht remote_virtual_network_id. Welche Referenz ist korrekt?",
    answers: [
      "data.azurerm_virtual_network.hub.id",
      "resource.azurerm_virtual_network.hub.id",
      "var.hub.id.magic",
      "terraform.workspace.id"
    ],
    correct: 0,
    explanation: "Attribute aus Data Sources werden über data.<type>.<name>.<attribute> referenziert."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const missionBox = document.getElementById("missionBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function renderMission() {
  const mission = missions[current];

  selected = null;
  answered = false;
  feedback.innerHTML = "";
  nextBtn.textContent = "Entscheidung prüfen";
  progressBar.style.width = `${Math.round((current / missions.length) * 100)}%`;

  missionBox.innerHTML = `
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
}

nextBtn.addEventListener("click", () => {
  const mission = missions[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Terraform-Option.";
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
        <h3>${correct ? "Sauber eingebunden" : "Riskante Modellierung"}</h3>
        <p>${mission.explanation}</p>
      </div>
    `;

    nextBtn.textContent = current === missions.length - 1 ? "Ergebnis anzeigen" : "Nächste Ressource";
    return;
  }

  current++;

  if (current < missions.length) {
    renderMission();
  } else {
    progressBar.style.width = "100%";
    missionBox.innerHTML = `
      <h2>Migration sicher vorbereitet</h2>
      <p>Du hast ${score} von ${missions.length} Data-Source-Entscheidungen korrekt getroffen.</p>
      <h3>Merksatz</h3>
      <p><code>resource</code> verwaltet Infrastruktur. <code>data</code> liest bestehende Infrastruktur nur aus.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderMission();