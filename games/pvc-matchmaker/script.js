const cards = [
  {
    text: "PostgreSQL Produktionsdatenbank",
    match: "statefulset"
  },
  {
    text: "API-Server ohne lokalen Zustand",
    match: "deployment"
  },
  {
    text: "Block-Storage für PostgreSQL",
    match: "rwo"
  },
  {
    text: "Gemeinsames Filesystem für mehrere Pods",
    match: "rwx"
  },
  {
    text: "Produktionsdaten niemals automatisch löschen",
    match: "retain"
  },
  {
    text: "Kurzlebige Dev-Volumes automatisch entfernen",
    match: "delete"
  }
];

const cardsContainer = document.getElementById("cards");

cards.forEach((item, index) => {

  const card = document.createElement("div");

  card.className = "card code-card";
  card.textContent = item.text;
  card.draggable = true;

  card.dataset.match = item.match;
  card.id = `card-${index}`;

  card.addEventListener("dragstart", event => {
    event.dataTransfer.setData("text/plain", card.id);
  });

  cardsContainer.appendChild(card);

});

document.querySelectorAll(".drop-zone").forEach(zone => {

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

    const id =
      event.dataTransfer.getData("text/plain");

    const card = document.getElementById(id);

    zone.appendChild(card);

  });

});

document.getElementById("checkBtn")
.addEventListener("click", () => {

  let correct = 0;

  document.querySelectorAll(".card").forEach(card => {

    const parent = card.closest(".drop-zone");

    card.classList.remove("correct", "wrong");

    if (
      parent &&
      parent.dataset.match === card.dataset.match
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
        <h2>Storage-Architektur korrekt!</h2>

        <p>
          Stateful Workloads brauchen stabile Identitäten
          und persistenten Storage.
        </p>
      </div>
    `;

  } else {

    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct}/${cards.length} korrekt</h2>

        <p>
          Denke an:
          StatefulSet für Datenbanken,
          Deployment für stateless Apps,
          Retain für Produktionsdaten.
        </p>
      </div>
    `;

  }

});