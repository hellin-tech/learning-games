const correctOrder = [
  "FROM python:3.11-slim",
  "WORKDIR /app",
  "COPY requirements.txt .",
  "RUN pip install -r requirements.txt",
  "COPY . .",
  "CMD [\"python\", \"main.py\"]"
];

let currentOrder = [...correctOrder];

function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }

}

shuffle(currentOrder);

const layers = document.getElementById("layers");

function render() {

  layers.innerHTML = "";

  currentOrder.forEach((item, index) => {

    const div = document.createElement("div");

    div.className = "layer-item";

    div.innerHTML = `
      <span>${item}</span>

      <div class="layer-controls">
        <button onclick="moveUp(${index})">⬆</button>
        <button onclick="moveDown(${index})">⬇</button>
      </div>
    `;

    layers.appendChild(div);

  });

}

function moveUp(index) {

  if (index === 0) return;

  [currentOrder[index - 1], currentOrder[index]] =
    [currentOrder[index], currentOrder[index - 1]];

  render();
}

function moveDown(index) {

  if (index === currentOrder.length - 1) return;

  [currentOrder[index + 1], currentOrder[index]] =
    [currentOrder[index], currentOrder[index + 1]];

  render();
}

document
  .getElementById("shuffleBtn")
  .addEventListener("click", () => {

    shuffle(currentOrder);
    render();

    document.getElementById("feedback").innerHTML = "";

  });

document
  .getElementById("checkBtn")
  .addEventListener("click", () => {

    let correct = 0;

    currentOrder.forEach((item, index) => {

      if (item === correctOrder[index]) {
        correct++;
      }

    });

    const feedback =
      document.getElementById("feedback");

    if (correct === correctOrder.length) {

      feedback.innerHTML = `
        <div class="ch-card correct-box">

          <h2>Perfekt!</h2>

          <p>
            Der Build-Cache kann jetzt optimal genutzt werden.
          </p>

        </div>
      `;

    } else {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">

          <h2>${correct} / ${correctOrder.length} korrekt</h2>

          <p>
            Tipp:
            requirements.txt sollte vor COPY . .
            kommen.
          </p>

        </div>
      `;

    }

  });

render();