const cases = [
  {
    title: "Hardcoded Pod-IP",
    text:
      "Im MQTT-Gateway steht api_endpoint: http://10.244.1.15:8080. Nach einem Rolling Update ist die API nicht mehr erreichbar.",
    answers: [
      "Pod-IP durch Service-DNS ersetzen, z.B. http://api-service:80",
      "Pod-IP regelmäßig manuell aktualisieren",
      "Deployment löschen",
      "NodePort für PostgreSQL aktivieren"
    ],
    correct: 0,
    explanation:
      "Pod-IPs sind flüchtig. Ein Service bietet eine stabile DNS-Adresse und routet zu den aktuellen Pods."
  },

  {
    title: "Service findet keine Pods",
    text:
      "kubectl get endpoints api-service zeigt keine Endpoints, obwohl API-Pods laufen.",
    answers: [
      "Selector und Pod-Labels prüfen",
      "Ingress-Controller löschen",
      "NodePort erhöhen",
      "ClusterIP manuell ändern"
    ],
    correct: 0,
    explanation:
      "Services finden Pods über selector.matchLabels. Wenn Labels nicht passen, entstehen keine Endpoints."
  },

  {
    title: "Falscher targetPort",
    text:
      "Der Service hört auf Port 80, aber Requests erreichen den API-Container nicht. Der Container lauscht auf 8080.",
    answers: [
      "targetPort auf 8080 setzen",
      "port auf 8080 setzen und targetPort entfernen",
      "Namespace löschen",
      "LoadBalancer deaktivieren"
    ],
    correct: 0,
    explanation:
      "port ist der Service-Port. targetPort ist der Port im Pod/Container."
  },

  {
    title: "Datenbank öffentlich erreichbar",
    text:
      "PostgreSQL wurde als NodePort-Service veröffentlicht. Jeder im Messe-WLAN kann den Port scannen.",
    answers: [
      "PostgreSQL als ClusterIP-Service betreiben",
      "PostgreSQL als Ingress betreiben",
      "DNS deaktivieren",
      "Alle Pods in kube-system verschieben"
    ],
    correct: 0,
    explanation:
      "Datenbanken sollten intern bleiben. ClusterIP ist für interne Kommunikation sicherer."
  },

  {
    title: "Ingress funktioniert nicht",
    text:
      "Tom hat eine Ingress-Ressource erstellt, aber api.novatech.local antwortet nicht.",
    answers: [
      "Prüfen, ob ein Ingress-Controller installiert ist",
      "Service auf ExternalName ändern",
      "Pod-IP hardcoden",
      "replicas auf 0 setzen"
    ],
    correct: 0,
    explanation:
      "Ingress-Regeln wirken nur, wenn ein Ingress-Controller wie NGINX oder Traefik läuft."
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
          <strong>${cases.length}</strong> Netzwerkfehlern gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          Pods sind flüchtig, Services sind stabil.
          Services finden Pods über Labels und Selector.
          Ingress braucht immer einen Ingress-Controller.
        </p>
      </div>
    `;

    answersBox.innerHTML = "";
    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderCase();