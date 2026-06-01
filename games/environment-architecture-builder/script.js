const cards = [
  {
    text: "Dev, Staging und Prod sind fast identisch.",
    type: "workspace",
    hint: "Workspaces eignen sich gut, wenn sich Umgebungen nur wenig unterscheiden."
  },
  {
    text: "Alle Umgebungen sollen dieselbe Codebasis ohne Verzeichnisduplikate nutzen.",
    type: "workspace",
    hint: "Workspaces verwenden ein gemeinsames Terraform-Projekt mit getrennten States."
  },
  {
    text: "Der aktuelle Workspace soll im Code als environment genutzt werden.",
    type: "workspace",
    hint: "Mit terraform.workspace kann der Workspace-Name im Code genutzt werden."
  },
  {
    text: "Prod hat zusätzliche Monitoring-Server und Disaster-Recovery-Ressourcen.",
    type: "directory",
    hint: "Stark unterschiedliche Umgebungen sind mit eigenen Verzeichnissen einfacher abzubilden."
  },
  {
    text: "CI/CD soll einfach cd environments/prod && terraform apply ausführen.",
    type: "directory",
    hint: "Verzeichnisse machen Pipeline-Jobs explizit und weniger abhängig von workspace select."
  },
  {
    text: "Lisa will maximale Verwechslungsarmut nach Ninas Beinahe-Prod-Unfall.",
    type: "directory",
    hint: "Ein eigenes prod-Verzeichnis mit eigenem Backend ist expliziter als nur ein Workspace-Wechsel."
  },
  {
    text: "Jede Umgebung braucht ein eigenes backend.tf mit eigenem State-Key.",
    type: "directory",
    hint: "Das ist typisch für den Verzeichnisstruktur-Ansatz."
  },
  {
    text: "Ein falsches workspace select wäre im Team ein realistisches Risiko.",
    type: "directory",
    hint: "Wenn Workspace-Verwechslung wahrscheinlich ist, ist die Verzeichnisstruktur sicherer."
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
  card.id = `env-card-${index}`;

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
        <h2>Architekturentscheidung sauber</h2>
        <p>
          Für NovaTech ist die Verzeichnisstruktur meist sicherer und CI/CD-freundlicher,
          während Workspaces bei sehr ähnlichen Umgebungen praktisch sein können.
        </p>
        <p><strong>Merksatz:</strong> Workspaces trennen State logisch, Verzeichnisse trennen Umgebungen explizit.</p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${cards.length} korrekt</h2>
        <p>Prüfe diese Zuordnungen noch einmal:</p>
        <ul>${hints.join("")}</ul>
      </div>
    `;
  }
});