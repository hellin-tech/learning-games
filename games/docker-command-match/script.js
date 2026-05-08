const statements = [
  {
    text: "Container aus nginx-Image starten",
    type: "run"
  },
  {
    text: "Laufende Container anzeigen",
    type: "ps"
  },
  {
    text: "Container sauber beenden",
    type: "stop"
  },
  {
    text: "Container endgültig löschen",
    type: "rm"
  }
];

const cardsContainer = document.getElementById("cards");

statements.forEach((item, index) => {
  const card = document.createElement("div");

  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = `card-${index}`;

  card.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", card.id);
  });

  cardsContainer.appendChild(card);
});

const zones = document.querySelectorAll(".zone");

zones.forEach(zone => {

  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("over");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();

    zone.classList.remove("over");

    const cardId = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);

    zone.appendChild(card);
  });

});

const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");

checkBtn.addEventListener("click", () => {

  let correct = 0;

  document.querySelectorAll(".card").forEach(card => {

    const parentZone = card.closest(".zone");

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

  result.innerHTML = `
    <h2>${correct} / ${statements.length} richtig</h2>

    <p>
      Docker-Befehle sind die Grundlage für Container-Management.
    </p>
  `;
});