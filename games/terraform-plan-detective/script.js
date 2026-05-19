const scenarios = [
  {
    title: "Neue Resource Group",
    plan: `
+ azurerm_resource_group.staging
`,
    correct: "create",
    explanation:
      "Das + Symbol bedeutet: Terraform erstellt eine neue Ressource."
  },

  {
    title: "VM-Größe geändert",
    plan: `
~ azurerm_linux_virtual_machine.web
size = "Standard_B2s" -> "Standard_B4ms"
`,
    correct: "update",
    explanation:
      "~ bedeutet In-Place-Änderung. Die Ressource wird angepasst."
  },

  {
    title: "Subnet gelöscht",
    plan: `
- azurerm_subnet.internal
`,
    correct: "destroy",
    explanation:
      "- bedeutet: Terraform entfernt die Ressource."
  },

  {
    title: "Container-Name geändert",
    plan: `
-/+ docker_container.nginx
name = "web-old" -> "web-new"
`,
    correct: "recreate",
    explanation:
      "-/+ bedeutet Destroy & Recreate. Manche Eigenschaften können nicht live geändert werden."
  },

  {
    title: "Neue Firewall-Regel",
    plan: `
+ azurerm_network_security_rule.allow_https
destination_port_range = 443
`,
    correct: "create",
    explanation:
      "Neue Security Rule → neue Ressource wird erstellt."
  }
];

let current = 0;
let score = 0;

function renderScenario() {
  const s = scenarios[current];

  document.getElementById("round").textContent =
    `${current + 1} / ${scenarios.length}`;

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>${s.title}</h2>

      <pre class="terminal">${s.plan}</pre>
    </div>
  `;

  const answers = [
    {
      id: "create",
      text: "Ressource wird erstellt (+)"
    },
    {
      id: "update",
      text: "Ressource wird geändert (~)"
    },
    {
      id: "destroy",
      text: "Ressource wird gelöscht (-)"
    },
    {
      id: "recreate",
      text: "Destroy & Recreate (-/+)"
    }
  ];

  const answersBox = document.getElementById("answers");
  answersBox.innerHTML = "";

  answers.forEach(answer => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = answer.text;

    button.onclick = () => checkAnswer(answer.id);

    answersBox.appendChild(button);
  });
}

function checkAnswer(answer) {
  const scenario = scenarios[current];

  const feedback = document.getElementById("feedback");

  if (answer === scenario.correct) {
    score++;

    document.getElementById("score").textContent = score;

    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Korrekt</h2>
        <p>${scenario.explanation}</p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>Leider falsch</h2>
        <p>${scenario.explanation}</p>
      </div>
    `;
  }

  current++;

  if (current < scenarios.length) {
    setTimeout(renderScenario, 1800);
  } else {
    setTimeout(showFinal, 1800);
  }
}

function showFinal() {
  let text = "";

  if (score === scenarios.length) {
    text = "Perfekt. Du kannst Terraform-Pläne professionell analysieren.";
  } else if (score >= 3) {
    text = "Gute Analysefähigkeiten. Noch etwas mehr Plan-Reading üben.";
  } else {
    text = "Terraform-Pläne brauchen noch Übung.";
  }

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>Simulation abgeschlossen</h2>

      <p>${text}</p>

      <h3>Merksätze</h3>

      <ul>
        <li>+ = erstellen</li>
        <li>~ = ändern</li>
        <li>- = löschen</li>
        <li>-/+ = Ressource muss neu erstellt werden</li>
      </ul>
    </div>
  `;

  document.getElementById("answers").innerHTML = "";
}

renderScenario();