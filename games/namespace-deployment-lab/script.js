const correctOrder = [
  "minikube start --nodes 2 --cpus 2 --memory 4096 --driver docker",
  "kubectl get nodes",
  "kubectl create namespace novatech-dev",
  "kubectl create namespace novatech-staging",
  "kubectl run nginx-dev --image=nginx:1.25 -n novatech-dev",
  "kubectl run nginx-staging --image=nginx:1.25 -n novatech-staging",
  "kubectl get pods --all-namespaces"
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

const steps = document.getElementById("steps");

function render() {
  steps.innerHTML = "";

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

    steps.appendChild(div);
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

    const feedback = document.getElementById("feedback");

    if (correct === correctOrder.length) {
      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <h2>Setup erfolgreich!</h2>

          <p>
            Der minikube-Cluster läuft mit zwei Nodes,
            kubectl ist verbunden und die dev/staging-Pods
            laufen in getrennten Namespaces.
          </p>
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <h2>${correct} / ${correctOrder.length} Schritte korrekt</h2>

          <p>
            Tipp: Erst Cluster starten, dann Status prüfen,
            danach Namespaces erstellen und Pods darin starten.
          </p>
        </div>
      `;
    }
  });

render();