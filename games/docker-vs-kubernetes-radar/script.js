const items = [
  {
    text: "Mehrere Server verwalten",
    type: "kubernetes"
  },
  {
    text: "Kleine lokale Entwicklungsumgebung",
    type: "compose"
  },
  {
    text: "Automatisches Auto-Scaling",
    type: "kubernetes"
  },
  {
    text: "Einfaches lokales Testing",
    type: "compose"
  },
  {
    text: "Rolling Updates ohne Downtime",
    type: "kubernetes"
  },
  {
    text: "Single-Host Setup",
    type: "compose"
  },
  {
    text: "Self-Healing von Services",
    type: "kubernetes"
  },
  {
    text: "Schnelles Starten mehrerer Container lokal",
    type: "compose"
  }
];

const cardsContainer =
  document.getElementById("cards");

items.forEach((item, index) => {

  const card =
    document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `radar-item-${index}`;

  card.addEventListener("dragstart", event => {

    event.dataTransfer.setData(
      "text/plain",
      card.id
    );

  });

  cardsContainer.appendChild(card);

});

document.querySelectorAll(".zone")
  .forEach(zone => {

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

      const cardId =
        event.dataTransfer.getData("text/plain");

      const card =
        document.getElementById(cardId);

      zone.appendChild(card);

    });

  });

document
  .getElementById("checkBtn")
  .addEventListener("click", () => {

    let correct = 0;

    document.querySelectorAll(".card")
      .forEach(card => {

        const parent =
          card.closest(".zone");

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

    const feedback =
      document.getElementById("feedback");

    if (correct === items.length) {

      feedback.innerHTML = `
        <div class="ch-card correct-box">

          <h2>Skalierungsgrenze verstanden!</h2>

          <p>
            Docker Compose ist ideal für lokale oder kleine Setups.
            Kubernetes löst Multi-Host- und Produktionsprobleme.
          </p>

        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">

          <h2>${correct} / ${items.length} korrekt</h2>

          <p>
            Compose = Single Host.
            Kubernetes = Skalierung, Orchestrierung und Self-Healing.
          </p>

        </div>
      `;

    }

  });