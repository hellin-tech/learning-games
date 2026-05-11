const items = [
  {
    text: "timescaledb:",
    type: "services"
  },
  {
    text: "sensor-ingestion:",
    type: "services"
  },
  {
    text: "api-gateway:",
    type: "services"
  },
  {
    text: "grafana:",
    type: "services"
  },
  {
    text: "frontend:",
    type: "networks"
  },
  {
    text: "backend:",
    type: "networks"
  },
  {
    text: "sensor-db-data:",
    type: "volumes"
  },
  {
    text: "grafana-data:",
    type: "volumes"
  }
];

const cardsContainer =
  document.getElementById("cards");

items.forEach((item, index) => {

  const card =
    document.createElement("div");

  card.className = "card code-card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `compose-item-${index}`;

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

        const parentZone =
          card.closest(".zone");

        card.classList.remove("correct", "wrong");

        if (
          parentZone &&
          parentZone.dataset.type === card.dataset.type
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
          <h2>Compose-Datei verstanden!</h2>
          <p>
            Services, Netzwerke und Volumes sind die zentralen
            Bausteine einer docker-compose.yml.
          </p>
        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h2>${correct} / ${items.length} korrekt</h2>
          <p>
            Tipp: Container gehören unter services,
            Netzwerke unter networks und persistente Speicher unter volumes.
          </p>
        </div>
      `;

    }

  });