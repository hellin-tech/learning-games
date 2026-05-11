const services = [
  {
    text: "Grafana Dashboard :3000",
    type: "frontend"
  },
  {
    text: "TimescaleDB :5432",
    type: "backend"
  },
  {
    text: "Sensor-Ingestion :8000",
    type: "backend"
  },
  {
    text: "API-Gateway :80 / :443",
    type: "both"
  }
];

const cardsContainer = document.getElementById("cards");

services.forEach((service, index) => {

  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = service.text;
  card.dataset.type = service.type;
  card.id = `service-${index}`;

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

    if (correct === services.length) {

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h2>Architektur passt!</h2>

          <p>
            Frontend und Backend sind sauber getrennt.
            Nur das API-Gateway ist in beiden Netzwerken.
          </p>
        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h2>${correct} / ${services.length} korrekt</h2>

          <p>
            Tipp: Die Datenbank sollte nicht im Frontend-Netzwerk liegen.
            Das API-Gateway ist der kontrollierte Übergang.
          </p>
        </div>
      `;

    }

  });