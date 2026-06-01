const cards = [
  {
    text: "Prod-Firewall erlaubt SSH aus 0.0.0.0/0, Staging nicht.",
    type: "drift",
    hint: "Unterschiedliche Firewall-Regeln zwischen Umgebungen sind ein typischer Drift-Fall."
  },
  {
    text: "Dev, Staging und Prod haben unterschiedliche Server-Anzahlen.",
    type: "drift",
    hint: "Wenn angeblich identische Umgebungen auseinanderlaufen, liegt Konfigurationsdrift vor."
  },
  {
    text: "Niemand kann sagen, wer die Firewall geändert hat.",
    type: "traceability",
    hint: "Ohne Git-Historie, Review und Commit-Kontext fehlt Nachvollziehbarkeit."
  },
  {
    text: "Neue Admins brauchen Wochen, um die Infrastruktur zu verstehen.",
    type: "reproducibility",
    hint: "Wenn Wissen nur in Köpfen und Konsolen steckt, fehlt reproduzierbare Dokumentation."
  },
  {
    text: "Staging kann nach Ausfall nicht exakt neu erstellt werden.",
    type: "reproducibility",
    hint: "IaC beschreibt den Soll-Zustand maschinenlesbar und wiederholbar."
  },
  {
    text: "Firewall-Regeln als Code in Git versionieren.",
    type: "iac",
    hint: "Git macht Änderungen sichtbar, reviewbar und rückverfolgbar."
  },
  {
    text: "terraform plan vor jeder Änderung reviewen.",
    type: "iac",
    hint: "Der Plan zeigt vorab, was erstellt, geändert oder gelöscht wird."
  },
  {
    text: "Dev, Staging und Prod aus derselben Code-Basis erzeugen.",
    type: "iac",
    hint: "Gemeinsamer Code reduziert Abweichungen zwischen Umgebungen."
  }
];

const cardsContainer = document.getElementById("cards");
const feedback = document.getElementById("feedback");

cards.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.dataset.hint = item.hint;
  card.id = `audit-card-${index}`;

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

    if (card) zone.appendChild(card);
  });
});

document.getElementById("checkBtn").addEventListener("click", () => {
  let correct = 0;
  const hints = [];

  document.querySelectorAll(".card").forEach(card => {
    const zone = card.closest(".zone");
    card.classList.remove("correct", "wrong");

    if (zone && zone.dataset.type === card.dataset.type) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
      hints.push(`<li><strong>${card.textContent}</strong>: ${card.dataset.hint}</li>`);
    }
  });

  if (correct === cards.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Audit sauber triagiert</h2>
        <p>Lisa kann Dr. Weber jetzt erklären, warum ClickOps zu Drift, fehlender Nachvollziehbarkeit und schlechter Reproduzierbarkeit führt.</p>
        <p><strong>Merksatz:</strong> IaC macht Infrastruktur prüfbar, versionierbar und wiederholbar.</p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${cards.length} korrekt</h2>
        <p>Diese Punkte solltest du noch einmal prüfen:</p>
        <ul>${hints.join("")}</ul>
      </div>
    `;
  }
});