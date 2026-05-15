const tasks = [
  {
    task:
      "Tom möchte prüfen, ob beide minikube-Nodes bereit sind.",
    answers: [
      "kubectl get nodes",
      "kubectl delete nodes",
      "kubectl logs nodes",
      "kubectl exec nodes"
    ],
    correct: 0,
    explanation:
      "kubectl get nodes listet alle Nodes und ihren Status auf."
  },

  {
    task:
      "Markus soll alle Pods im Cluster inklusive Namespaces sehen.",
    answers: [
      "kubectl get pods --all-namespaces",
      "kubectl describe namespaces",
      "kubectl run pods",
      "kubectl config view pods"
    ],
    correct: 0,
    explanation:
      "Mit --all-namespaces werden Pods aus allen Namespaces angezeigt."
  },

  {
    task:
      "Nina möchte Details zu einem nginx-Pod untersuchen.",
    answers: [
      "kubectl describe pod nginx-test",
      "kubectl get context nginx-test",
      "kubectl apply pod nginx-test",
      "kubectl delete namespace nginx-test"
    ],
    correct: 0,
    explanation:
      "kubectl describe zeigt Detailinformationen, Events und Statusdaten."
  },

  {
    task:
      "Tom möchte einen Namespace für die Entwicklungsumgebung erstellen.",
    answers: [
      "kubectl create namespace novatech-dev",
      "kubectl run namespace novatech-dev",
      "kubectl logs namespace novatech-dev",
      "kubectl exec namespace novatech-dev"
    ],
    correct: 0,
    explanation:
      "Namespaces werden mit kubectl create namespace <name> erstellt."
  },

  {
    task:
      "Markus möchte in einen laufenden nginx-Pod hineinschauen.",
    answers: [
      "kubectl exec -it nginx-test -- /bin/bash",
      "kubectl get nginx-test --shell",
      "kubectl describe shell nginx-test",
      "kubectl config use-pod nginx-test"
    ],
    correct: 0,
    explanation:
      "kubectl exec führt einen Befehl innerhalb eines Containers im Pod aus."
  },

  {
    task:
      "Lisa möchte sehen, mit welchem Cluster kubectl gerade verbunden ist.",
    answers: [
      "kubectl config get-contexts",
      "kubectl get clusters --live",
      "kubectl describe laptop",
      "kubectl logs kubeconfig"
    ],
    correct: 0,
    explanation:
      "kubectl config get-contexts zeigt verfügbare Kontexte und den aktuellen Kontext."
  }
];

let currentTask = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

const taskBox = document.getElementById("taskBox");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function updateProgress() {
  const progress = (currentTask / tasks.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function renderTask() {
  selectedAnswer = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const current = tasks[currentTask];

  taskBox.innerHTML = `
    <div class="ch-card case-card">
      <h2>Aufgabe ${currentTask + 1}</h2>
      <p>${current.task}</p>
    </div>

    <div class="answer-grid">
      ${current.answers.map((answer, index) => `
        <button class="answer code-card" data-index="${index}">
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
  const current = tasks[currentTask];

  if (selectedAnswer === null) {
    feedback.innerHTML = "Bitte wähle zuerst einen Befehl aus.";
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
      currentTask === tasks.length - 1
        ? "Ergebnis anzeigen"
        : "Nächste Aufgabe";

    return;
  }

  currentTask++;

  if (currentTask < tasks.length) {
    renderTask();
  } else {
    progressBar.style.width = "100%";

    taskBox.innerHTML = `
      <div class="ch-card">
        <h2>Command Center abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${tasks.length}</strong> kubectl-Aufgaben richtig gelöst.
        </p>

        <h3>Merksatz</h3>

        <p>
          kubectl ist dein zentrales Werkzeug:
          get zum Anzeigen, describe für Details,
          logs für Ausgaben, exec für Befehle im Container
          und config für Cluster-Kontexte.
        </p>
      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";
  }
});

renderTask();