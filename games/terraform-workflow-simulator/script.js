const scenarios = [
  {
    title: "Neue Infrastruktur für Staging",
    text:
      "Tom soll drei identische Webserver mit Load Balancer erstellen.",
    choices: [
      {
        text: "Alles manuell in der Cloud-Konsole klicken",
        security: -10,
        audit: -20,
        consistency: -20,
        feedback:
          "Das ist ClickOps. Schnell, aber kaum reproduzierbar oder nachvollziehbar."
      },
      {
        text: "Terraform-Code schreiben und in Git versionieren",
        security: +10,
        audit: +20,
        consistency: +20,
        feedback:
          "Richtig. Infrastruktur wird wie Code versioniert und reviewbar."
      }
    ]
  },

  {
    title: "Firewall-Regel für SSH",
    text:
      "Eine Regel erlaubt SSH von 0.0.0.0/0.",
    choices: [
      {
        text: "Direkt apply ausführen, wird schon passen",
        security: -30,
        audit: -10,
        consistency: -5,
        feedback:
          "Gefährlich. Offene SSH-Regeln müssen vor Apply im Plan auffallen."
      },
      {
        text: "terraform plan prüfen und im Review blockieren",
        security: +30,
        audit: +15,
        consistency: +10,
        feedback:
          "Genau. Der Plan-Schritt zeigt riskante Änderungen vor der Ausführung."
      }
    ]
  },

  {
    title: "Drift Detection",
    text:
      "Jemand hat manuell in Produktion eine Firewall-Regel geändert.",
    choices: [
      {
        text: "Terraform erneut ausführen und Soll/Ist vergleichen",
        security: +15,
        audit: +20,
        consistency: +25,
        feedback:
          "Richtig. Terraform erkennt Drift zwischen Code, State und Cloud."
      },
      {
        text: "Excel-Tabelle aktualisieren",
        security: -5,
        audit: -10,
        consistency: -20,
        feedback:
          "Eine Excel-Datei erzwingt keinen Zustand und verhindert keinen Drift."
      }
    ]
  },

  {
    title: "Tool-Auswahl",
    text:
      "NovaTech nutzt Azure, prüft aber auch AWS für IoT-Services.",
    choices: [
      {
        text: "Terraform verwenden",
        security: +10,
        audit: +10,
        consistency: +20,
        feedback:
          "Terraform ist Multi-Cloud-fähig und passt gut zu NovaTechs Situation."
      },
      {
        text: "Nur Azure Bicep verwenden",
        security: 0,
        audit: +5,
        consistency: -10,
        feedback:
          "Bicep ist gut für Azure, aber nicht Multi-Cloud."
      }
    ]
  }
];

let current = 0;

let scores = {
  security: 50,
  audit: 50,
  consistency: 50
};

function updateScores() {
  document.getElementById("securityScore").textContent =
    scores.security;

  document.getElementById("auditScore").textContent =
    scores.audit;

  document.getElementById("consistencyScore").textContent =
    scores.consistency;
}

function renderScenario() {
  const scenario = scenarios[current];

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>${scenario.title}</h2>
      <p>${scenario.text}</p>
    </div>
  `;

  const choicesBox = document.getElementById("choices");
  choicesBox.innerHTML = "";

  scenario.choices.forEach(choice => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = choice.text;

    button.onclick = () => handleChoice(choice);

    choicesBox.appendChild(button);
  });
}

function handleChoice(choice) {
  scores.security += choice.security;
  scores.audit += choice.audit;
  scores.consistency += choice.consistency;

  updateScores();

  document.getElementById("feedback").innerHTML = `
    <div class="ch-card">
      <p>${choice.feedback}</p>
    </div>
  `;

  current++;

  if (current < scenarios.length) {
    setTimeout(renderScenario, 1600);
  } else {
    setTimeout(showFinal, 1600);
  }
}

function showFinal() {
  const total =
    scores.security +
    scores.audit +
    scores.consistency;

  let result = "";

  if (total >= 240) {
    result = "NovaTech ist bereit für Infrastructure as Code.";
  } else if (total >= 180) {
    result = "NovaTech ist auf dem Weg, aber es gibt noch IaC-Risiken.";
  } else {
    result = "Audit-Risiko bleibt bestehen. ClickOps dominiert noch.";
  }

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">
      <h2>Simulation abgeschlossen</h2>

      <p>${result}</p>

      <h3>Merksätze</h3>

      <ul>
        <li>ClickOps erzeugt Drift und fehlende Nachvollziehbarkeit.</li>
        <li>IaC macht Infrastruktur versionierbar und reviewbar.</li>
        <li>terraform plan zeigt Änderungen vor der Umsetzung.</li>
        <li>Idempotenz sorgt für stabile, reproduzierbare Umgebungen.</li>
      </ul>
    </div>
  `;

  document.getElementById("choices").innerHTML = "";
}

updateScores();
renderScenario();