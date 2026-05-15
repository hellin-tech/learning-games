let pods = [
  { version: "v1.2", ready: true },
  { version: "v1.2", ready: true },
  { version: "v1.2", ready: true }
];

const podGrid = document.getElementById("podGrid");
const feedback = document.getElementById("feedback");

function renderPods() {

  podGrid.innerHTML = "";

  pods.forEach((pod, index) => {

    const card = document.createElement("div");

    card.className = `
      ch-card
      ${pod.version === "v1.2"
        ? "warning-card"
        : "correct-box"}
    `;

    card.innerHTML = `
      <h3>API Pod ${index + 1}</h3>

      <p>Version: ${pod.version}</p>

      <p>Status: ${pod.ready ? "Ready" : "Starting"}</p>
    `;

    podGrid.appendChild(card);
  });

  checkSuccess();
}

function checkSuccess() {

  const allUpdated =
    pods.every(pod => pod.version === "v1.3");

  const healthyPods =
    pods.filter(pod => pod.ready).length;

  if (healthyPods < 3) {

    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>Downtime erkannt!</h2>

        <p>
          Durch maxUnavailable: 0 dürfen niemals
          weniger als 3 Pods verfügbar sein.
        </p>
      </div>
    `;

    return;
  }

  if (allUpdated && pods.length === 3) {

    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Rolling Update erfolgreich</h2>

        <p>
          Alle Pods laufen jetzt auf v1.3,
          ohne dass die API offline war.
        </p>
      </div>
    `;
  }
}

document.getElementById("addBtn")
  .addEventListener("click", () => {

    if (pods.length >= 4) {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <p>
            maxSurge: 1 erlaubt maximal
            einen zusätzlichen Pod.
          </p>
        </div>
      `;

      return;
    }

    pods.push({
      version: "v1.3",
      ready: false
    });

    renderPods();

    setTimeout(() => {

      const newPod =
        pods.find(pod => !pod.ready);

      if (newPod) {
        newPod.ready = true;
      }

      renderPods();

    }, 2000);
  });

document.getElementById("removeBtn")
  .addEventListener("click", () => {

    const oldPodIndex =
      pods.findIndex(
        pod => pod.version === "v1.2"
      );

    if (oldPodIndex === -1) {

      feedback.innerHTML = `
        <div class="ch-card correct-box">
          <p>Alle alten Pods wurden ersetzt.</p>
        </div>
      `;

      return;
    }

    const readyPods =
      pods.filter(p => p.ready).length;

    if (readyPods <= 3) {

      feedback.innerHTML = `
        <div class="ch-card wrong-box">
          <p>
            Du würdest unter die Mindestanzahl
            verfügbarer Pods fallen.
          </p>
        </div>
      `;

      return;
    }

    pods.splice(oldPodIndex, 1);

    renderPods();
  });

renderPods();