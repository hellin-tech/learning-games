const lines = document.querySelectorAll(".line");
const feedback = document.getElementById("feedback");

lines.forEach(line => {

  line.addEventListener("click", () => {
    line.classList.toggle("selected");
  });

});

document
  .getElementById("checkBtn")
  .addEventListener("click", () => {

    let score = 0;

    lines.forEach(line => {

      const shouldSelect =
        line.dataset.correct === "true";

      const selected =
        line.classList.contains("selected");

      line.classList.remove("correct", "wrong");

      if (shouldSelect && selected) {

        line.classList.add("correct");
        score++;

      } else if (selected && !shouldSelect) {

        line.classList.add("wrong");

      }

    });

    feedback.innerHTML = `
      <h2>${score} problematische Stellen erkannt</h2>

      <div class="ch-card">

        <h3>Erklärung</h3>

        <ul>
          <li>
            <strong>python:3.11</strong> ist zu groß →
            besser slim/alpine.
          </li>

          <li>
            <strong>COPY . /app</strong> vor pip install
            zerstört den Cache.
          </li>

          <li>
            <strong>vim + htop</strong> gehören nicht in
            Produktions-Container.
          </li>
        </ul>

      </div>
    `;
  });