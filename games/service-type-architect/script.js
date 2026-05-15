const scenarios = [
  {
    text: "API-Server soll intern vom MQTT-Gateway über api-service erreichbar sein.",
    type: "clusterip"
  },
  {
    text: "PostgreSQL soll nur innerhalb des Clusters erreichbar sein.",
    type: "clusterip"
  },
  {
    text: "Tom möchte in minikube schnell von seinem Laptop auf die API zugreifen.",
    type: "nodeport"
  },
  {
    text: "Ein Service wird testweise über <NodeIP>:30080 erreichbar gemacht.",
    type: "nodeport"
  },
  {
    text: "In AKS soll Azure automatisch einen externen Load Balancer bereitstellen.",
    type: "loadbalancer"
  },
  {
    text: "Ein Service braucht in der Cloud eine externe IP-Adresse.",
    type: "loadbalancer"
  },
  {
    text: "api.novatech.de soll zur API und dashboard.novatech.de zu Grafana routen.",
    type: "ingress"
  },
  {
    text: "HTTP-Routing soll abhängig vom Hostnamen erfolgen.",
    type: "ingress"
  }
];

const cardsContainer = document.getElementById("cards");

scenarios.forEach((scenario, index) => {
  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = scenario.text;
  card.dataset.type = scenario.type;
  card.id = `service-scenario-${index}`;

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

  if (correct === scenarios.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Netzwerkarchitektur passt!</h2>

        <p>
          Interne Kommunikation läuft über ClusterIP.
          Tests können NodePort nutzen.
          Produktion nutzt LoadBalancer oder Ingress.
        </p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${scenarios.length} korrekt</h2>

        <p>
          Tipp: ClusterIP ist intern, NodePort ist einfacher externer Zugriff,
          LoadBalancer ist Cloud-Zugang und Ingress routet HTTP per Hostname.
        </p>
      </div>
    `;
  }
});