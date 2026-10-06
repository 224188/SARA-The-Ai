// ==========================================
// SARA THE AI - Foundation v0.1
// Voice + Dashboard Controller
// ==========================================

const voiceButton = document.getElementById("voiceButton");
const voiceStatus = document.getElementById("voiceStatus");

const dashboardButton = document.getElementById("dashboardButton");
const dashboard = document.getElementById("dashboard");
const closeDashboard = document.getElementById("closeDashboard");


// ------------------------------------------
// DASHBOARD
// ------------------------------------------

function openDashboard() {
  dashboard.classList.remove("hidden");

  speak(
    "Sure Abbu. Opening your dashboard."
  );
}

function hideDashboard() {
  dashboard.classList.add("hidden");

  speak(
    "Dashboard closed."
  );
}

dashboardButton.addEventListener("click", openDashboard);
closeDashboard.addEventListener("click", hideDashboard);


// ------------------------------------------
// TEXT TO SPEECH
// ------------------------------------------

function speak(text) {

  if (!("speechSynthesis" in window)) {
    console.log("Speech synthesis is not supported.");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 0.95;
  speech.pitch = 1.05;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}


// ------------------------------------------
// VOICE RECOGNITION
// ------------------------------------------

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function () {

    voiceStatus.textContent =
      "SARA is listening...";

    voiceButton.style.transform =
      "scale(1.08)";
  };


  recognition.onresult = function (event) {

    const userSpeech =
      event.results[0][0].transcript
        .toLowerCase()
        .trim();

    console.log(
      "You said:",
      userSpeech
    );

    voiceStatus.textContent =
      "I heard: " + userSpeech;

    processCommand(userSpeech);
  };


  recognition.onerror = function (event) {

    console.log(
      "Voice error:",
      event.error
    );

    voiceStatus.textContent =
      "I couldn't hear you. Try again.";

    voiceButton.style.transform =
      "scale(1)";
  };


  recognition.onend = function () {

    voiceButton.style.transform =
      "scale(1)";
  };

}


// ------------------------------------------
// VOICE BUTTON
// ------------------------------------------

voiceButton.addEventListener(
  "click",
  function () {

    if (!recognition) {

      voiceStatus.textContent =
        "Voice recognition is not supported in this browser.";

      return;
    }

    try {

      recognition.start();

    } catch (error) {

      console.log(error);

    }

  }
);


// ------------------------------------------
// COMMAND SYSTEM
// ------------------------------------------

function processCommand(command) {

  // DASHBOARD

  if (
    command.includes("open dashboard") ||
    command.includes("show dashboard") ||
    command.includes("dashboard kholo") ||
    command.includes("dashboard open")
  ) {

    openDashboard();
    return;
  }


  // CLOSE DASHBOARD

  if (
    command.includes("close dashboard") ||
    command.includes("hide dashboard") ||
    command.includes("dashboard band")
  ) {

    hideDashboard();
    return;
  }


  // GREETING

  if (
    command.includes("hello sara") ||
    command.includes("hi sara") ||
    command.includes("hey sara")
  ) {

    speak(
      "Hello Abbu. I am SARA. How can I help you?"
    );

    return;
  }


  // TIME

  if (
    command.includes("what time") ||
    command.includes("time kya hai") ||
    command.includes("time batao")
  ) {

    const now = new Date();

    const time = now
