const questions = [
  {
    question: "Du möchtest einen nginx-Container starten. Welchen Befehl nutzt du?",
    answers: [
      "docker ps",
      "docker run nginx",
      "docker rm nginx",
      "docker stop nginx"
    ],
    correct: 1,
    explanation: "docker run startet einen neuen Container aus einem Image."
  },

  {
    question: "Du möchtest alle laufenden Container anzeigen.",
    answers: [
      "docker ps",
      "docker images",
      "docker stop",
      "docker build"
    ],
    correct: 0,
    explanation: "docker ps listet laufende Container auf."
  },

  {
    question: "Ein Container soll beendet werden.",
    answers: [
      "docker rm",
      "docker stop",
      "docker pull",
      "docker exec"
    ],
    correct: 1,
    explanation: "docker stop beendet einen laufenden Container sauber."
  },

  {
    question: "Du möchtest einen Container löschen.",
    answers: [
      "docker rm",
      "docker stop",
      "docker logs",
      "docker build"
    ],
    correct: 0,
    explanation: "docker rm entfernt einen Container endgültig."
  },

  {
    question: "Du möchtest die Logs eines Containers anzeigen.",
    answers: [
      "docker logs",
      "docker ps",
      "docker stop",
      "docker run"
    ],
    correct: 0,
    explanation: "docker logs zeigt die Konsolenausgabe eines Containers."
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

const questionBox = document.getElementById("questionBox");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function updateProgress() {

  const progress =
    ((currentQuestion) / questions.length) * 100;

  progressBar.style.width = `${progress}%`;
}

function showQuestion() {

  selectedAnswer = null;
  answered = false;

  feedback.textContent = "";

  updateProgress();

  const q = questions[currentQuestion];

  questionBox.innerHTML = `
    <div class="question">
      ${currentQuestion + 1}. ${q.question}
    </div>

    ${q.answers.map((answer, index) => `
      <button class="answer" data-index="${index}">
        ${answer}
      </button>
    `).join("")}
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

  const q = questions[currentQuestion];

  if (selectedAnswer === null) {

    feedback.textContent =
      "Bitte wähle zuerst eine Antwort aus.";

    return;
  }

  if (!answered) {

    answered = true;

    document.querySelectorAll(".answer").forEach(button => {

      const index =
        Number(button.dataset.index);

      if (index === q.correct) {
        button.classList.add("correct");
      }

      if (
        index === selectedAnswer &&
        index !== q.correct
      ) {
        button.classList.add("wrong");
      }

    });

    if (selectedAnswer === q.correct) {

      score++;

      feedback.textContent =
        `Richtig! ${q.explanation}`;

    } else {

      feedback.textContent =
        `Nicht ganz. ${q.explanation}`;

    }

    nextBtn.textContent =
      currentQuestion === questions.length - 1
        ? "Ergebnis anzeigen"
        : "Nächste Frage";

    return;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {

    showQuestion();

  } else {

    progressBar.style.width = "100%";

    questionBox.innerHTML = `
      <h2>Challenge abgeschlossen</h2>

      <p>
        Du hast <strong>${score}</strong> von
        <strong>${questions.length}</strong>
        Fragen richtig beantwortet.
      </p>

      <div class="ch-card">

        <h3>Mini-Cheatsheet</h3>

        <table style="width:100%; border-collapse:collapse;">

          <tr>
            <th align="left">Befehl</th>
            <th align="left">Beschreibung</th>
          </tr>

          <tr>
            <td>docker run</td>
            <td>Container starten</td>
          </tr>

          <tr>
            <td>docker ps</td>
            <td>Container anzeigen</td>
          </tr>

          <tr>
            <td>docker stop</td>
            <td>Container stoppen</td>
          </tr>

          <tr>
            <td>docker rm</td>
            <td>Container entfernen</td>
          </tr>

          <tr>
            <td>docker logs</td>
            <td>Container-Logs anzeigen</td>
          </tr>

        </table>

      </div>
    `;

    feedback.textContent = "";

    nextBtn.style.display = "none";
  }

});

showQuestion();