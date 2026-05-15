const cases = [
  {
    problem:
      "Ein neuer API-Pod soll gestartet werden. Kubernetes muss entscheiden, auf welchem Worker Node genug CPU und RAM frei sind.",
    answers: [
      "Scheduler",
      "etcd",
      "kube-proxy",
      "Container Runtime"
    ],
    correct: 0,
    explanation:
      "Der Scheduler entscheidet, auf welchem Worker Node ein neuer Pod platziert wird."
  },

  {
    problem:
      "Der gewünschte Zustand des Clusters muss gespeichert werden: 3 API-Pods, 1 MQTT-Pod, 1 DB-Pod.",
    answers: [
      "kubelet",
      "etcd",
      "kube-proxy",
      "Container Runtime"
    ],
    correct: 1,
    explanation:
      "etcd speichert den gesamten Cluster-Zustand und ist die Single Source of Truth."
  },

  {
    problem:
      "Ein API-Pod ist abgestürzt. Kubernetes erkennt: Gewünscht sind 3 Pods, aktuell laufen nur 2.",
    answers: [
      "Controller Manager",
      "Docker Compose",
      "kube-proxy",
      "kubectl"
    ],
    correct: 0,
    explanation:
      "Der Controller Manager sorgt über Controller-Loops dafür, dass Current State und Desired State wieder übereinstimmen."
  },

  {
    problem:
      "Ein Worker Node soll die ihm zugewiesenen Pods tatsächlich starten und überwachen.",
    answers: [
      "kubelet",
      "etcd",
      "Scheduler",
      "API Server"
    ],
    correct: 0,
    explanation:
      "Das kubelet läuft auf jedem Worker Node und sorgt dafür, dass die zugewiesenen Pods laufen."
  },

  {
    problem:
      "Requests sollen an gesunde Pod-Instanzen weitergeleitet werden.",
    answers: [
      "kube-proxy",
      "etcd",
      "minikube",
      "kind"
    ],
    correct: 0,
    explanation:
      "kube-proxy verwaltet Netzwerkregeln und unterstützt die Service-Kommunikation im Cluster."
  },

  {
    problem:
      "Tom sendet mit kubectl einen Befehl an den Cluster. Welche Komponente ist das zentrale Gateway?",
    answers: [
      "API Server",
      "Worker Node",
      "Grafana",
      "Container Image"
    ],
    correct: 0,
    explanation:
      "Der API Server ist das zentrale Gateway für alle Anfragen an Kubernetes."
  }
];

let currentCase = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

const caseBox = document.getElementById("caseBox");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function updateProgress() {
  const progress = (currentCase / cases.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function renderCase() {
  selectedAnswer = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const current = cases[currentCase];

  caseBox.innerHTML = `
    <div class="ch-card case-card">
      <h2>Cluster-Fall ${currentCase + 1}</h2>
      <p>${current.problem}</p>
    </div>

    <div class="answer-grid">
      ${current.answers.map((answer, index) => `
        <button class="answer" data-index="${index}">
          ${answer}
        </button>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {
      if (answered) return;

      document.querySelectorAll(".answer").forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
      selectedAnswer = Number(button.dataset.index);
    });
  });
}

nextBtn.addEventListener("click", () => {
  const current = cases[currentCase];

  if (selectedAnswer === null) {
    feedback.innerHTML = "Bitte wähle zuerst eine Komponente aus.";
    return;
  }

  if (!answered) {
    answered = true;

    document.querySelectorAll(".answer").forEach(button => {
      const index = Number(button.dataset.index);

      if (index === current.correct) {
        button.classList.add("correct");
      }

      if (index === selectedAnswer && index !== current.correct) {
        button.classList.add("wrong");
      }
    });

    if (selectedAnswer === current.correct) {
      score++;

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Richtig!</h3>
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

    caseBox.innerHTML = `
      <div class="ch-card">
        <h2>Control Room abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${cases.length}</strong> Cluster-Fällen korrekt gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          Die Control Plane trifft Entscheidungen.
          Die Worker Nodes führen die Container aus.
          Kubernetes gleicht dauerhaft Desired State und Current State ab.
        </p>
      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderCase();