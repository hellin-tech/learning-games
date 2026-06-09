const components = [
  { text: "Temperatursensor CNC 12", layer: "perception" },
  { text: "Vibrationssensor", layer: "perception" },
  { text: "MQTT Broker", layer: "network" },
  { text: "OPC UA Verbindung", layer: "network" },
  { text: "InfluxDB", layer: "processing" },
  { text: "Edge Gateway (Raspberry Pi)", layer: "processing" },
  { text: "Grafana Dashboard", layer: "application" },
  { text: "Push Alarm an Sarah", layer: "application" }
];

const cards = document.getElementById("cards");

components.forEach((item,index)=>{

  const card=document.createElement("div");

  card.className="card";
  card.draggable=true;
  card.textContent=item.text;
  card.dataset.layer=item.layer;
  card.id=`card-${index}`;

  card.addEventListener("dragstart",e=>{
    e.dataTransfer.setData("text/plain",card.id);
  });

  cards.appendChild(card);
});

document.querySelectorAll(".zone").forEach(zone=>{

  zone.addEventListener("dragover",e=>{
    e.preventDefault();
    zone.classList.add("over");
  });

  zone.addEventListener("dragleave",()=>{
    zone.classList.remove("over");
  });

  zone.addEventListener("drop",e=>{

    e.preventDefault();

    zone.classList.remove("over");

    const id=e.dataTransfer.getData("text/plain");

    zone.appendChild(document.getElementById(id));

  });

});

document.getElementById("checkBtn")
.addEventListener("click",()=>{

  let score=0;

  document.querySelectorAll(".card")
  .forEach(card=>{

    card.classList.remove("correct","wrong");

    const zone=card.closest(".zone");

    if(zone && zone.dataset.layer===card.dataset.layer){

      card.classList.add("correct");
      score++;

    }else{

      card.classList.add("wrong");

    }

  });

  const feedback=document.getElementById("feedback");

  if(score===components.length){

    feedback.innerHTML=`
      <div class="ch-card correct-box">
        <h2>Perfekt!</h2>
        <p>
          Du hast alle vier IoT-Schichten korrekt aufgebaut.
          Genau so entsteht die Datenkette von Sensor bis Dashboard.
        </p>
      </div>
    `;

  }else{

    feedback.innerHTML=`
      <div class="ch-card wrong-box">
        <h2>${score}/${components.length} korrekt</h2>

        <p>
          Sensoren gehören in die Wahrnehmungsschicht,
          MQTT in die Netzwerkschicht,
          InfluxDB und Gateway in die Verarbeitung,
          Dashboards und Alarme in die Anwendung.
        </p>
      </div>
    `;
  }

});