const missions = [
  {
    title: "Naked Pod abgestürzt",
    text:
      "Tom hat einen einzelnen Pod mit kubectl run erstellt. Nach einem Node-Ausfall wird kein neuer Pod gestartet.",
    answers: [
      "Ein Deployment mit Replicas verwenden",
      "Nur kubectl logs ausführen",
      "Den Pod umbenennen",
      "Port 80 freigeben"
    ],
    correct: 0,
    explanation:
      "Ein einzelner Pod besitzt kein Self-Healing. Deployments verwalten ReplicaSets, die abgestürzte Pods automatisch ersetzen."
  },

  {
    title: "Zero-Downtime gefordert",
    text:
      "Lisa möchte ein Update auf v1.3.0 durchführen, ohne dass die API offline geht.",
    answers: [
      "RollingUpdate im Deployment verwenden",
      "Alle Pods gleichzeitig löschen",
      "Nur ReplicaSets verwenden",
      "Den Namespace neu starten"
    ],
    correct: 0,
    explanation:
      "Rolling Updates ersetzen Pods schrittweise und verhindern Ausfallzeiten."
  },

  {
    title: "Fehlerhafte neue Version",
    text:
      "Nach dem Update melden Kunden Fehler in der API-Version 1.3.0.",
    answers: [
      "kubectl rollout undo deployment/api-server",
      "kubectl delete namespace novatech-dev",
      "minikube delete",
      "kubectl logs kube-system"
    ],
    correct: 0,
    explanation:
      "Mit rollout undo wird automatisch auf die vorherige stabile Version zurückgerollt."
  },

  {
    title: "Container lebt, aber ist nicht bereit",
    text:
      "Der API-Server läuft zwar, verarbeitet aber noch keine Requests.",
    answers: [
      "readinessProbe",
      "replicas: 0",
      "kubectl delete pod",
      "Node neu starten"
    ],
    correct: 0,
    explanation:
      "Die readinessProbe entscheidet, ob ein Pod Traffic empfangen darf."
  },

  {
    title: "Container hängt komplett",
    text:
      "Der API-Prozess antwortet nicht mehr auf Requests.",
    answers: [
      "livenessProbe",
      "Namespace löschen",
      "Deployment pausieren",
      "Container-IP ändern"
    ],
    correct: 0,
    explanation:
      "Die livenessProbe erkennt hängende Container und startet sie neu."
  },

  {
    title: "Neue Last auf der Hannover Messe",
    text:
      "Der API-Server erreicht dauerhaft hohe CPU-Auslastung.",
    answers: [
      "replicas erhöhen",
      "Pod-Namen ändern",
      "Node löschen",
      "Deployment entfernen"
    ],
    correct: 0,
    explanation:
      "Mehr Replicas verteilen die Last auf mehrere Pods."
  }
];

let currentMission = 0;
let score = 0;
let selected = null;
let answered = false;

const missionBox = document.getElementById("missionBox");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function updateProgress() {
  const progress =
    (currentMission / missions.length) * 100;

  progressBar.style.width = `${progress}%`;
}

function renderMission() {
  updateProgress();

  selected = null;
  answered = false;
  feedback.innerHTML = "";

  const mission = missions[currentMission];

  missionBox.innerHTML = `
    <div class="ch-card case-card">
      <h2>${mission.title}</h2>
      <p>${mission.text}</p>
    </div>
  `;

  answersBox.innerHTML = "";

  mission.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer code-card";
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
  const mission = missions[currentMission];

  if (selected === null) {
    feedback.innerHTML =
      "Bitte wähle zuerst eine Lösung.";
    return;
  }

  if (!answered) {
    answered = true;

    document.querySelectorAll(".answer")
      .forEach((button, index) => {

        if (index === mission.correct) {
          button.classList.add("correct");
        }

        if (index === selected &&
            index !== mission.correct) {
          button.classList.add("wrong");
        }
      });

    if (selected === mission.correct) {
      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Problem gelöst!</h3>
          <p>${mission.explanation}</p>
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Noch nicht optimal.</h3>
          <p>${mission.explanation}</p>
        </div>
      `;
    }

    nextBtn.textContent =
      currentMission === missions.length - 1
        ? "Ergebnis anzeigen"
        : "Nächste Mission";

    return;
  }

  currentMission++;

  if (currentMission < missions.length) {
    renderMission();
  } else {

    progressBar.style.width = "100%";

    missionBox.innerHTML = `
      <div class="ch-card">
        <h2>Mission abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${missions.length}</strong>
          Produktionsproblemen erfolgreich gelöst.
        </p>

        <h3>Wichtigster Lernpunkt</h3>

        <p>
          Deployments ermöglichen Skalierung,
          Self-Healing, Rolling Updates und Rollbacks.
          ReplicaSets halten die gewünschte Anzahl
          von Pods aktiv.
        </p>
      </div>
    `;

    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderMission();