Cloudhelden.renderHeader({
  kicker: "Docker & Containerisierung",
  title: "VM oder Container?",
  subtitle: "Ordne die Aussagen der richtigen Technologie zu."
});
Cloudhelden.renderFooter();

const statements = Cloudhelden.shuffle([
  { text: "Enthält ein vollständiges Gast-Betriebssystem.", type: "vm" },
  { text: "Teilt sich den Kernel mit dem Host-System.", type: "container" },
  { text: "Startet oft in Sekundenbruchteilen.", type: "container" },
  { text: "Bietet starke Isolation durch eigenen Kernel.", type: "vm" },
  { text: "Ist oft mehrere GB groß.", type: "vm" },
  { text: "Enthält meist nur App und benötigte Bibliotheken.", type: "container" },
  { text: "Isolation erfolgt über Namespaces und cgroups.", type: "container" },
  { text: "Kann unterschiedliche Betriebssysteme auf demselben Host betreiben.", type: "vm" }
]);

const cardsContainer = document.getElementById("cards");

statements.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.id = "card-" + index;

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

document.getElementById("check").addEventListener("click", () => {
  let correct = 0;
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const parentZone = card.closest(".zone");
    card.classList.remove("correct", "wrong");

    if (parentZone && parentZone.dataset.type === card.dataset.type) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
    }
  });

  document.getElementById("result").textContent =
    `Du hast ${correct} von ${statements.length} Aussagen richtig zugeordnet.`;
});
