// ========================================
// SARA THE AI — Voice Assistant
// ========================================

const assistantText = document.getElementById("assistantText");
const voiceButton = document.getElementById("voiceButton");
const voiceStatus = document.getElementById("voiceStatus");

const dashboard = document.getElementById("dashboard");
const dashboardButton = document.getElementById("dashboardButton");
const closeDashboard = document.getElementById("closeDashboard");


// ========================================
// SARA SPEAK — Female Voice
// ========================================

let saraVoices = [];

function loadSaraVoices() {
    saraVoices = window.speechSynthesis.getVoices();
}

loadSaraVoices();

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadSaraVoices;
}


function saraSpeak(message) {

    if (!("speechSynthesis" in window)) {
        console.log("Speech synthesis is not supported.");
        return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    // Indian English
    speech.lang = "en-IN";

    // Voice settings
    speech.rate = 0.95;
    speech.pitch = 1.15;
    speech.volume = 1.0;


    // Try to find a female English voice
    const femaleVoice = saraVoices.find(voice =>
        /female|zira|samantha|google.*female|english.*female/i
        .test(voice.name)
    );


    // If female voice isn't found,
    // use any Indian/English voice available
    const englishVoice = saraVoices.find(voice =>
        /^en[-_]/i.test(voice.lang)
    );


    if (femaleVoice) {
        speech.voice = femaleVoice;
    } else if (englishVoice) {
        speech.voice = englishVoice;
    }


    window.speechSynthesis.speak(speech);
}


// ========================================
// DASHBOARD OPEN
// ========================================

function openDashboard() {

    if (dashboard) {
        dashboard.classList.remove("hidden");

        if (assistantText) {
            assistantText.textContent =
                "Yes Boss, opening your dashboard.";
        }

        saraSpeak(
            "Yes Boss, opening your dashboard."
        );

        dashboard.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ========================================
// DASHBOARD CLOSE
// ========================================

function closeDashboardPanel() {

    if (dashboard) {
        dashboard.classList.add("hidden");

        if (assistantText) {
            assistantText.textContent =
                "Okay Boss, dashboard closed.";
        }

        saraSpeak(
            "Okay Boss, closing your dashboard."
        );
    }
}


// ========================================
// DASHBOARD BUTTON
// ========================================

if (dashboardButton) {

    dashboardButton.addEventListener("click", () => {
        openDashboard();
    });

}


// ========================================
// CLOSE DASHBOARD BUTTON
// ========================================

if (closeDashboard) {

    closeDashboard.addEventListener("click", () => {
        closeDashboardPanel();
    });

}


// ========================================
// VOICE RECOGNITION
// ========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    // ====================================
    // VOICE BUTTON
    // ====================================

    if (voiceButton) {

        voiceButton.addEventListener("click", () => {

            try {

                recognition.start();

                if (voiceStatus) {
                    voiceStatus.textContent =
                        "Listening...";
                }

                if (assistantText) {
                    assistantText.textContent =
                        "I'm listening, Boss...";
                }

            } catch (error) {

                console.log(error);

            }

        });

    }


    // ====================================
    // WHEN SARA HEARS YOU
    // ====================================

    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript
            .toLowerCase()
            .trim();


        console.log("You said:", transcript);


        if (assistantText) {
            assistantText.textContent =
                "You said: " + transcript;
        }


        // =================================
        // OPEN DASHBOARD COMMANDS
        // =================================

        if (
            transcript.includes("open dashboard") ||
            transcript.includes("dashboard open") ||
            transcript.includes("dashboard kholo") ||
            transcript.includes("dashboard khol") ||
            transcript.includes("dashboard खोलो")
        ) {

            openDashboard();

        }


        // =================================
        // CLOSE DASHBOARD COMMANDS
        // =================================

        else if (
            transcript.includes("close dashboard") ||
            transcript.includes("dashboard close") ||
            transcript.includes("dashboard band") ||
            transcript.includes("dashboard बंद")
        ) {

            closeDashboardPanel();

        }


        // =================================
        // HELLO COMMAND
        // =================================

        else if (
            transcript.includes("hello sara") ||
            transcript.includes("hi sara") ||
            transcript === "hello" ||
            transcript === "hi" ||
            transcript === "sara"
        ) {

            const response =
                "Hello Boss, I'm listening.";

            if (assistantText) {
                assistantText.textContent =
                    response;
            }

            saraSpeak(response);

        }


        // =================================
        // WHO ARE YOU
        // =================================

        else if (
            transcript.includes("who are you") ||
            transcript.includes("what are you")
        ) {

            const response =
                "I'm SARA THE AI, your personal AI assistant, Boss.";

            if (assistantText) {
                assistantText.textContent =
                    response;
            }

            saraSpeak(response);

        }


        // =================================
        // HOW ARE YOU
        // =================================

        else if (
            transcript.includes("how are you") ||
            transcript.includes("kaisi ho sara") ||
            transcript.includes("kaise ho sara")
        ) {

            const response =
                "I'm great, Boss. I'm ready to help you.";

            if (assistantText) {
                assistantText.textContent =
                    response;
            }

            saraSpeak(response);

        }


        // =================================
        // THANK YOU
        // =================================

        else if (
            transcript.includes("thank you") ||
            transcript.includes("thanks")
        ) {

            const response =
                "You're welcome, Boss.";

            if (assistantText) {
                assistantText.textContent =
                    response;
            }

            saraSpeak(response);

        }


        // =================================
        // UNKNOWN COMMAND
        // =================================

        else {

            const response =
                "I heard you, Boss.";

            if (assistantText) {
                assistantText.textContent =
                    response;
            }

            saraSpeak(response);

        }

    };


    // ====================================
    // VOICE ENDED
    // ====================================

    recognition.onend = function() {

        if (voiceStatus) {
            voiceStatus.textContent =
                "Tap to talk";
        }

    };


    // ====================================
    // VOICE ERROR
    // ====================================

    recognition.onerror = function(event) {

        console.log(
            "Voice error:",
            event.error
        );


        if (voiceStatus) {
            voiceStatus.textContent =
                "Tap to talk";
        }


        if (event.error === "not-allowed") {

            if (assistantText) {
                assistantText.textContent =
                    "Boss, please allow microphone permission.";
            }

        }

        else if (event.error === "no-speech") {

            if (assistantText) {
                assistantText.textContent =
                    "I didn't hear anything, Boss.";
            }

            saraSpeak(
                "I didn't hear anything, Boss."
            );

        }

    };

}


// ========================================
// BROWSER DOES NOT SUPPORT VOICE
// ========================================

else {

    if (voiceStatus) {
        voiceStatus.textContent =
            "Voice not supported";
    }


    if (voiceButton) {
        voiceButton.disabled = true;
    }

}


// ========================================
// SARA STARTUP
// ========================================

window.addEventListener("load", () => {

    console.log("SARA THE AI is ready.");

    if (assistantText) {
        assistantText.textContent =
            "Hello Boss, I'm SARA. I'm ready.";
    }

});
