import { challenges } from "./challenges.mjs";
import { availableDay, parseChallenge, readProgress, TOTAL_DAYS, utcDate } from "./core.mjs";

const $ = selector => document.querySelector(selector);
const welcome = $("#welcome");
const experience = $("#experience");
const status = $("#status");
const canvas = $("#scratch-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const card = $("#scratch-card");
const content = $("#challenge-content");
const hint = $("#scratch-hint");
const revealButton = $("#reveal-button");
const calendar = $("#calendar");
const lastChallengeKey = "mariposa:last-challenge";

let challenge = null;
let selectedDay = 1;
let revealed = [];
let unlocked = 0;
let dragging = false;
let lastPoint = null;
let previousSample = 0;
let resizeTimer;

function showStatus(message) {
  status.textContent = message;
}

function getStored(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    showStatus("No se puede acceder al almacenamiento de este navegador. El progreso no se guardará.");
    return null;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    showStatus("No se pudo guardar el progreso en este dispositivo. Revisa el almacenamiento del navegador.");
    return false;
  }
}

function progressKey() {
  return `mariposa:${challenge.id}:${challenge.start}`;
}

function createChallenge() {
  if (!globalThis.crypto?.getRandomValues) {
    showStatus("No se pudo crear un enlace seguro en este navegador.");
    return;
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const id = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  const start = utcDate();
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("inicio", start);
  url.searchParams.set("pareja", id);
  history.replaceState(null, "", url);
  openChallenge({ start, id });
}

function openChallenge(nextChallenge) {
  challenge = nextChallenge;
  unlocked = availableDay(challenge.start);
  selectedDay = unlocked;
  try {
    revealed = readProgress(getStored(progressKey()), unlocked);
  } catch {
    revealed = [];
    showStatus("No se pudo leer el progreso guardado. Puedes continuar, pero revisa los datos de este navegador.");
  }
  setStored(lastChallengeKey, location.href);
  welcome.hidden = true;
  experience.hidden = false;
  $("#share-link").value = location.href;
  render();
}

function renderCalendar() {
  calendar.replaceChildren();
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const button = document.createElement("button");
    const isLocked = day > unlocked;
    button.type = "button";
    button.className = "calendar-day";
    button.disabled = isLocked;
    if (day === selectedDay) button.classList.add("selected");
    if (revealed.includes(day)) button.classList.add("revealed");
    button.setAttribute("aria-label", `Día ${day}${isLocked ? ", bloqueado" : revealed.includes(day) ? ", revelado" : ", disponible"}`);
    if (day === selectedDay) button.setAttribute("aria-current", "date");
    const number = document.createElement("span");
    number.textContent = String(day).padStart(2, "0");
    button.append(number);
    if (isLocked) {
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("aria-hidden", "true");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#lock");
      icon.append(use);
      button.append(icon);
    }
    button.addEventListener("click", () => {
      selectedDay = day;
      render();
    });
    calendar.append(button);
  }
  $("#progress-label").textContent = `${revealed.length} de ${TOTAL_DAYS} descubiertos`;
}

function drawCover(preserve = false) {
  if (!context || revealed.includes(selectedDay)) return;
  const rect = card.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  let previous;
  if (preserve && canvas.width && canvas.height) {
    previous = document.createElement("canvas");
    previous.width = canvas.width;
    previous.height = canvas.height;
    previous.getContext("2d").drawImage(canvas, 0, 0);
  }
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  if (previous) {
    context.drawImage(previous, 0, 0, rect.width, rect.height);
    return;
  }
  const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#e7a5aa");
  gradient.addColorStop(0.45, "#f5c7c2");
  gradient.addColorStop(1, "#d9949e");
  context.fillStyle = gradient;
  context.fillRect(0, 0, rect.width, rect.height);
  context.strokeStyle = "rgba(255,255,255,.13)";
  context.lineWidth = 1;
  for (let x = -rect.height; x < rect.width; x += 16) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + rect.height, rect.height);
    context.stroke();
  }
}

function render() {
  renderCalendar();
  const isRevealed = revealed.includes(selectedDay);
  $("#day-heading").textContent = `Día ${String(selectedDay).padStart(2, "0")}`;
  $("#challenge-text").textContent = challenges[selectedDay - 1];
  $("#day-description").textContent = isRevealed ? "Un pequeño gesto para hacer juntos." : "Raspa con el dedo y descubre qué les espera.";
  content.setAttribute("aria-hidden", String(!isRevealed));
  canvas.hidden = isRevealed;
  hint.hidden = isRevealed;
  hint.classList.remove("scratching");
  revealButton.hidden = isRevealed;
  $("#revealed-message").hidden = !isRevealed;
  card.classList.toggle("is-revealed", isRevealed);
  if (!isRevealed) {
    if (!context) {
      canvas.hidden = true;
      hint.hidden = true;
      showStatus("El raspado no está disponible en este navegador. Usa «Revelar sin raspar».");
    } else {
      drawCover();
    }
  }
}

function reveal() {
  if (revealed.includes(selectedDay)) return;
  revealed.push(selectedDay);
  revealed.sort((a, b) => a - b);
  const saved = setStored(progressKey(), JSON.stringify(revealed));
  render();
  content.focus({ preventScroll: true });
  if (saved) showStatus(`Reto del día ${selectedDay} revelado.`);
}

function pointFor(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function scratch(point) {
  context.save();
  context.globalCompositeOperation = "destination-out";
  context.strokeStyle = "#000";
  context.lineWidth = 46;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(lastPoint?.x ?? point.x, lastPoint?.y ?? point.y);
  context.lineTo(point.x + 0.01, point.y + 0.01);
  context.stroke();
  context.restore();
  lastPoint = point;
}

function checkScratchProgress() {
  if (!context || canvas.hidden) return;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let clear = 0;
  let total = 0;
  for (let index = 3; index < pixels.length; index += 64) {
    if (pixels[index] < 128) clear++;
    total++;
  }
  if (total && clear / total >= 0.5) reveal();
}

canvas.addEventListener("pointerdown", event => {
  if (!context || event.button !== 0) return;
  event.preventDefault();
  dragging = true;
  lastPoint = null;
  canvas.setPointerCapture(event.pointerId);
  hint.classList.add("scratching");
  scratch(pointFor(event));
});

canvas.addEventListener("pointermove", event => {
  if (!dragging || !context) return;
  scratch(pointFor(event));
  if (performance.now() - previousSample > 300) {
    previousSample = performance.now();
    checkScratchProgress();
  }
});

function stopScratch() {
  if (!dragging) return;
  dragging = false;
  lastPoint = null;
  checkScratchProgress();
}
canvas.addEventListener("pointerup", stopScratch);
canvas.addEventListener("pointercancel", stopScratch);
canvas.addEventListener("lostpointercapture", stopScratch);
revealButton.addEventListener("click", reveal);
$("#start-button").addEventListener("click", createChallenge);
$("#resume-button").addEventListener("click", () => {
  const previous = getStored(lastChallengeKey);
  if (previous) location.href = previous;
  else showStatus("No se encontró un reto guardado en este dispositivo.");
});
$("#copy-button").addEventListener("click", async () => {
  const input = $("#share-link");
  try {
    if (!navigator.clipboard) throw new Error("Portapapeles no disponible");
    await navigator.clipboard.writeText(input.value);
    showStatus("Enlace copiado. ¡Compártelo con tu persona favorita!");
  } catch {
    input.focus();
    input.select();
    showStatus("No se pudo copiar automáticamente. Selecciona y copia el enlace manualmente.");
  }
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => drawCover(true), 150);
});
setInterval(() => {
  if (!challenge) return;
  const current = availableDay(challenge.start);
  if (current !== unlocked && current > 0) {
    const wasLatest = selectedDay === unlocked;
    unlocked = current;
    if (wasLatest) selectedDay = current;
    if (selectedDay > current) selectedDay = current;
    render();
  }
}, 30_000);

try {
  const linkedChallenge = parseChallenge(new URL(location.href));
  if (linkedChallenge) {
    openChallenge(linkedChallenge);
  } else if (getStored(lastChallengeKey)) {
    $("#resume-button").hidden = false;
  }
} catch (error) {
  showStatus(error instanceof Error ? error.message : "No se pudo abrir el enlace del reto.");
}
