const items = [
  {
    text: 'environment = "dev" mit Validierung dev/staging/prod',
    type: "variable",
    reason: "Die Umgebung unterscheidet sich pro Deployment und sollte als Variable validiert werden."
  },
  {
    text: 'location = "westeurope"',
    type: "variable",
    reason: "Die Azure-Region kann je Umgebung unterschiedlich sein und gehört daher in eine Variable."
  },
  {
    text: 'vm_size = "Standard_B2s"',
    type: "variable",
    reason: "VM-Größen unterscheiden sich typischerweise zwischen Dev, Staging und Prod."
  },
  {
    text: 'db_password mit sensitive = true',
    type: "variable",
    reason: "Secrets werden von außen übergeben und sollten als sensitive markiert werden."
  },
  {
    text: 'name_prefix = "novatech-${var.environment}"',
    type: "local",
    reason: "Der Prefix wird aus anderen Werten berechnet und im Code wiederverwendet."
  },
  {
    text: "common_tags mit environment, project, managed_by",
    type: "local",
    reason: "Gemeinsame Tags sind intern berechnete Wiederverwendungswerte."
  },
  {
    text: 'cost_center = var.environment == "prod" ? "CC-100" : "CC-200"',
    type: "local",
    reason: "Das ist ein berechneter Wert per ternärem Operator."
  },
  {
    text: "resource_group_id",
    type: "output",
    reason: "Die Resource-Group-ID wird nach dem Apply für andere Tools oder Module sichtbar gemacht."
  },
  {
    text: "vm_public_ip",
    type: "output",
    reason: "Die öffentliche IP ist ein Ergebnis der Infrastruktur und kann z.B. von CI/CD genutzt werden."
  }
];

const cardsContainer = document.getElementById("cards");
const feedback = document.getElementById("feedback");

items.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "card code-card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.dataset.reason = item.reason;
  card.id = `hcl-card-${index}`;

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

    if (card) zone.appendChild(card);
  });
});

document.getElementById("checkBtn").addEventListener("click", () => {
  let correct = 0;
  const wrongHints = [];

  document.querySelectorAll(".card").forEach(card => {
    const zone = card.closest(".zone");
    card.classList.remove("correct", "wrong");

    if (zone && zone.dataset.type === card.dataset.type) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
      wrongHints.push(`<li><strong>${card.textContent}</strong>: ${card.dataset.reason}</li>`);
    }
  });

  if (correct === items.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Refactoring erfolgreich!</h2>
        <p>
          Tom kann denselben Terraform-Code jetzt für Dev, Staging und Prod nutzen,
          ohne 14 Stellen manuell ändern zu müssen.
        </p>
        <p><strong>Merksatz:</strong> Variablen kommen von außen, Locals berechnen interne Wiederverwendungswerte, Outputs geben Ergebnisse nach außen.</p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${items.length} korrekt</h2>
        <p>Prüfe diese Entscheidungen noch einmal:</p>
        <ul>${wrongHints.join("")}</ul>
      </div>
    `;
  }
});