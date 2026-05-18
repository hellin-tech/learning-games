const cards = [

  {
    text:
      "Enthält Metadaten und Chart-Version",
    match:
      "chart"
  },

  {
    text:
      "Definiert Standardwerte",
    match:
      "values"
  },

  {
    text:
      "Enthält Kubernetes YAML-Dateien",
    match:
      "template"
  },

  {
    text:
      "Wiederverwendbare Template-Snippets",
    match:
      "helpers"
  }

];

const cardsContainer =
  document.getElementById("cards");

cards.forEach((item, index) => {

  const card = document.createElement("div");

  card.className = "card code-card";
  card.textContent = item.text;
  card.draggable = true;

  card.dataset.match = item.match;
  card.id = `card-${index}`;

  card.addEventListener("dragstart", event => {

    event.dataTransfer.setData(
      "text/plain",
      card.id
    );

  });

  cardsContainer.appendChild(card);

});

document.querySelectorAll(".drop-zone")
.forEach(zone => {

  zone.addEventListener("dragover", event => {

    event.preventDefault();

  });

  zone.addEventListener("drop", event => {

    event.preventDefault();

    const id =
      event.dataTransfer.getData("text/plain");

    const card = document.getElementById(id);

    zone.appendChild(card);

  });

});

document.getElementById("checkBtn")
.addEventListener("click", () => {

  let correct = 0;

  document.querySelectorAll(".card")
    .forEach(card => {

      const parent =
        card.closest(".drop-zone");

      card.classList.remove("correct", "wrong");

      if (
        parent &&
        parent.dataset.match ===
        card.dataset.match
      ) {

        card.classList.add("correct");
        correct++;

      } else {

        card.classList.add("wrong");

      }

    });

  const feedback =
    document.getElementById("feedback");

  if (correct === cards.length) {

    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Helm Chart erfolgreich gebaut!</h2>

        <p>
          NovaTech kann die Plattform jetzt
          reproduzierbar deployen.
        </p>
      </div>
    `;

  } else {

    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct}/${cards.length} korrekt</h2>

        <p>
          Prüfe nochmal die Struktur eines Helm Charts.
        </p>
      </div>
    `;

  }

});