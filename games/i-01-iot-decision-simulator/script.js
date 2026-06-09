const decisions = [

{
title:"Pilotprojekt starten",
text:"Wie sollte NovaTech beginnen?",
answers:[
"Pilot auf CNC-Fräse 12",
"Alle 47 Maschinen gleichzeitig umbauen"
],
correct:0,
effect:{
benefit:20,
security:0,
roi:20
},
explanation:
"Ein Pilotprojekt reduziert Risiko und liefert schnell verwertbare Erkenntnisse."
},

{
title:"IT/OT Konvergenz",
text:"Wie sollen Produktionsanlagen angebunden werden?",
answers:[
"Segmentierte Architektur mit getrennten Zonen",
"Alle Maschinen direkt ins Office-LAN"
],
correct:0,
effect:{
benefit:20,
security:20,
roi:10
},
explanation:
"OT-Systeme benötigen eigene Sicherheitszonen und hohe Verfügbarkeit."
},

{
title:"Condition Monitoring",
text:"Wie erkennt Sarah Probleme frühzeitig?",
answers:[
"Echtzeit-Dashboard und Alarme",
"Nur Papierprotokolle"
],
correct:0,
effect:{
benefit:25,
security:0,
roi:20
},
explanation:
"Zentrale Überwachung reduziert Ausfallzeiten erheblich."
},

{
title:"Predictive Maintenance",
text:"Wie soll Wartung geplant werden?",
answers:[
"Sensorbasierte Trendanalyse",
"Warten bis Maschinen ausfallen"
],
correct:0,
effect:{
benefit:25,
security:0,
roi:30
},
explanation:
"Geplante Wartung ist deutlich günstiger als ungeplante Ausfälle."
},

{
title:"Sicherheit",
text:"Dr. Weber fordert Schutzmaßnahmen.",
answers:[
"Netzsegmentierung und kontrollierte Kommunikation",
"Offene Zugriffe für alle Systeme"
],
correct:0,
effect:{
benefit:10,
security:30,
roi:10
},
explanation:
"Sicherheit ist Voraussetzung für stabile IIoT-Systeme."
}

];

let current=0;
let benefit=0;
let security=100;
let roi=0;

const scenario=document.getElementById("scenario");
const answers=document.getElementById("answers");
const feedback=document.getElementById("feedback");

function updateStats(){

  document.getElementById("benefit").textContent=benefit;
  document.getElementById("security").textContent=security;
  document.getElementById("roi").textContent=roi;

}

function render(){

  const item=decisions[current];

  scenario.innerHTML=`
    <div class="ch-card">
      <h2>${item.title}</h2>
      <p>${item.text}</p>
    </div>
  `;

  answers.innerHTML="";

  item.answers.forEach((answer,index)=>{

    const button=document.createElement("button");

    button.className="answer";
    button.textContent=answer;

    button.addEventListener("click",()=>evaluate(index));

    answers.appendChild(button);

  });

}

function evaluate(index){

  const item=decisions[current];

  if(index===item.correct){

    benefit+=item.effect.benefit;
    security+=item.effect.security;
    roi+=item.effect.roi;

    feedback.innerHTML=`
      <div class="ch-card correct-box">
        <h3>Gute Entscheidung</h3>
        <p>${item.explanation}</p>
      </div>
    `;

  }else{

    security-=20;

    feedback.innerHTML=`
      <div class="ch-card wrong-box">
        <h3>Riskante Entscheidung</h3>
        <p>${item.explanation}</p>
      </div>
    `;

  }

  updateStats();

  setTimeout(()=>{

    current++;

    if(current<decisions.length){

      render();

    }else{

      finish();

    }

  },1800);

}

function finish(){

  scenario.innerHTML=`
    <div class="ch-card">
      <h2>Entscheidungsvorlage erstellt</h2>

      <p>
        Nutzen: ${benefit}
      </p>

      <p>
        Sicherheit: ${security}
      </p>

      <p>
        ROI: ${roi}
      </p>

      <h3>Merksatz</h3>

      <p>
        IoT verbindet Maschinen, Daten und Geschäftsprozesse.
        Der größte Mehrwert entsteht durch Transparenz,
        Predictive Maintenance und sichere IT/OT-Konvergenz.
      </p>
    </div>
  `;

  answers.innerHTML="";
  feedback.innerHTML="";
}

updateStats();
render();