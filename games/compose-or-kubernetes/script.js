const situations = [
  {
    text: "Nina möchte die IoT-Plattform lokal auf ihrem Laptop testen.",
    type: "compose"
  },
  {
    text: "NovaTech möchte API-Server automatisch bei hoher CPU-Last skalieren.",
    type: "kubernetes"
  },
  {
    text: "Tom möchte vier Container schnell gemeinsam starten.",
    type: "compose"
  },
  {
    text: "Die Plattform soll auf drei Servern laufen und beim Ausfall eines Servers weiterarbeiten.",
    type: "kubernetes"
  },
  {
    text: "Ein Update soll ohne Downtime schrittweise ausgerollt werden.",
    type: "kubernetes"
  },
  {
    text: "Eine kleine Demo-Umgebung soll auf einem einzelnen Server laufen.",
    type: "compose"
  },
  {
    text: "Abgestürzte Pods sollen automatisch ersetzt werden.",
    type: "kubernetes"
  },
  {
    text: "Die Services sollen für eine Unterrichtsübung einfach reproduzierbar gestartet werden.",
    type: "compose"
  }
];

const cardsContainer = document.getElementById("cards");

situations.forEach((item, index) => {
  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `situation-${index}`;

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

    if (
      parent &&
      parent.dataset.type === card.dataset.type
    ) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
    }
  });

  const feedback = document.getElementById("feedback");

  if (correct === situations.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Gute Architekturentscheidung!</h2>

        <p>
          Compose ist stark für lokale und einfache Setups.
          Kubernetes wird sinnvoll, sobald Skalierung,
          Self-Healing, Multi-Host oder Zero-Downtime wichtig werden.
        </p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${situations.length} korrekt</h2>

        <p>
          Tipp: Compose ist gut für einfache Single-Host-Setups.
          Kubernetes lohnt sich, wenn der Betrieb automatisch,
          fehlertolerant und skalierbar werden muss.
        </p>
      </div>
    `;
  }
});