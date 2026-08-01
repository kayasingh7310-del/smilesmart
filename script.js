const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const todayKey = new Date().toISOString().slice(0,10);

$("#year").textContent = new Date().getFullYear();

$("#closeAnnouncement").addEventListener("click", e => e.currentTarget.parentElement.remove());

$("#menuButton").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#menuButton").setAttribute("aria-expanded", open);
});
$$("nav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));

const savedTheme = localStorage.getItem("smartSmileTheme");
if(savedTheme) document.documentElement.dataset.theme = savedTheme;
updateThemeIcon();
$("#themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("smartSmileTheme", next);
  updateThemeIcon();
});
function updateThemeIcon(){ $("#themeToggle").textContent = document.documentElement.dataset.theme === "dark" ? "☀" : "☾"; }

const form = $("#smileForm");
form.addEventListener("submit", e => {
  e.preventDefault();
  const d = new FormData(form);
  const vals = ["brush","floss","drinks","snacks","visit","tongue"].map(k=>Number(d.get(k)));
  const score = vals.reduce((a,b)=>a+b,0);
  const care = Math.round(((vals[0]+vals[1]+vals[5])/48)*100);
  const nutrition = Math.round(((vals[2]+vals[3])/35)*100);
  const prevention = Math.round((vals[4]/17)*100);
  updateScore(score,care,nutrition,prevention);
  localStorage.setItem("smartSmileScore", JSON.stringify({score,care,nutrition,prevention}));
  localStorage.setItem("badgeFirst","1");
  updateBadges();
});
function updateScore(score,care,nutrition,prevention){
  $("#scoreValue").textContent=score;
  $("#scoreCircle").style.background=`conic-gradient(var(--teal) ${score*3.6}deg,var(--border) 0deg)`;
  [["care",care],["nutrition",nutrition],["prevention",prevention]].forEach(([id,val])=>{
    $(`#${id}Bar`).style.width=val+"%"; $(`#${id}Label`).textContent=val+"%";
  });
  let heading,text,goal,badges=[];
  if(score>=85){heading="Strong smile habits!";text="You are practicing many habits that support oral health.";badges=["Excellent Brusher","Healthy Smiler"];}
  else if(score>=65){heading="A solid start";text="A few consistent improvements could strengthen your routine.";badges=["Smile Starter"];}
  else{heading="Build your routine";text="Small, realistic changes can make your daily care more consistent.";badges=["First Step"];}
  const fd=new FormData(form);
  if(Number(fd.get("brush"))<20) goal="Brush twice daily with fluoride toothpaste.";
  else if(Number(fd.get("floss"))<18) goal="Practice cleaning between your teeth once each day.";
  else if(Number(fd.get("drinks"))<18||Number(fd.get("snacks"))<17) goal="Reduce how often your teeth are exposed to sugary foods and drinks.";
  else if(Number(fd.get("visit"))<17) goal="Plan a routine dental visit when possible.";
  else goal="Keep your routine consistent this week.";
  $("#scoreHeading").textContent=heading; $("#scoreText").textContent=text; $("#goalCard").innerHTML=`<strong>Your weekly goal:</strong> ${goal}`;
  $("#earnedBadges").innerHTML=badges.map(b=>`<span class="badge-pill">${b}</span>`).join("");
}
const savedScore=localStorage.getItem("smartSmileScore");
if(savedScore){const s=JSON.parse(savedScore);updateScore(s.score,s.care,s.nutrition,s.prevention);$("#scoreHeading").textContent="Your saved Smile Score";}

const habitState=JSON.parse(localStorage.getItem("smartSmileHabits")||"{}");
const todays=habitState[todayKey]||{};
$$("[data-habit]").forEach(cb=>{cb.checked=!!todays[cb.dataset.habit];cb.addEventListener("change",saveHabits)});
function saveHabits(){
  const state=JSON.parse(localStorage.getItem("smartSmileHabits")||"{}");
  state[todayKey]={};
  $$("[data-habit]").forEach(cb=>state[todayKey][cb.dataset.habit]=cb.checked);
  localStorage.setItem("smartSmileHabits",JSON.stringify(state));
  updateHabits();
}
function updateHabits(){
  const done=$$("[data-habit]").filter(x=>x.checked).length;
  $("#habitComplete").textContent=done;
  if(done===5){localStorage.setItem("badgeRoutine","1");localStorage.setItem("lastCompleteDay",todayKey);}
  const last=localStorage.getItem("lastCompleteDay");
  $("#streakCount").textContent=last?1:0;
  updateBadges();
}
function updateBadges(){
  [["badgeFirst","badgeFirst"],["badgeRoutine","badgeRoutine"],["badgeQuiz","badgeQuiz"],["badgeReader","badgeReader"]].forEach(([el,key])=>{
    if(localStorage.getItem(key)) $(`#${el}`).classList.replace("locked","unlocked");
  });
}
updateHabits();updateBadges();

let openedCards=Number(localStorage.getItem("openedCards")||0);
$$(".learn-more").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".learning-card");
  const wasOpen=card.classList.contains("open");
  card.classList.toggle("open");
  btn.textContent=card.classList.contains("open")?"Show less":"Read more";
  if(!wasOpen){openedCards++;localStorage.setItem("openedCards",openedCards);if(openedCards>=3)localStorage.setItem("badgeReader","1");updateBadges();}
}));
$$(".filter-button").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".filter-button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  $$(".learning-card").forEach(card=>card.style.display=btn.dataset.filter==="all"||card.dataset.category===btn.dataset.filter?"block":"none");
}));

$$(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  $$(".tab").forEach(t=>t.classList.remove("active")); $$(".tool-panel").forEach(p=>p.classList.remove("active"));
  tab.classList.add("active"); $(`#${tab.dataset.tab}`).classList.add("active");
}));

const toothData={
enamel:["Enamel","The protective outer layer","Enamel covers the visible part of a tooth and protects the sensitive layers underneath.","Fluoride toothpaste can help strengthen enamel."],
dentin:["Dentin","The layer beneath enamel","Dentin is softer than enamel and contains tiny channels that may transmit sensitivity.","Protecting enamel also helps keep dentin covered."],
pulp:["Pulp","The living center","The pulp contains nerves, connective tissue, and blood vessels.","Deep decay that reaches the pulp can require professional treatment."],
root:["Root","The tooth’s anchor","The root sits below the gumline and helps hold the tooth in the jaw.","Healthy gums and bone support tooth roots."],
gums:["Gums","Protective supporting tissue","Gums form a seal around teeth and help protect deeper structures.","Gentle brushing and daily interdental cleaning support gum health."]
};
$$(".tooth-layer").forEach(b=>b.addEventListener("click",()=>{
  $$(".tooth-layer").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  const d=toothData[b.dataset.layer];$("#toothLabel").textContent=d[0];$("#toothTitle").textContent=d[1];$("#toothDescription").textContent=d[2];$("#toothTip").textContent=d[3];
}));

const drinks={
cola:["Cola, 12 oz",39,"🥤","Try sparkling water with fruit."],
sports:["Sports drink, 20 oz",34,"🏃","Choose water for routine hydration."],
energy:["Energy drink, 16 oz",54,"⚡","Try water and a balanced snack for energy."],
bubble:["Bubble tea, 16 oz",48,"🧋","Request less sugar and fewer toppings."],
juice:["Orange juice, 12 oz",31,"🍊","Choose a whole orange and water."],
chocolate:["Chocolate milk, 12 oz",30,"🥛","Try plain milk or a smaller serving."],
water:["Water",0,"💧","Water is already a tooth-friendly choice."]
};
function renderDrink(){const d=drinks[$("#drinkSelect").value],c=Math.round(d[1]/4);$("#drinkName").textContent=d[0];$("#drinkSugar").textContent=d[1]+" grams of sugar";$("#drinkEmoji").textContent=d[2];$("#drinkSwap").textContent=d[3];$("#cubeCount").textContent=c;$("#cubeVisual").innerHTML=c?Array(c).fill('<span class="cube"></span>').join(""):"No sugar cubes";}
$("#drinkSelect").addEventListener("change",renderDrink);renderDrink();

const foods={
apple:["🍎","Apple","friendly","Tooth-friendly choice","Crunchy texture and fiber can support a balanced diet, though apples still contain natural sugars."],
cheese:["🧀","Cheese","friendly","Tooth-friendly choice","Cheese is low in sugar and provides calcium and protein."],
water:["💧","Water","friendly","Tooth-friendly choice","Water helps rinse the mouth and does not contain sugar."],
soda:["🥤","Soda","limit","Limit frequency","Many sodas contain sugar and acid, which can increase enamel exposure."],
candy:["🍬","Candy","limit","Limit frequency","Sticky or frequently eaten candy can keep sugar in contact with teeth longer."],
juice:["🍊","Fruit juice","moderate","Enjoy thoughtfully","Juice contains natural sugars and may be acidic. Serving size and frequency matter."],
nuts:["🥜","Nuts","friendly","Tooth-friendly choice","Plain nuts are generally low in sugar and can be part of a balanced diet."],
chips:["🥔","Chips","moderate","Enjoy thoughtfully","Starchy foods can break down into sugars and may stick around teeth."]
};
$("#foodSuggestions").innerHTML=Object.keys(foods).map(k=>`<button class="suggestion" data-food="${k}">${foods[k][1]}</button>`).join("");
function showFood(key){const f=foods[key];if(!f)return;$("#foodResult").innerHTML=`<div class="food-result-icon">${f[0]}</div><div><span class="status ${f[2]}">${f[3]}</span><h3>${f[1]}</h3><p>${f[4]}</p></div>`;}
$$(".suggestion").forEach(b=>b.addEventListener("click",()=>showFood(b.dataset.food)));
$("#foodSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();const key=Object.keys(foods).find(k=>k.includes(q)||foods[k][1].toLowerCase().includes(q));if(key)showFood(key);});

const quiz=[
["Which habit helps clean between teeth?",["Flossing","Chewing gum only","Rinsing with soda","Skipping breakfast"],0],
["Which drink is generally most tooth-friendly?",["Cola","Water","Energy drink","Sweet tea"],1],
["What does fluoride toothpaste help strengthen?",["Enamel","Tongue color","Braces wires","Jaw muscles"],0],
["When should severe facial swelling be taken seriously?",["Only after one month","Promptly","Never","Only at bedtime"],1],
["How long is the brushing timer on SmartSmile?",["30 seconds","1 minute","2 minutes","5 minutes"],2]
];
let qi=0,quizScore=0,answered=false;
function renderQuiz(){answered=false;$("#quizStep").textContent=`Question ${qi+1} of ${quiz.length}`;$("#quizProgressBar").style.width=`${((qi+1)/quiz.length)*100}%`;$("#quizQuestion").textContent=quiz[qi][0];$("#quizAnswers").innerHTML=quiz[qi][1].map((a,i)=>`<button class="answer" data-i="${i}">${a}</button>`).join("");$("#quizFeedback").textContent="";$("#nextQuestion").classList.add("hidden");$$(".answer").forEach(b=>b.addEventListener("click",answerQuiz));}
function answerQuiz(e){if(answered)return;answered=true;const chosen=Number(e.currentTarget.dataset.i),correct=quiz[qi][2];$$(".answer").forEach((b,i)=>{if(i===correct)b.classList.add("correct");else if(i===chosen)b.classList.add("wrong");});if(chosen===correct){quizScore++;$("#quizFeedback").textContent="Correct!";}else $("#quizFeedback").textContent=`The correct answer is ${quiz[qi][1][correct]}.`;$("#nextQuestion").classList.remove("hidden");}
$("#nextQuestion").addEventListener("click",()=>{qi++;if(qi<quiz.length)renderQuiz();else{$("#quizStep").textContent="Quiz complete";$("#quizProgressBar").style.width="100%";$("#quizQuestion").textContent=`You scored ${quizScore} out of ${quiz.length}!`;$("#quizAnswers").innerHTML="";$("#quizFeedback").textContent="Great job exploring oral-health basics.";$("#nextQuestion").classList.add("hidden");localStorage.setItem("badgeQuiz","1");updateBadges();}});
renderQuiz();

let timer=120,timerId=null;
function updateTimer(){const m=Math.floor(timer/60),s=timer%60;$("#timerDisplay").textContent=`${m}:${String(s).padStart(2,"0")}`;$("#timerRing").style.background=`conic-gradient(var(--primary) ${(timer/120)*360}deg,var(--border) 0deg)`;}
$("#startTimer").addEventListener("click",()=>{if(timerId)return;$("#timerInstruction").textContent="Brush gently and reach every surface.";timerId=setInterval(()=>{timer--;updateTimer();if(timer<=0){clearInterval(timerId);timerId=null;$("#timerInstruction").textContent="Two minutes complete—great job!";}},1000);});
$("#resetTimer").addEventListener("click",()=>{clearInterval(timerId);timerId=null;timer=120;updateTimer();$("#timerInstruction").textContent="Press start when you begin brushing.";});updateTimer();

const answers=[
[["bleed","bleeding"],"Bleeding gums can be related to irritation or inflammation. Gentle brushing and consistent cleaning between teeth may help, but persistent bleeding should be checked by a dental professional."],
[["cavity","cavities"],"Cavities develop when acids produced by bacteria weaken enamel over time. Fluoride, good hygiene, water, and limiting frequent sugar exposure can help reduce risk."],
[["floss"],"Flossing helps clean spaces between teeth that toothbrush bristles may not reach. Use gentle motions rather than snapping floss into the gums."],
[["brush","brushing"],"A common recommendation is brushing twice daily for about two minutes with fluoride toothpaste and a soft-bristled toothbrush."],
[["braces"],"With braces, clean carefully around brackets and wires, use tools recommended by your orthodontist, and follow instructions about foods and appointments."],
[["sugar","soda","drink"],"Frequency matters. Repeated sugary or acidic drinks can expose enamel throughout the day. Water is a tooth-friendly alternative."],
[["pain","swelling","emergency"],"Severe pain, facial swelling, uncontrolled bleeding, breathing or swallowing difficulty, or significant injury should receive prompt professional attention."]
];
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();const q=$("#chatInput").value.trim();if(!q)return;addMessage(q,"user");const lower=q.toLowerCase();const match=answers.find(([keys])=>keys.some(k=>lower.includes(k)));const reply=match?match[1]:"I can help with general questions about brushing, flossing, cavities, braces, sugar, dental visits, pain, or swelling. For personal symptoms, contact a qualified dental professional.";setTimeout(()=>addMessage(reply+" This information is educational only.","bot"),350);$("#chatInput").value="";});
function addMessage(text,type){const d=document.createElement("div");d.className=`message ${type}`;d.textContent=text;$("#chatWindow").appendChild(d);$("#chatWindow").scrollTop=$("#chatWindow").scrollHeight;}
