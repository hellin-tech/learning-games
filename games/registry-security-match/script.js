const tasks = [
  {
    text: "Verhindert öffentliche Downloads proprietärer Images",
    type: "registry"
  },
  {
    text: "Erkennt kritische CVEs im Base-Image",
    type: "scanner"
  },
  {
    text: "Verifiziert, dass ein Image nicht manipuliert wurde",
    type: "signing"
  },
  {
    text: "Ersetzt problematische :latest Deployments",
    type: "tagging"
  },
  {
    text: "Findet verwundbare Bibliotheken wie libssl",
    type: "scanner"
  },
  {
    text: "Stellt sicher, dass Produktion exakt Version 2.1.0 nutzt",
    type: "tagging"
  },
  {
    text: "Kryptographische Signatur für Images",
    type: "signing"
  },
  {
    text: "Images nur für autorisierte Mitarbeiter verfügbar",
    type: "registry"
  }
];

const cardsContainer =
  document.getElementById("cards");

tasks.forEach((task, index) => {

  const card =
    document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = task.text;
  card.dataset.type = task.type;
  card.id = `task-${index}`;

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

    if (correct === tasks.length) {

      feedback.innerHTML = `
        <div class="ch-card correct-box">

          <h2>Supply-Chain abgesichert!</h2>

          <p>
            Private Registry, Scanning,
            Signierung und klare Versionierung
            gehören zusammen.
          </p>

        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">

          <h2>${correct} / ${tasks.length} korrekt</h2>

          <p>
            Tipp:
            Trivy findet Schwachstellen,
            Cosign signiert Images,
            Semantic Versioning ersetzt :latest.
          </p>

        </div>
      `;

    }

  });