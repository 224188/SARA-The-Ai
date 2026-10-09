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

  try {
    recognition.start();
  } catch (e) {}
}

function restartListening() {
  if (handsFree && !speaking && !thinking) {
    setTimeout(startListening, 800);
  }
}

async function askAI(message) {
  thinking = true;
  setStatus("SARA soch rahi hai, Boss...");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    if (!data.reply) {
      throw new Error("Reply nahi mila");
    }

    thinking = false;
    speak(data.reply);
  } catch (error) {
    console.error("SARA error:", error);
    thinking = false;
    speak("Boss, AI connection mein dikkat hai. Internet aur Worker check karein.");
  }
}

async function handleCommand(originalMessage) {
  const message = originalMessage.toLowerCase().trim();

  if (
    message.includes("open dashboard") ||
    message.includes("dashboard kholo") ||
    message.includes("डैशबोर्ड खोलो")
  ) {
    openDashboard();
    return;
  }

  if (
    message.includes("close dashboard") ||
    message.includes("dashboard band") ||
    message.includes("डैशबोर्ड बंद")
  ) {
    hideDashboard();
    return;
  }

  if (
    message.includes("who are you") ||
    message.includes("tum kaun ho")
  ) {
    speak("Boss, main SARA THE AI hoon, aapki personal AI assistant.");
    return;
  }

  if (
    message === "hello" ||
    message === "hi" ||
    message.includes("hello sara")
  ) {
    speak("Hello Boss! Bataiye, main aapki kya madad kar sakti hoon?");
    return;
  }

  if (
    message.includes("stop listening") ||
    message.includes("sunna band karo")
  ) {
    handsFree = false;
    speak("Theek hai Boss, main sunna band kar rahi hoon.");
    return;
  }

  await askAI(originalMessage);
}

if (voiceButton) {
  voiceButton.addEventListener("click", () => {
    if (!recognition) setupRecognition();
    if (!recognition) return;

    handsFree = true;
    startListening();
  });
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

setupRecognition();

setStatus("Ready, Boss. Microphone dabayein.");
setText("I'm SARA, your personal AI assistant.");
