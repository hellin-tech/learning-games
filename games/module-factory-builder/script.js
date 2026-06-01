const cards = [
  {
    text: 'module "staging_network" { source = "./modules/networking" }',
    type: "root",
    hint: "Ein module-Block im Root-Modul ruft ein Child-Modul auf."
  },
  {
    text: 'module "compute" nutzt module.staging_network.subnet_ids["backend"]',
    type: "root",
    hint: "Das Root-Modul verbindet Outputs eines Moduls mit Inputs eines anderen Moduls."
  },
  {
    text: "modules/networking/main.tf mit VNet, Subnets und NSG",
    type: "child",
    hint: "Ein Child-Modul ist ein Verzeichnis mit eigenen .tf-Dateien."
  },
  {
    text: "modules/compute/main.tf mit VM, NIC und Public IP",
    type: "child",
    hint: "Compute ist ein wiederverwendbarer Baustein und gehört in ein Child-Modul."
  },
  {
    text: 'variable "environment" { type = string }',
    type: "input",
    hint: "Variablen sind Eingaben eines Moduls."
  },
  {
    text: 'variable "subnets" { type = map(object(...)) }',
    type: "input",
    hint: "Die Subnet-Struktur wird von außen übergeben und ist ein Input."
  },
  {
    text: 'output "vnet_id" { value = azurerm_virtual_network.this.id }',
    type: "output",
    hint: "vnet_id wird nach außen gegeben und ist ein Output."
  },
  {
    text: 'output "subnet_ids" { value = { for k, v in azurerm_subnet.this : k => v.id } }',
    type: "output",
    hint: "Andere Module brauchen Subnet-IDs, also gehören sie in Outputs."
  }
];

const cardsContainer = document.getElementById("cards");
const feedback = document.getElementById("feedback");

cards.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "card code-card";
  card.draggable = true;
  card.textContent = item.text;
  card.dataset.type = item.type;
  card.dataset.hint = item.hint;
  card.id = `module-card-${index}`;

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
  const hints = [];

  document.querySelectorAll(".card").forEach(card => {
    const zone = card.closest(".zone");
    card.classList.remove("correct", "wrong");

    if (zone && zone.dataset.type === card.dataset.type) {
      card.classList.add("correct");
      correct++;
    } else {
      card.classList.add("wrong");
      hints.push(`<li><strong>${card.textContent}</strong>: ${card.dataset.hint}</li>`);
    }
  });

  if (correct === cards.length) {
    feedback.innerHTML = `
      <div class="ch-card correct-box">
        <h2>Modulbibliothek steht!</h2>
        <p>Tom und Nina können Netzwerk- und Compute-Bausteine jetzt wiederverwenden, statt Code zwischen Umgebungen zu kopieren.</p>
        <p><strong>Merksatz:</strong> Module sind Terraform-Funktionen: Inputs rein, Ressourcen intern, Outputs raus.</p>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="ch-card wrong-box">
        <h2>${correct} / ${cards.length} korrekt</h2>
        <p>Prüfe diese Zuordnungen:</p>
        <ul>${hints.join("")}</ul>
      </div>
    `;
  }
});