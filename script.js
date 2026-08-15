const screens=[
  document.getElementById("opening"),
  document.getElementById("independence"),
  document.getElementById("birthday")
];
const dots=[...document.querySelectorAll(".dot")];
const hearts=document.getElementById("hearts");
const confetti=document.getElementById("confetti");
const soundButton=document.getElementById("soundButton");
let current=0,soundOn=true,audio=null;

function makeHearts(){
  const symbols=["♡","♥","❤"];
  const count=innerWidth<700?34:64;
  for(let i=0;i<count;i++){
    const el=document.createElement("span");
    el.className="heart";
    el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left=Math.random()*100+"%";
    el.style.fontSize=(10+Math.random()*14)+"px";
    el.style.animationDuration=(7+Math.random()*11)+"s";
    el.style.animationDelay=(-Math.random()*16)+"s";
    hearts.appendChild(el);
  }
}

function goTo(index){
  current=index;
  screens.forEach((s,i)=>s.classList.toggle("active",i===index));
  dots.forEach((d,i)=>d.classList.toggle("active",i===index));
  if(index===1){
    tone(523,.1);setTimeout(()=>tone(659,.1),120);setTimeout(()=>tone(784,.16),240);
  }
  if(index===2){
    confettiBurst();
    tone(523,.1);setTimeout(()=>tone(659,.1),120);
    setTimeout(()=>tone(784,.1),240);setTimeout(()=>tone(1047,.22),360);
  }
}

function initAudio(){
  if(!audio) audio=new(window.AudioContext||window.webkitAudioContext)();
  if(audio.state==="suspended") audio.resume();
}

let melodyTimer=null;
let melodyStep=0;
const melody=[523.25,659.25,783.99,659.25,698.46,880,783.99,659.25,
              523.25,659.25,783.99,1046.5,880,783.99,659.25,523.25];

function tone(freq,duration=.14,when=0,volume=.035){
  if(!soundOn)return;
  try{
    initAudio();
    const o=audio.createOscillator(),g=audio.createGain();
    o.type="triangle";
    o.frequency.setValueAtTime(freq,audio.currentTime+when);
    g.gain.setValueAtTime(.0001,audio.currentTime+when);
    g.gain.exponentialRampToValueAtTime(volume,audio.currentTime+when+.015);
    g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+when+duration);
    o.connect(g);g.connect(audio.destination);
    o.start(audio.currentTime+when);
    o.stop(audio.currentTime+when+duration+.03);
  }catch(e){}
}

function startMelody(){
  if(!soundOn || melodyTimer) return;
  initAudio();
  const playNext=()=>{
    if(!soundOn)return;
    tone(melody[melodyStep],.24,0,.028);
    melodyStep=(melodyStep+1)%melody.length;
  };
  playNext();
  melodyTimer=setInterval(playNext,320);
}

function stopMelody(){
  if(melodyTimer){clearInterval(melodyTimer);melodyTimer=null;}
}

function confettiBurst(){
  confetti.innerHTML="";
  const chars=["■","◆","●","♥"];
  const colors=["#d95768","#ff9b32","#3e9b5c","#5f7dd8","#e77a9c"];
  const count=innerWidth<700?65:115;
  for(let i=0;i<count;i++){
    const p=document.createElement("span");
    p.className="confetti-piece";
    p.textContent=chars[Math.floor(Math.random()*chars.length)];
    p.style.left=Math.random()*100+"%";
    p.style.color=colors[Math.floor(Math.random()*colors.length)];
    p.style.fontSize=(8+Math.random()*9)+"px";
    p.style.setProperty("--drift",(-180+Math.random()*360)+"px");
    p.style.animationDelay=(Math.random()*.75)+"s";
    confetti.appendChild(p);
  }
  setTimeout(()=>confetti.innerHTML="",4300);
}

document.getElementById("openEnvelope").onclick=()=>{
  initAudio();
  startMelody();
  tone(392,.12);setTimeout(()=>tone(523,.16),120);
  setTimeout(()=>goTo(1),420);
};
document.getElementById("openButton").onclick=()=>document.getElementById("openEnvelope").click();
document.getElementById("birthdayButton").onclick=()=>goTo(2);
document.getElementById("againButton").onclick=()=>{ stopMelody(); melodyStep=0; goTo(0); };

soundButton.onclick=()=>{
  soundOn=!soundOn;
  if(soundOn){
    initAudio(); startMelody(); tone(659,.12);
  }else{
    stopMelody();
  }
  soundButton.classList.toggle("off",!soundOn);
  soundButton.textContent=soundOn?"♫":"×";
};

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"&&current<2)goTo(current+1);
  if(e.key==="ArrowLeft"&&current>0)goTo(current-1);
  if((e.key==="Enter"||e.key===" ")&&current===0)document.getElementById("openEnvelope").click();
});

makeHearts();
