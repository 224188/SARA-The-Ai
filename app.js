const WORKER_URL = "https://sara-the-ai.sahila95341.workers.dev/";

let handsFreeEnabled = false;
let isThinking = false;
let isSpeaking = false;
let recognition = null;

const voiceButton = document.querySelector("#voiceButton");
const statusElement = document.querySelector("#status");
const outputElement = document.querySelector("#output");

function showStatus(message) {
  if (statusElement) statusElement.textContent = message;
}

function showOutput(message) {
  if (outputElement) outputElement.textContent = message;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    showOutput(text);
    return;
  }

  isSpeaking = true;

  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {}
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 1;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    voice =>
      /female|zira|samantha|heera|google हिन्दी|google hindi/i.test(voice.name)
  );

  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onend = () => {
    isSpeaking = false;
    showStatus(handsFreeEnabled ? "Boss, main sun rahi hoon." : "Ready");
    restartListening();
  };

  utterance.onerror = () => {
    isSpeaking = false;
    restartListening();
  };

  showOutput(text);
  window.speechSynthesis.speak(utterance);
}

function setupRecognition() {
  const SpeechRecognition =
