const items = [
  {
    text: "DATABASE_HOST=postgres-service",
    type: "configmap"
  },
  {
    text: "DATABASE_PORT=5432",
    type: "configmap"
  },
  {
    text: "LOG_LEVEL=debug",
    type: "configmap"
  },
  {
    text: "MQTT_BROKER=mqtt-service",
    type: "configmap"
  },
  {
    text: "FEATURE_DASHBOARD_V2=true",
    type: "configmap"
  },
  {
    text: "DATABASE_PASSWORD=Pr0d-S3cr3t!",
    type: "secret"
  },
  {
    text: "API_KEY=sk-prod-a8f3b2c1d4e5f6",
    type: "secret"
  },
  {
    text: "TLS_PRIVATE_KEY=tls.key",
    type: "secret"
  }
];

const cardsContainer = document.getElementById("cards");

items.forEach((item, index) => {
  const card = document.createElement("div");

  card.className = "card code-card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `config-item-${index}`;

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

  if (correct === items.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Sauber getrennt!</h2>

        <p>
          Nicht-sensible Werte gehören in ConfigMaps.
          Passwörter, API-Keys und private Schlüssel gehören in Secrets.
        </p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${items.length} korrekt</h2>

        <p>
          Tipp: Frage dich immer:
          Dürfte dieser Wert offen im Git-Repository stehen?
          Wenn nein, ist es ein Secret.
        </p>
      </div>
    `;
  }
});