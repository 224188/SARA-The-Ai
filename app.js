// ========================================
// SARA THE AI — FIXED APP.JS
// ========================================

const WORKER_URL = "https://sara-the-ai.sahila95341.workers.dev/";

const assistantText = document.getElementById("assistantText");
const greeting = document.getElementById("greeting");
const voiceButton = document.getElementById("voiceButton");
const voiceStatus = document.getElementById("voiceStatus");
const dashboard = document.getElementById("dashboard");
const dashboardButton = document.getElementById("dashboardButton");
const closeDashboard = document.getElementById("closeDashboard");
const statusText = document.getElementById("statusText");

let recognition = null;
let handsFree = false;
let listening = false;
let speaking = false;
let thinking = false;

function setStatus(message) {
  if (voiceStatus) voiceStatus.textContent = message;
  if (statusText) statusText.textContent = message;
}

function setText(message) {
  if (assistantText) assistantText.textContent = message;
}

function speak(message) {
  setText(message);

  if (!("speechSynthesis" in window)) {
    setStatus("Voice support available nahi hai");
    return;
  }

  window.speechSynthesis.cancel();
  speaking = true;

  if (recognition && listening) {
    try {
      recognition.stop();
    } catch (e) {}
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.15;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v =>
    /female|zira|samantha|heera/i.test(v.name)
  );

  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onend = () => {
    speaking = false;
    setStatus(handsFree ? "Boss, main sun rahi hoon 🎙️" : "Tap to talk");
    restartListening();
  };

  utterance.onerror = () => {
    speaking = false;
    restartListening();
  };

  window.speechSynthesis.speak(utterance);
}

function openDashboard() {
  if (dashboard) {
    dashboard.classList.remove("hidden");
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    speak("Dashboard khol diya, Boss.");
  }
}

function hideDashboard() {
  if (dashboard) {
    dashboard.classList.add("hidden");
    speak("Dashboard band kar diya, Boss.");
  }
}

if (dashboardButton) {
  dashboardButton.addEventListener("click", openDashboard);
}

if (closeDashboard) {
  closeDashboard.addEventListener("click", hideDashboard);
}

function setupRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setStatus("Boss, Chrome browser mein kholkar try karein.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    setStatus("Sun rahi hoon, Boss...");
  };

  recognition.onresult = async event => {
    const message =
      event.results[event.results.length - 1][0].transcript.trim();

    if (message) await handleCommand(message);
  };

  recognition.onerror = event => {
    listening = false;

    if (event.error === "not-allowed") {
      handsFree = false;
      setStatus("Microphone permission allow karein, Boss.");
    }
  };

  recognition.onend = () => {
    listening = false;
    restartListening();
  };
}

function startListening() {
  if (!recognition || !handsFree || listening || speaking || thinking) {
    return;
  }
