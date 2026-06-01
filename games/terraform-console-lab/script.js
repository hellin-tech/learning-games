const tasks = [
  {
    title: "Resource Group Name bauen",
    text: 'Nina möchte aus Umgebung und Suffix den Namen "novatech-prod-rg" erzeugen.',
    answers: [
      'format("novatech-%s-rg", var.environment)',
      'merge("novatech", "prod", "rg")',
      'length("novatech-prod-rg")',
      'lookup(var.environment, "prod", "dev")'
    ],
    correct: 0,
    result: '"novatech-prod-rg"',
    explanation: "format eignet sich, um Strings kontrolliert zusammenzubauen."
  },
  {
    title: "VM-Größe je Umgebung",
    text: "Für prod soll D4s genutzt werden, sonst B2s als Fallback.",
    answers: [
      'lookup(var.vm_sizes, var.environment, "Standard_B2s")',
      'cidrsubnet(var.vm_sizes, 8, 1)',
      'join(var.environment, var.vm_sizes)',
      'sensitive(var.environment)'
    ],
    correct: 0,
    result: '"Standard_D4s_v3"',
    explanation: "lookup liest einen Map-Wert und nutzt einen Fallback, falls der Key fehlt."
  },
  {
    title: "Tags zusammenführen",
    text: "NovaTech hat Standard-Tags und möchte für einzelne Ressourcen zusätzliche Tags ergänzen.",
    answers: [
      'merge(local.common_tags, { role = "web" })',
      'split(local.common_tags, { role = "web" })',
      'length(local.common_tags, { role = "web" })',
      'format(local.common_tags, "web")'
    ],
    correct: 0,
    result: '{ environment = "prod", project = "novatech-iot", role = "web" }',
    explanation: "merge kombiniert Maps. Spätere Werte überschreiben gleiche Keys aus früheren Maps."
  },
  {
    title: "Subnet berechnen",
    text: 'Aus dem Netz "10.0.0.0/16" soll ein /24-Subnet für Index 2 entstehen.',
    answers: [
      'cidrsubnet("10.0.0.0/16", 8, 2)',
      'format("10.0.0.0/16", 8, 2)',
      'lookup("10.0.0.0/16", 8, 2)',
      'merge("10.0.0.0/16", "10.0.2.0/24")'
    ],
    correct: 0,
    result: '"10.0.2.0/24"',
    explanation: "cidrsubnet berechnet Subnetze aus einem größeren CIDR-Block."
  },
  {
    title: "Subnet-Anzahl prüfen",
    text: "Lisa will wissen, wie viele Subnet-Objekte in var.subnets definiert sind.",
    answers: [
      'length(var.subnets)',
      'join(var.subnets)',
      'coalesce(var.subnets)',
      'templatefile(var.subnets)'
    ],
    correct: 0,
    result: "3",
    explanation: "length gibt die Anzahl von Elementen in Listen, Maps oder Strings zurück."
  },
  {
    title: "Optionales Feld robust lesen",
    text: "Nicht jedes Subnet-Objekt hat ein optionales Feld service_endpoints. Wenn es fehlt, soll eine leere Liste genutzt werden.",
    answers: [
      'try(each.value.service_endpoints, [])',
      'merge(each.value.service_endpoints, [])',
      'length(each.value.service_endpoints, [])',
      'format(each.value.service_endpoints, [])'
    ],
    correct: 0,
    result: "[]",
    explanation: "try fängt Fehler beim Zugriff auf optionale Felder ab und nutzt einen Fallback."
  }
];

let current = 0;
let score = 0;
let selected = null;
let answered = false;

const taskBox = document.getElementById("taskBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("checkBtn");
const progressBar = document.getElementById("progressBar");

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function renderTask() {
  selected = null;
  answered = false;
  feedback.innerHTML = "";
  checkBtn.textContent = "Ausdruck testen";
  progressBar.style.width = `${Math.round((current / tasks.length) * 100)}%`;

  const task = tasks[current];

  taskBox.innerHTML = `
    <h2>${task.title}</h2>
    <p>${task.text}</p>
  `;

  answersBox.innerHTML = "";

  shuffle(task.answers.map((answer, originalIndex) => ({ answer, originalIndex }))).forEach(item => {
    const button = document.createElement("button");
    button.className = "answer code-card";
    button.textContent = "> " + item.answer;
    button.dataset.index = item.originalIndex;

    button.addEventListener("click", () => {
      if (answered) return;

      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selected = Number(button.dataset.index);
    });

    answersBox.appendChild(button);
  });
}

checkBtn.addEventListener("click", () => {
  const task = tasks[current];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle zuerst einen Terraform-Ausdruck.";
    return;
  }

  if (!answered) {
    answered = true;
    const isCorrect = selected === task.correct;

    if (isCorrect) score++;

    document.querySelectorAll(".answer").forEach(button => {
      const index = Number(button.dataset.index);

      if (index === task.correct) button.classList.add("correct");
      if (index === selected && !isCorrect) button.classList.add("wrong");
    });

    feedback.innerHTML = `
      <div class="ch-card ${isCorrect ? "correct-box" : "wrong-box"}">
        <h3>${isCorrect ? "Console-Ausdruck passt" : "Das würde in der Console nicht helfen"}</h3>
        <p><strong>Ergebnis:</strong> <code>${task.result}</code></p>
        <p>${task.explanation}</p>
      </div>
    `;

    checkBtn.textContent = current === tasks.length - 1 ? "Ergebnis anzeigen" : "Nächste Aufgabe";
    return;
  }

  current++;

  if (current < tasks.length) {
    renderTask();
  } else {
    progressBar.style.width = "100%";
    taskBox.innerHTML = `
      <h2>Console Lab abgeschlossen</h2>
      <p>Du hast ${score} von ${tasks.length} HCL-Ausdrücken korrekt gewählt.</p>
      <h3>Merksatz</h3>
      <p>Terraform-Funktionen machen HCL dynamisch: Namen, Tags, Subnetze und Fallbacks werden berechnet statt kopiert.</p>
    `;
    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    checkBtn.style.display = "none";
  }
});

renderTask();