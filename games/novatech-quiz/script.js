Cloudhelden.renderHeader({
  kicker: "NovaTech Szenario",
  title: "Container-Entscheidung",
  subtitle: "Prüfe dein Verständnis zu Container-Motivation, Namespaces, cgroups und OCI."
});
Cloudhelden.renderFooter();

const questions = [
  {
    question: "Was ist das eigentliche Problem bei NovaTech?",
    answers: [
      "Die Entwickler schreiben schlechten Code.",
      "Die Anwendung läuft in unterschiedlichen Umgebungen unterschiedlich.",
      "Der CI-Server ist grundsätzlich ungeeignet.",
      "Python ist für IoT-Anwendungen nicht geeignet."
    ],
    correct: 1,
    explanation: "Das Problem sind unterschiedliche Versionen, Bibliotheken und fehlende Abhängigkeiten."
  },
  {
    question: "Warum reicht eine bessere Installationsanleitung nicht aus?",
    answers: [
      "Weil Dokumentation grundsätzlich nutzlos ist.",
      "Weil manuelle Schritte fehleranfällig sind und keine identische Umgebung garantieren.",
      "Weil Container keine Dokumentation brauchen.",
      "Weil Entwickler keine Anleitungen lesen dürfen."
    ],
    correct: 1,
    explanation: "Eine Anleitung beschreibt nur Schritte, garantiert aber nicht automatisch dieselbe Umgebung."
  },
  {
    question: "Was ist der wichtigste Unterschied zwischen VM und Container?",
    answers: [
      "Container enthalten immer ein vollständiges Gast-OS.",
      "VMs teilen sich den Host-Kernel, Container nicht.",
      "Container teilen sich den Kernel des Hosts, VMs haben ein eigenes Gast-OS.",
      "VMs starten immer schneller als Container."
    ],
    correct: 2,
    explanation: "Container enthalten App + Bibliotheken, aber kein eigenes vollständiges Gastbetriebssystem."
  },
  {
    question: "Welche Rolle spielen Namespaces?",
    answers: [
      "Sie begrenzen CPU und RAM.",
      "Sie isolieren die Sicht auf Prozesse, Netzwerk, Dateisystem und Benutzer.",
      "Sie speichern Container-Images.",
      "Sie ersetzen den Docker-Daemon."
    ],
    correct: 1,
    explanation: "Namespaces regeln, was ein Container sehen kann."
  },
  {
    question: "Welche Rolle spielen cgroups?",
    answers: [
      "Sie begrenzen Ressourcen wie CPU und RAM.",
      "Sie starten Docker-Befehle.",
      "Sie definieren das Container-Image-Format.",
      "Sie sind ein Ersatz für OCI."
    ],
    correct: 0,
    explanation: "cgroups regeln, wie viel ein Container verbrauchen darf."
  },
  {
    question: "Warum ist OCI wichtig?",
    answers: [
      "Weil OCI Docker komplett ersetzt.",
      "Weil OCI Standards für Images, Runtimes und Distribution definiert.",
      "Weil OCI nur für virtuelle Maschinen gilt.",
      "Weil OCI Container unsicherer macht."
    ],
    correct: 1,
    explanation: "OCI sorgt dafür, dass verschiedene Tools kompatibel bleiben."
  },
  {
    question: "Was wäre ein sinnvoller erster Schritt für NovaTech?",
    answers: [
      "Alle Systeme sofort abschalten und neu bauen.",
      "Den Sensor-Ingestion-Service als Pilotprojekt containerisieren.",
      "Alle Entwickler auf dieselbe Hardware verpflichten.",
      "Die Installationsanleitung von 47 auf 100 Schritte erweitern."
    ],
    correct: 1,
    explanation: "Ein Pilotprojekt ist realistisch, begrenzt das Risiko und zeigt schnell Nutzen."
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let answered = false;

const questionBox = document.getElementById("questionBox");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

function showQuestion() {
  selectedAnswer = null;
  answered = false;
  feedback.textContent = "";
  Cloudhelden.setProgress(currentQuestion, questions.length);

  const q = questions[currentQuestion];

  questionBox.innerHTML = `
    <div class="question">${currentQuestion + 1}. ${q.question}</div>
    ${q.answers.map((answer, index) => `
      <button class="answer" data-index="${index}">${answer}</button>
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

  nextBtn.textContent = currentQuestion === questions.length - 1 ? "Auswerten" : "Weiter";
}

nextBtn.addEventListener("click", () => {
  const q = questions[currentQuestion];

  if (selectedAnswer === null) {
    feedback.textContent = "Bitte wähle zuerst eine Antwort aus.";
    return;
  }

  if (!answered) {
    answered = true;

    document.querySelectorAll(".answer").forEach(button => {
      const index = Number(button.dataset.index);

      if (index === q.correct) button.classList.add("correct");
      if (index === selectedAnswer && index !== q.correct) button.classList.add("wrong");
    });

    if (selectedAnswer === q.correct) {
      score++;
      feedback.textContent = "Richtig! " + q.explanation;
    } else {
      feedback.textContent = "Nicht ganz. " + q.explanation;
    }

    nextBtn.textContent = currentQuestion === questions.length - 1
      ? "Ergebnis anzeigen"
      : "Nächste Frage";

    return;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    Cloudhelden.setProgress(questions.length, questions.length);
    questionBox.innerHTML = `
      <h2>Ergebnis</h2>
      <p>Du hast <strong>${score} von ${questions.length}</strong> Fragen richtig beantwortet.</p>
      <p><strong>Reflexion:</strong> Erkläre in eigenen Worten, warum Container das „Works on my machine“-Problem besser lösen als eine lange Installationsanleitung.</p>
    `;

    feedback.textContent = "";
    nextBtn.style.display = "none";
  }
});

showQuestion();
