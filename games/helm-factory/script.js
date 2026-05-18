const tasks = [

  {
    question:
      "Wie installierst du PostgreSQL aus dem Bitnami-Repository?",
    answers: [
      {
        text:
          "helm install db bitnami/postgresql",
        correct: true,
        explanation:
          "Korrekt. Helm installiert das PostgreSQL-Chart."
      },
      {
        text:
          "kubectl run postgresql",
        correct: false,
        explanation:
          "Das nutzt kein Helm Chart."
      },
      {
        text:
          "docker compose up postgres",
        correct: false,
        explanation:
          "Docker Compose gehört nicht zu Kubernetes."
      }
    ]
  },

  {
    question:
      "Welche Datei enthält Umgebungs-spezifische Werte?",
    answers: [
      {
        text:
          "values-prod.yaml",
        correct: true,
        explanation:
          "Values-Dateien überschreiben Standardwerte."
      },
      {
        text:
          "Chart.yaml",
        correct: false,
        explanation:
          "Chart.yaml enthält Metadaten."
      },
      {
        text:
          "deployment.yaml",
        correct: false,
        explanation:
          "Das ist nur ein Template."
      }
    ]
  },

  {
    question:
      "Wie rollst du auf die vorherige Helm-Version zurück?",
    answers: [
      {
        text:
          "helm rollback novatech-api 1",
        correct: true,
        explanation:
          "Rollback auf Revision 1."
      },
      {
        text:
          "kubectl rollback deployment",
        correct: false,
        explanation:
          "Das ist kein Helm-Befehl."
      },
      {
        text:
          "helm undo",
        correct: false,
        explanation:
          "helm undo existiert nicht."
      }
    ]
  },

  {
    question:
      "Warum nutzt NovaTech Helm?",
    answers: [
      {
        text:
          "Um YAML-Dateien zu paketieren und zu parametrisieren",
        correct: true,
        explanation:
          "Genau das ist die Hauptidee von Helm."
      },
      {
        text:
          "Um Docker Images zu bauen",
        correct: false,
        explanation:
          "Helm baut keine Container-Images."
      },
      {
        text:
          "Um Nodes automatisch zu skalieren",
        correct: false,
        explanation:
          "Das macht Kubernetes selbst."
      }
    ]
  }

];

let current = 0;
let health = 100;
let progress = 0;
let errors = 0;

function renderTask() {

  const task = tasks[current];

  document.getElementById("taskBox").innerHTML = `
    <div class="ch-card">
      <h2>Deployment-Schritt ${current + 1}</h2>
      <p>${task.question}</p>
    </div>
  `;

  const answersBox =
    document.getElementById("answers");

  answersBox.innerHTML = "";

  task.answers.forEach(answer => {

    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = answer.text;

    button.onclick = () => checkAnswer(answer);

    answersBox.appendChild(button);

  });

}

function checkAnswer(answer) {

  const feedback =
    document.getElementById("feedback");

  if (answer.correct) {

    progress += 25;

    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <p>${answer.explanation}</p>
      </div>
    `;

  } else {

    health -= 20;
    errors++;

    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <p>${answer.explanation}</p>
      </div>
    `;

  }

  updateUI();

  current++;

  if (current < tasks.length) {

    setTimeout(renderTask, 1400);

  } else {

    setTimeout(showFinal, 1500);

  }

}

function updateUI() {

  document.getElementById("clusterHealth")
    .textContent = `${health}%`;

  document.getElementById("progress")
    .textContent = `${progress}%`;

  document.getElementById("errors")
    .textContent = errors;

}

function showFinal() {

  let result = "";

  if (health >= 80) {

    result =
      "Die Plattform wurde erfolgreich mit Helm ausgerollt.";

  } else if (health >= 50) {

    result =
      "Deployment erfolgreich — aber mit Risiken.";

  } else {

    result =
      "Deployment fehlgeschlagen. Rollback notwendig.";
  }

  document.getElementById("taskBox").innerHTML = `
    <div class="ch-card">
      <h2>Deployment abgeschlossen</h2>

      <p>${result}</p>

      <ul>
        <li>Helm paketiert Kubernetes-Anwendungen</li>
        <li>Values-Dateien trennen Umgebungen</li>
        <li>Charts vereinfachen Deployments</li>
        <li>Rollbacks sind integriert</li>
      </ul>
    </div>
  `;

  document.getElementById("answers").innerHTML = "";

}

updateUI();
renderTask();