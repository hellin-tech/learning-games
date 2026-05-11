const questions = [
  {
    question:
      "Sensor-Ingestion soll die Datenbank stabil erreichen. Was ist besser als eine feste IP?",
    answers: [
      "DB_HOST=172.17.0.3 fest eintragen",
      "Container im User-Defined Network per Name ansprechen",
      "Den Datenbank-Port öffentlich freigeben",
      "Container ohne Netzwerk starten"
    ],
    correct: 1,
    explanation:
      "In user-defined bridge networks funktioniert Container-DNS. timescaledb bleibt als Name stabil."
  },

  {
    question:
      "Grafana soll im Browser unter localhost:3000 erreichbar sein. Was brauchst du?",
    answers: [
      "-p 3000:3000",
      "--network none",
      "EXPOSE 3000 reicht aus",
      "docker volume create grafana"
    ],
    correct: 0,
    explanation:
      "Nur -p mapped den Container-Port auf den Host-Port. EXPOSE dokumentiert nur."
  },

  {
    question:
      "TimescaleDB soll nur intern erreichbar sein. Was ist die beste Entscheidung?",
    answers: [
      "-p 5432:5432 setzen",
      "Kein Port-Mapping setzen und DB nur ins Backend-Netzwerk hängen",
      "DB ins Frontend-Netzwerk legen",
      "--network host verwenden"
    ],
    correct: 1,
    explanation:
      "Ohne Port-Mapping ist die DB nicht direkt vom Host/Internet erreichbar."
  },

  {
    question:
      "Container sollen sich gegenseitig per Name finden. Welches Netzwerk ist sinnvoll?",
    answers: [
      "Default bridge",
      "User-defined bridge",
      "none",
      "tmpfs"
    ],
    correct: 1,
    explanation:
      "User-defined bridge networks bieten automatische DNS-Auflösung."
  },

  {
    question:
      "Ein Container soll bewusst keinerlei Netzwerkzugriff haben. Was nutzt du?",
    answers: [
      "--network none",
      "--network bridge",
      "-p 80:80",
      "--network host"
    ],
    correct: 0,
    explanation:
      "--network none isoliert den Container vollständig vom Netzwerk."
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

const questionBox =
  document.getElementById("questionBox");

const feedback =
  document.getElementById("feedback");

const nextBtn =
  document.getElementById("nextBtn");

const progressBar =
  document.getElementById("progressBar");

function updateProgress() {

  const progress =
    (currentQuestion / questions.length) * 100;

  progressBar.style.width =
    `${progress}%`;

}

function showQuestion() {

  selectedAnswer = null;
  answered = false;
  feedback.innerHTML = "";

  updateProgress();

  const q =
    questions[currentQuestion];

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

  document.querySelectorAll(".answer")
    .forEach(button => {

      button.addEventListener("click", () => {

        if (answered) return;

        document.querySelectorAll(".answer")
          .forEach(btn =>
            btn.classList.remove("selected")
          );

        button.classList.add("selected");

        selectedAnswer =
          Number(button.dataset.index);

      });

    });

}

nextBtn.addEventListener("click", () => {

  const q =
    questions[currentQuestion];

  if (selectedAnswer === null) {

    feedback.innerHTML =
      "Bitte wähle zuerst eine Antwort aus.";

    return;

  }

  if (!answered) {

    answered = true;

    document.querySelectorAll(".answer")
      .forEach(button => {

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

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h3>Richtig!</h3>
          <p>${q.explanation}</p>
        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h3>Nicht ganz.</h3>
          <p>${q.explanation}</p>
        </div>
      `;

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
      <div class="ch-card">

        <h2>Challenge abgeschlossen</h2>

        <p>
          Du hast <strong>${score}</strong> von
          <strong>${questions.length}</strong>
          Fragen richtig beantwortet.
        </p>

        <h3>Merksatz</h3>

        <p>
          Container sprechen intern über Namen.
          Von außen braucht es Port-Mapping.
          Sicherheit entsteht durch saubere Netzwerk-Segmentierung.
        </p>

      </div>
    `;

    feedback.innerHTML = "";
    nextBtn.style.display = "none";

  }

});

showQuestion();