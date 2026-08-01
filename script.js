const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

menuButton.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const smileForm = document.getElementById("smileForm");
const scoreRing = document.querySelector(".score-ring");
const scoreNumber = document.getElementById("scoreNumber");
const scoreTitle = document.getElementById("scoreTitle");
const scoreMessage = document.getElementById("scoreMessage");
const recommendation = document.getElementById("recommendation");

smileForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(smileForm);

  const brush = Number(data.get("brush"));
  const floss = Number(data.get("floss"));
  const soda = Number(data.get("soda"));
  const snacks = Number(data.get("snacks"));
  const visit = Number(data.get("visit"));
  const tongue = Number(data.get("tongue"));

  const score = brush + floss + soda + snacks + visit + tongue;
  const care = Math.round(((brush + floss + tongue) / 48) * 100);
  const nutrition = Math.round(((soda + snacks) / 35) * 100);
  const prevention = Math.round((visit / 17) * 100);

  scoreNumber.textContent = score;
  scoreRing.style.background = `conic-gradient(#0f9f9a ${score * 3.6}deg, #e5eef6 0deg)`;
  document.getElementById("careBar").style.width = `${care}%`;
  document.getElementById("nutritionBar").style.width = `${nutrition}%`;
  document.getElementById("preventionBar").style.width = `${prevention}%`;

  if (score >= 85) {
    scoreTitle.textContent = "Strong smile habits!";
    scoreMessage.textContent = "You are practicing many habits that support oral health.";
  } else if (score >= 65) {
    scoreTitle.textContent = "A solid start";
    scoreMessage.textContent = "A few consistent improvements could strengthen your routine.";
  } else {
    scoreTitle.textContent = "Time to build your routine";
    scoreMessage.textContent = "Small, realistic changes can make your daily care more consistent.";
  }

  const suggestions = [];
  if (brush < 20) suggestions.push("brush twice daily with fluoride toothpaste");
  if (floss < 18) suggestions.push("floss at least once each day");
  if (soda < 18 || snacks < 17) suggestions.push("reduce how often your teeth are exposed to sugary foods and drinks");
  if (visit < 17) suggestions.push("schedule a routine dental checkup when possible");
  if (tongue < 10) suggestions.push("gently clean your tongue as part of your routine");

  recommendation.innerHTML = suggestions.length
    ? `<strong>Your weekly goal:</strong> Try to ${suggestions[0]}.`
    : "<strong>Your weekly goal:</strong> Keep your routine consistent and continue learning.";

  localStorage.setItem("smileSmartScore", String(score));
});

const savedScore = localStorage.getItem("smileSmartScore");
if (savedScore) {
  scoreNumber.textContent = savedScore;
  scoreTitle.textContent = "Your saved score";
  scoreMessage.textContent = "Retake the Smile Check whenever your habits change.";
  scoreRing.style.background = `conic-gradient(#0f9f9a ${Number(savedScore) * 3.6}deg, #e5eef6 0deg)`;
}

const toothInfo = {
  enamel: {
    label: "Enamel",
    title: "Your tooth’s protective outer layer",
    description: "Enamel is the hard surface covering the visible part of a tooth. It protects the more sensitive layers beneath it.",
    tip: "Tip: Fluoride toothpaste helps strengthen enamel."
  },
  dentin: {
    label: "Dentin",
    title: "The layer beneath enamel",
    description: "Dentin is softer than enamel and contains tiny channels that can transmit sensitivity toward the center of the tooth.",
    tip: "Tip: Protecting enamel also helps keep dentin covered."
  },
  pulp: {
    label: "Pulp",
    title: "The living center of the tooth",
    description: "The pulp contains nerves, connective tissue, and blood vessels that support the tooth while it develops.",
    tip: "Tip: Deep decay that reaches the pulp can require professional treatment."
  },
  root: {
    label: "Root",
    title: "The anchor below the gumline",
    description: "A tooth’s root sits in the jawbone and helps hold the tooth securely in place.",
    tip: "Tip: Healthy gums and bone help support tooth roots."
  },
  gums: {
    label: "Gums",
    title: "Protective tissue around your teeth",
    description: "Gums form a seal around the teeth and protect deeper supporting structures from bacteria.",
    tip: "Tip: Daily brushing and flossing help reduce plaque near the gumline."
  }
};

document.querySelectorAll(".tooth-part").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tooth-part").forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const info = toothInfo[button.dataset.part];
    document.getElementById("partLabel").textContent = info.label;
    document.getElementById("partTitle").textContent = info.title;
    document.getElementById("partDescription").textContent = info.description;
    document.getElementById("partTip").textContent = info.tip;
  });
});

const drinkData = {
  cola: { name: "Cola, 12 oz", sugar: 39, emoji: "🥤", swap: "Try sparkling water with fruit." },
  sports: { name: "Sports drink, 20 oz", sugar: 34, emoji: "🏃", swap: "Choose water for routine hydration." },
  energy: { name: "Energy drink, 16 oz", sugar: 54, emoji: "⚡", swap: "Try water and a balanced snack for energy." },
  bubble: { name: "Bubble tea, 16 oz", sugar: 48, emoji: "🧋", swap: "Request less sugar and fewer toppings." },
  juice: { name: "Orange juice, 12 oz", sugar: 31, emoji: "🍊", swap: "Choose a whole orange and water." },
  chocolate: { name: "Chocolate milk, 12 oz", sugar: 30, emoji: "🥛", swap: "Try plain milk or a smaller serving." },
  water: { name: "Water", sugar: 0, emoji: "💧", swap: "Water is already a tooth-friendly choice." }
};

const drinkSelect = document.getElementById("drinkSelect");
const cubeVisual = document.getElementById("cubeVisual");

function renderDrink() {
  const drink = drinkData[drinkSelect.value];
  const cubeCount = Math.round(drink.sugar / 4);

  document.getElementById("drinkName").textContent = drink.name;
  document.getElementById("drinkSugar").textContent = `${drink.sugar} grams of sugar`;
  document.getElementById("drinkEmoji").textContent = drink.emoji;
  document.getElementById("cubeCount").textContent = cubeCount;
  document.getElementById("drinkSwap").textContent = drink.swap;

  cubeVisual.innerHTML = "";
  for (let i = 0; i < cubeCount; i++) {
    const cube = document.createElement("span");
    cube.className = "cube";
    cubeVisual.appendChild(cube);
  }
  if (cubeCount === 0) cubeVisual.textContent = "No sugar cubes";
}

drinkSelect.addEventListener("change", renderDrink);
renderDrink();

document.querySelectorAll(".flip-card").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});
