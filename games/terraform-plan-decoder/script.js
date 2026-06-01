const cases = [
  {
    title: "Neue Resource Group",
    plan: `# azurerm_resource_group.staging will be created
+ resource "azurerm_resource_group" "staging" {
    + name     = "novatech-staging-rg"
    + location = "westeurope"
    + id       = (known after apply)
  }

Plan: 1 to add, 0 to change, 0 to destroy.`,
    answers: [
      "Terraform erstellt eine neue Resource Group.",
      "Terraform löscht die Resource Group.",
      "Terraform importiert automatisch eine bestehende Resource Group.",
      "Terraform kann den Provider nicht laden."
    ],
    correct: 0,
    explanation: "Das Pluszeichen bedeutet: Ressource oder Attribut wird erstellt. Die ID ist erst nach dem Apply bekannt."
  },
  {
    title: "Container wird geändert",
    plan: `# docker_container.web will be updated in-place
~ resource "docker_container" "web" {
    name = "novatech-web"
  ~ restart = "no" -> "always"
  }

Plan: 0 to add, 1 to change, 0 to destroy.`,
    answers: [
      "Terraform ändert den Container in-place.",
      "Terraform löscht und erstellt den Container neu.",
      "Terraform macht nichts.",
      "Terraform löscht alle Docker Images."
    ],
    correct: 0,
    explanation: "Die Tilde steht für eine Änderung. In-place bedeutet: keine Neuerstellung nötig."
  },
  {
    title: "Destroy-Gefahr",
    plan: `# docker_container.web will be destroyed
- resource "docker_container" "web" {
    - name = "novatech-web" -> null
  }

Plan: 0 to add, 0 to change, 1 to destroy.`,
    answers: [
      "Terraform wird eine Ressource löschen.",
      "Terraform installiert einen Provider.",
      "Terraform formatiert HCL-Dateien.",
      "Terraform erzeugt nur eine Vorschau ohne Risiko."
    ],
    correct: 0,
    explanation: "Das Minuszeichen bedeutet Löschung. Vor einem Apply muss Tom prüfen, ob das wirklich gewollt ist."
  },
  {
    title: "Destroy and Re-create",
    plan: `# docker_container.web must be replaced
-/+ resource "docker_container" "web" {
  ~ name = "novatech-web" -> "novatech-api"
}

Plan: 1 to add, 0 to change, 1 to destroy.`,
    answers: [
      "Die Ressource wird ersetzt: löschen und neu erstellen.",
      "Die Ressource wird nur umbenannt, ohne Auswirkung.",
      "Terraform hat keine Änderung erkannt.",
      "Terraform lädt nur das Docker Image neu."
    ],
    correct: 0,
    explanation: "-/+ bedeutet Replacement. Manche Attribute können nicht in-place geändert werden."
  },
  {
    title: "Known after apply",
    plan: `# docker_image.nginx will be created
+ resource "docker_image" "nginx" {
    + name          = "nginx:latest"
    + image_id      = (known after apply)
    + repo_digest   = (known after apply)
  }`,
    answers: [
      "Einige Werte kennt Terraform erst nach der Erstellung.",
      "Die Werte sind geheim und wurden gelöscht.",
      "Terraform ignoriert diese Werte dauerhaft.",
      "Der Plan ist ungültig."
    ],
    correct: 0,
    explanation: "Manche IDs entstehen erst durch die API-Antwort des Providers nach dem Erstellen."
  }
];

let current = 0;
let selected = null;
let answered = false;
let score = 0;

const caseBox = document.getElementById("caseBox");
const planBox = document.getElementById("planBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function renderCase() {
  const item = cases[current];
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Analyse prüfen";
  progressBar.style.width = `${Math.round((current / cases.length) * 100)}%`;

  caseBox.innerHTML = `
    <h2>${item.title}</h2>
    <p>Was bedeutet diese Terraform-Ausgabe?</p>
  `;

  planBox.innerHTML = `<pre>${item.plan}</pre>`;
  answersBox.innerHTML = "";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
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

checkBtn.addEventListener("click", () => {
  const item = cases[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle eine Analyse.";
    return;
  }

  if (!answered) {
    answered = true;
    const correct = selected === item.correct;
    if (correct) score++;

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (index === item.correct) button.classList.add("correct");
      if (index === selected && !correct) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${correct ? "correct-box" : "wrong-box"}">
        <h3>${correct ? "Plan korrekt gelesen" : "Analyse prüfen"}</h3>
        <p>${item.explanation}</p>
      </div>
    `;

    checkBtn.textContent = current === cases.length - 1 ? "Ergebnis anzeigen" : "Nächster Plan";
    return;
  }

  current++;

  if (current < cases.length) {
    renderCase();
  } else {
    progressBar.style.width = "100%";
    caseBox.innerHTML = `
      <h2>Plan Decoder abgeschlossen</h2>
      <p>Du hast ${score} von ${cases.length} Plan-Ausgaben korrekt bewertet.</p>
      <h3>Merksatz</h3>
      <p>Ein Terraform-Plan ist dein Sicherheitscheck: + erstellt, ~ ändert, - löscht, -/+ ersetzt.</p>
    `;
    planBox.innerHTML = "";
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderCase();