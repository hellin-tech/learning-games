const cases = [
  {
    title: "Secret im Git-Repository",
    text:
      "Tom committet api-secret.yaml mit stringData: API_KEY: sk-prod-a8f3b2c1d4e5f6 ins Repository.",
    answers: [
      "Secret-Dateien nicht ins Git committen; External Secrets oder Sealed Secrets nutzen",
      "Den API-Key einfach in Base64 umwandeln und committen",
      "Den Secret-Namen ändern",
      "Das Secret in eine ConfigMap verschieben"
    ],
    correct: 0,
    explanation:
      "Secrets dürfen nicht als Klartext oder Base64 im Git liegen. Für Produktion nutzt man z.B. External Secrets, Sealed Secrets oder einen Key Vault."
  },

  {
    title: "Base64-Missverständnis",
    text:
      "Markus sagt: 'Das Secret ist sicher, weil es Base64-kodiert ist.'",
    answers: [
      "Base64 ist keine Verschlüsselung und kann leicht zurückkodiert werden",
      "Base64 ist stärker als AES",
      "Base64 schützt vor RBAC-Fehlern",
      "Base64 verhindert Zugriff durch Admins"
    ],
    correct: 0,
    explanation:
      "Base64 ist nur Kodierung. Sicherheit entsteht durch RBAC, etcd-Encryption und sauberes Secret-Management."
  },

  {
    title: "ConfigMap geändert, aber App nutzt alten Wert",
    text:
      "Tom ändert LOG_LEVEL in der ConfigMap von debug auf info. Der API-Pod nutzt aber weiter debug als Umgebungsvariable.",
    answers: [
      "Deployment neu starten, z.B. kubectl rollout restart deployment/api-server",
      "NodePort aktivieren",
      "Secret löschen",
      "Ingress neu erstellen"
    ],
    correct: 0,
    explanation:
      "ConfigMaps als Env-Variablen werden beim Pod-Start gelesen. Bestehende Pods übernehmen Änderungen nicht automatisch."
  },

  {
    title: "Nginx-Konfiguration als Datei",
    text:
      "Eine komplette nginx.conf soll in den Container gemountet werden.",
    answers: [
      "ConfigMap als Volume mounten",
      "Alle Zeilen einzeln als Env-Variablen setzen",
      "Secret als NodePort veröffentlichen",
      "Pod-IP hardcoden"
    ],
    correct: 0,
    explanation:
      "Komplexe Konfigurationsdateien eignen sich besser als ConfigMap-Volume."
  },

  {
    title: "Falscher ConfigMap-Key",
    text:
      "Das Deployment referenziert key: DB_HOST, aber in der ConfigMap heißt der Key DATABASE_HOST.",
    answers: [
      "Key-Namen angleichen",
      "Deployment auf LoadBalancer ändern",
      "Secret in kube-system verschieben",
      "kubectl logs auf etcd ausführen"
    ],
    correct: 0,
    explanation:
      "configMapKeyRef und secretKeyRef müssen exakt auf vorhandene Keys zeigen."
  }
];

let currentCase = 0;
let selected = null;
let answered = false;
let score = 0;

const debugBox = document.getElementById("debugBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function updateProgress() {
  const progress = (currentCase / cases.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function renderCase() {
  selected = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const current = cases[currentCase];

  debugBox.innerHTML = `
    <div class="ch-card case-card">
      <h2>${current.title}</h2>
      <p>${current.text}</p>
    </div>
  `;

  answersBox.innerHTML = "";

  current.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (answered) return;

      document.querySelectorAll(".answer")
        .forEach(btn => btn.classList.remove("selected"));

      button.classList.add("selected");
      selected = index;
    });

    answersBox.appendChild(button);
  });
}

nextBtn.addEventListener("click", () => {
  const current = cases[currentCase];

  if (selected === null) {
    feedback.innerHTML = "Bitte wähle zuerst eine Lösung.";
    return;
  }

  if (!answered) {
    answered = true;

    document.querySelectorAll(".answer").forEach((button, index) => {
      if (index === current.correct) {
        button.classList.add("correct");
      }

      if (
        index === selected &&
        index !== current.correct
      ) {
        button.classList.add("wrong");
      }
    });

    if (selected === current.correct) {
      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Fehler gefunden!</h3>
          <p>${current.explanation}</p>
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Nicht ganz.</h3>
          <p>${current.explanation}</p>
        </div>
      `;
    }

    nextBtn.textContent =
      currentCase === cases.length - 1
        ? "Ergebnis anzeigen"
        : "Nächster Fall";

    return;
  }

  currentCase++;

  if (currentCase < cases.length) {
    renderCase();
  } else {
    progressBar.style.width = "100%";

    debugBox.innerHTML = `
      <div class="ch-card">
        <h2>Debugging abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${cases.length}</strong> Konfigurationsfehlern gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          ConfigMaps sind für nicht-sensible Konfiguration.
          Secrets sind für sensible Daten, aber Base64 ist keine Verschlüsselung.
          Änderungen an Env-Variablen brauchen neue Pods.
        </p>
      </div>
    `;

    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderCase();