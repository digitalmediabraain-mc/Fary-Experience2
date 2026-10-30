/* ============ CONFIGURACIÓN (edita aquí) ============ */
// Canciones de Spotify debajo de cada foto. Pega el link de la canción
// (Spotify → Compartir → Copiar enlace). Si dejas "url" vacío, ese enlace no se muestra.
const SONGS = [
  { title: "", artist: "", url: "" }, // foto 1
  { title: "", artist: "", url: "" }, // foto 2
  { title: "", artist: "", url: "" }, // foto 3
];
// Para recibir su elección por WhatsApp: tu número con código de país, sin + ni espacios (ej: "573001234567").
// Si lo dejas vacío, se abrirá WhatsApp para que ella elija el contacto.
const WHATSAPP_NUMBER = "";
const DATE_YEAR = 2026;          // el mes siempre es diciembre
const HOURS = [10,11,12,13,14,15,16,17,18,19,20,21]; // horas disponibles
/* ===================================================== */

const screens = [...document.querySelectorAll(".screen")];
function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top:0,behavior:"smooth"});
}
const $ = id => document.getElementById(id);

$("openLetter").addEventListener("click",()=>showScreen("letter"));
$("toMemories").addEventListener("click",()=>showScreen("memories"));
$("toInvite").addEventListener("click",()=>showScreen("invite"));
$("yesBtn").addEventListener("click",()=>{ showScreen("final"); makeHearts(); });
$("replay").addEventListener("click",()=>{ resetNo(); resetPicker(); showScreen("intro"); });

/* ---------- Spotify ---------- */
document.querySelectorAll(".song").forEach(a=>{
  const s = SONGS[+a.dataset.song];
  if(!s || !s.url) return;
  a.href = s.url;
  a.querySelector("span").textContent = [s.title, s.artist].filter(Boolean).join(" · ") || "Escuchar esta canción";
  a.hidden = false;
});

/* ---------- Botón NO: se mueve y al final se esconde detrás del SÍ ---------- */
const noBtn = $("noBtn"), yesBtn = $("yesBtn"), noNote = $("noNote"), wrap = $("choiceWrap");
const messages = ["¿Segura? 🥺","Dale otra oportunidad…","Ese botón está dudando 👀","Creo que querías decir que sí 💗"];
const MOVES_BEFORE_HIDE = messages.length;
let noCount = 0, tx = 0, ty = 0, noHidden = false;

function moveNoButton(){
  if(noHidden) return;
  noCount++;
  noNote.textContent = messages[Math.min(noCount-1,messages.length-1)];
  if(noCount >= MOVES_BEFORE_HIDE){ hideBehindYes(); return; }
  const maxX = Math.max(10, wrap.clientWidth/2-75);
  const maxY = 80;
  tx = (Math.random()*2-1)*maxX; ty = (Math.random()*2-1)*maxY;
  noBtn.style.transform = `translate(${tx}px, ${ty}px)`;
}
function hideBehindYes(){
  noHidden = true;
  const n = noBtn.getBoundingClientRect(), y = yesBtn.getBoundingClientRect();
  tx += (y.left + y.width/2) - (n.left + n.width/2);
  ty += (y.top + y.height/2) - (n.top + n.height/2);
  noBtn.style.transform = `translate(${tx}px, ${ty}px) scale(.9)`;
  noBtn.classList.add("is-hidden");           // queda detrás del SÍ: cualquier clic ahí cae en el SÍ
  noBtn.setAttribute("aria-hidden","true"); noBtn.tabIndex = -1;
}
function resetNo(){
  noCount = 0; tx = 0; ty = 0; noHidden = false;
  noBtn.style.transform = ""; noBtn.classList.remove("is-hidden");
  noBtn.removeAttribute("aria-hidden"); noBtn.tabIndex = 0;
  noNote.textContent = "Piénsalo bien… 👀";
}
noBtn.addEventListener("mouseenter",moveNoButton);
noBtn.addEventListener("click",moveNoButton);
noBtn.addEventListener("touchstart",(e)=>{e.preventDefault();moveNoButton();},{passive:false});
window.addEventListener("resize",()=>{ if(noHidden){ noBtn.style.transition="none"; noHidden=false; noBtn.style.transform=""; tx=ty=0; hideBehindYes(); requestAnimationFrame(()=>noBtn.style.transition=""); }});

/* ---------- Elegir día y hora (solo diciembre) ---------- */
const MONTH = 11; // diciembre
const DAYS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
let pickedDay = null, pickedHour = null;

const fmtHour = h => `${h%12||12}:00 ${h<12?"a. m.":"p. m."}`;
const cap = t => t.charAt(0).toUpperCase()+t.slice(1);
const longDate = d => `${cap(DAYS[new Date(DATE_YEAR,MONTH,d).getDay()])} ${d} de diciembre`;

$("pickerYear").textContent = DATE_YEAR;
(function buildCalendar(){
  const grid = $("calGrid");
  const first = (new Date(DATE_YEAR,MONTH,1).getDay()+6)%7; // lunes = 0
  const total = new Date(DATE_YEAR,MONTH+1,0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  for(let i=0;i<first;i++){ const e=document.createElement("span"); e.className="cal-empty"; grid.appendChild(e); }
  for(let d=1; d<=total; d++){
    const b=document.createElement("button");
    b.type="button"; b.className="cal-day"; b.textContent=d; b.dataset.day=d;
    b.disabled = new Date(DATE_YEAR,MONTH,d) < today;
    b.addEventListener("click",()=>pickDay(d));
    grid.appendChild(b);
  }
  const tg = $("timeGrid");
  HOURS.forEach(h=>{
    const c=document.createElement("button");
    c.type="button"; c.className="time-chip"; c.textContent=fmtHour(h); c.dataset.hour=h;
    c.addEventListener("click",()=>pickHour(h));
    tg.appendChild(c);
  });
})();

function pickDay(d){
  pickedDay = d;
  document.querySelectorAll(".cal-day").forEach(b=>b.classList.toggle("selected", +b.dataset.day===d));
  $("timeBlock").hidden = false;
  updateSummary();
}
function pickHour(h){
  pickedHour = h;
  document.querySelectorAll(".time-chip").forEach(b=>b.classList.toggle("selected", +b.dataset.hour===h));
  updateSummary();
}
function updateSummary(){
  const ok = pickedDay!==null && pickedHour!==null;
  $("pickSummary").textContent = pickedDay===null ? "" : ok ? `${longDate(pickedDay)} · ${fmtHour(pickedHour)}` : `${longDate(pickedDay)} · elige la hora`;
  $("confirmDate").disabled = !ok;
}
$("confirmDate").addEventListener("click",()=>{
  if(pickedDay===null || pickedHour===null) return;
  const txt = `${longDate(pickedDay)} de ${DATE_YEAR} · ${fmtHour(pickedHour)}`;
  $("planDate").textContent = txt;
  const msg = `Hola 💗 elegí nuestra cita: ${txt}.`;
  $("sendChoice").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  $("picker").hidden = true; $("planCard").hidden = false; $("closing").hidden = false;
  $("finalCopy").innerHTML = "Ya tenemos día y hora…<br>¡ahora viene la sorpresa!";
  makeHearts();
});
$("changeDate").addEventListener("click",()=>{
  $("planCard").hidden = true; $("closing").hidden = true; $("picker").hidden = false;
  $("finalCopy").innerHTML = "Ahora viene la parte más bonita…<br>tú eliges cuándo.";
});
function resetPicker(){
  pickedDay = pickedHour = null;
  document.querySelectorAll(".cal-day,.time-chip").forEach(b=>b.classList.remove("selected"));
  $("timeBlock").hidden = true; updateSummary();
  $("picker").hidden = false; $("planCard").hidden = true; $("closing").hidden = true;
  $("finalCopy").innerHTML = "Ahora viene la parte más bonita…<br>tú eliges cuándo.";
}

/* ---------- Corazones ---------- */
function makeHearts(){
  const box=document.querySelector(".confetti");
  box.innerHTML="";
  for(let i=0;i<24;i++){
    const h=document.createElement("span");
    h.textContent=Math.random()>.5?"♥":"♡";
    h.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${12+Math.random()*18}px;color:${Math.random()>.5?"#c58b8b":"#dfb7ad"};opacity:.65;animation:fadeIn ${.5+Math.random()}s ease both`;
    box.appendChild(h);
  }
}
