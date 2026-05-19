const cards = [
  {
    text: "CPU-Auslastung der API-Pods über Zeit messen",
    type: "prometheus"
  },
  {
    text: "PromQL-Abfragen wie rate(http_requests_total[5m]) nutzen",
    type: "prometheus"
  },
  {
    text: "Dashboard für Lisa mit Node-Status und Error-Rate bauen",
    type: "grafana"
  },
  {
    text: "API-Latenz, Traffic und Errors grafisch darstellen",
    type: "grafana"
  },
  {
    text: "Logs aller Pods zentral einsammeln",
    type: "fluentbit"
  },
  {
    text: "Error-Logs des API-Servers über alle Replicas suchen",
    type: "fluentbit"
  },
  {
    text: "API-Server bei hoher CPU-Last von 3 auf 7 Pods erhöhen",
    type: "hpa"
  },
  {
    text: "Automatisch skalieren, wenn 500 Sensoren gleichzeitig senden",
    type: "hpa"
  },
  {
    text: "Container neu starten, wenn /health nicht mehr antwortet",
    type: "probes"
  },
  {
    text: "Pod erst Traffic geben, wenn /ready erfolgreich ist",
    type: "probes"
  }
];

const cardsContainer = document.getElementById("cards");

cards.forEach((item, index) => {
  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `obs-card-${index}`;

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

  if (correct === cards.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Observability-Stack verstanden!</h2>

        <p>
          Prometheus sammelt Metriken, Grafana visualisiert,
          Fluent Bit sammelt Logs, HPA skaliert und Probes prüfen
          die Gesundheit der Pods.
        </p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${cards.length} korrekt</h2>

        <p>
          Tipp: Metriken = Prometheus, Dashboards = Grafana,
          Logs = Fluent Bit, Skalierung = HPA, Gesundheit = Probes.
        </p>
      </div>
    `;
  }
});