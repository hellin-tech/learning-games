const scenarios = [
  {
    title: "Neues Terraform-Projekt",
    text:
      "Tom hat providers.tf geschrieben. Was ist der erste Schritt?",
    choices: [
      {
        text: "terraform init",
        infra: 0,
        audit: 10,
        correct: true,
        feedback:
          "Richtig. init lädt Provider herunter und initialisiert das Projekt."
      },
      {
        text: "terraform apply",
        infra: -20,
        audit: -10,
        correct: false,
        feedback:
          "Falsch. Ohne init fehlen Provider und Backend-Konfiguration."
      }
    ]
  },

  {
    title: "Vor dem Apply",
    text:
      "Tom hat Änderungen an main.tf gemacht.",
    choices: [
      {
        text: "terraform plan ausführen",
        infra: 10,
        audit: 15,
        correct: true,
        feedback:
          "Genau. plan zeigt Änderungen vor der Ausführung."
      },
      {
        text: "Direkt terraform apply",
        infra: -15,
        audit: -20,
        correct: false,
        feedback:
          "Riskant. Änderungen sollten vorher geprüft werden."
      }
    ]
  },

  {
    title: "Provider-Version",
    text:
      "Ein Teammitglied nutzt eine andere azurerm-Version.",
    choices: [
      {
        text: ".terraform.lock.hcl committen",
        infra: 15,
        audit: 10,
        correct: true,
        feedback:
          "Richtig. Die Lock-Datei sorgt für reproduzierbare Provider-Versionen."
      },
      {
        text: "Jeder nutzt irgendeine Version",
        infra: -20,
        audit: -15,
        correct: false,
        feedback:
          "Gefährlich. Unterschiedliche Provider-Versionen erzeugen Inkonsistenzen."
      }
    ]
  },

  {
    title: "Destroy in Produktion",
    text:
      "Tom führt versehentlich destroy im Prod-Projekt aus.",
    choices: [
      {
        text: "prevent_destroy nutzen",
        infra: 20,
        audit: 10,
        correct: true,
        feedback:
          "Sehr gut. prevent_destroy schützt kritische Ressourcen."
      },
      {
        text: "Hoffen, dass niemand destroy ausführt",
        infra: -30,
        audit: -20,
        correct: false,
        feedback:
          "Keine gute Strategie für Produktionssysteme."
      }
    ]
  },

  {
    title: "Projekt fertig",
    text:
      "Die Staging-Umgebung soll wieder entfernt werden.",
    choices: [
      {
        text: "terraform destroy",
        infra: 10,
        audit: 5,
        correct: true,
        feedback:
          "Richtig. Terraform entfernt Ressourcen kontrolliert."
      },
      {
        text: "Ressourcen manuell löschen",
        infra: -15,
        audit: -20,
        correct: false,
        feedback:
          "Dadurch entsteht Drift zwischen State und Realität."
      }
    ]
  }
];

let current = 0;

let infra = 100;
let audit = 100;

function updateStats() {
  document.getElementById("infra").textContent = infra;
  document.getElementById("audit").textContent = audit;
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
  infra += choice.infra;
  audit += choice.audit;

  updateStats();

  document.getElementById("feedback").innerHTML = `
    <div class="ch-card">
      <p>${choice.feedback}</p>
    </div>
  `;

  current++;

  if (current < scenarios.length) {
    setTimeout(renderScenario, 1800);
  } else {
    setTimeout(showFinal, 1800);
  }
}

function showFinal() {
  let text = "";

  if (infra >= 100 && audit >= 100) {
    text = "NovaTechs Terraform-Workflow ist produktionsreif.";
  } else if (infra >= 70) {
    text = "Die Infrastruktur ist stabil, aber Prozesse können verbessert werden.";
  } else {
    text = "Der Workflow erzeugt noch Risiken und Drift.";
  }

  document.getElementById("scenarioBox").innerHTML = `
    <div class="ch-card">

      <h2>Workflow abgeschlossen</h2>

      <p>${text}</p>

      <h3>Terraform-Merksätze</h3>

      <ul>
        <li>init lädt Provider</li>
        <li>plan zeigt Änderungen vorher</li>
        <li>apply setzt Änderungen um</li>
        <li>destroy entfernt Ressourcen kontrolliert</li>
        <li>Lock-Dateien verhindern Versionsprobleme</li>
      </ul>

    </div>
  `;

  document.getElementById("choices").innerHTML = "";
}

updateStats();
renderScenario();