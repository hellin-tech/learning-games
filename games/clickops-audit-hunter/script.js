const findings = [
  {
    text: "Port 22 ist in Produktion für 0.0.0.0/0 geöffnet.",
    type: "security"
  },
  {
    text: "Staging hat SSH korrekt eingeschränkt, Produktion nicht.",
    type: "drift"
  },
  {
    text: "Dev hat 2 Server, Staging 3 und Prod 4.",
    type: "drift"
  },
  {
    text: "Niemand kann erklären, warum sich die Umgebungen unterscheiden.",
    type: "audit"
  },
  {
    text: "Es gibt kein Änderungsprotokoll zur Firewall-Regel.",
    type: "audit"
  },
  {
    text: "Eine manuelle Firewall-Änderung wurde nicht zurückgesetzt.",
    type: "security"
  }
];

const cardsContainer = document.getElementById("cards");

findings.forEach((finding, index) => {
  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = finding.text;
  card.dataset.type = finding.type;
  card.id = `finding-${index}`;

  card.addEventListener("dragstart", event => {
    event.dataTransfer.setData("text/plain", card.id);
  });

  cardsContainer.appendChild(card);
});

document.querySelectorAll(".zone").forEach(zone => {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("over");
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("over");

    const cardId = event.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);

    zone.appendChild(card);
  });
});

document.getElementById("checkBtn").addEventListener("click", () => {
  let correct = 0;

  document.querySelectorAll(".card").forEach(card => {
    const parent = card.closest(".zone");

    card.classList.remove("correct", "wrong");

    if (parent && parent.dataset.type === card.dataset.type) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
    }
  });

  const feedback = document.getElementById("feedback");

  if (correct === findings.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Audit bestanden!</h2>
        <p>
          Du hast erkannt, warum ClickOps gefährlich wird:
          Sicherheitsrisiken, Drift und fehlende Nachvollziehbarkeit.
        </p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${findings.length} korrekt</h2>
        <p>
          Tipp: Offene Ports sind Security, unterschiedliche Umgebungen sind Drift,
          fehlende Historie ist Audit-/Nachvollziehbarkeitsproblem.
        </p>
      </div>
    `;
  }
});