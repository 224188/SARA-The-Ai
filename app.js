// ========================================
// SARA THE AI
// Voice Assistant
// ========================================


// ----------------------------------------
// ELEMENTS
// ----------------------------------------

const assistantText = document.getElementById("assistantText");
const greeting = document.getElementById("greeting");

const voiceButton = document.getElementById("voiceButton");
const voiceStatus = document.getElementById("voiceStatus");

const dashboard = document.getElementById("dashboard");
const dashboardButton = document.getElementById("dashboardButton");
const closeDashboard = document.getElementById("closeDashboard");


// ----------------------------------------
// SARA SPEECH
// ----------------------------------------

let saraVoices = [];

function loadVoices() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    saraVoices = window.speechSynthesis.getVoices();

    console.log("Available voices:", saraVoices);
}

loadVoices();

if ("speechSynthesis" in window) {

    window.speechSynthesis.onvoiceschanged = function () {
        loadVoices();
    };

}


function saraSpeak(message) {

    if (!("speechSynthesis" in window)) {

        console.log(
            "Speech synthesis is not supported."
        );

        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(message);


    speech.lang = "en-IN";

    speech.rate = 0.95;

    speech.pitch = 1.15;

    speech.volume = 1;


    // Prefer female English voices
    const femaleVoice =
        saraVoices.find(function (voice) {

            return (
                /female/i.test(voice.name) ||
                /zira/i.test(voice.name) ||
                /samantha/i.test(voice.name) ||
                /google.*female/i.test(voice.name)
            );

        });


    // Otherwise use Indian English
    const indianVoice =
        saraVoices.find(function (voice) {

            return (
                voice.lang &&
                voice.lang.toLowerCase() === "en-in"
            );

        });


    // Otherwise any English voice
    const englishVoice =
        saraVoices.find(function (voice) {

            return (
                voice.lang &&
                voice.lang.toLowerCase().startsWith("en")
            );

        });


    if (femaleVoice) {

        speech.voice = femaleVoice;

    } else if (indianVoice) {

        speech.voice = indianVoice;

    } else if (englishVoice) {

        speech.voice = englishVoice;

    }


    window.speechSynthesis.speak(speech);
}


// ----------------------------------------
// TEXT UPDATE
// ----------------------------------------

function showMessage(message) {

    if (assistantText) {
        assistantText.textContent = message;
    }

}


// ----------------------------------------
// OPEN DASHBOARD
// ----------------------------------------

function openDashboard() {

    if (!dashboard) {
        return;
    }


    dashboard.classList.remove("hidden");


    const message =
        "Yes Boss, opening your dashboard.";


    showMessage(message);


    saraSpeak(message);


    dashboard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ----------------------------------------
// CLOSE DASHBOARD
// ----------------------------------------

function closeDashboardPanel() {

    if (!dashboard) {
        return;
    }


    dashboard.classList.add("hidden");


    const message =
        "Okay Boss, closing your dashboard.";


    showMessage(message);


    saraSpeak(message);

}


// ----------------------------------------
// DASHBOARD BUTTON
// ----------------------------------------

if (dashboardButton) {

    dashboardButton.addEventListener(
        "click",
        function () {

            openDashboard();

        }
    );

}


// ----------------------------------------
// CLOSE BUTTON
// ----------------------------------------

if (closeDashboard) {

    closeDashboard.addEventListener(
        "click",
        function () {

            closeDashboardPanel();

        }
    );

}


// ========================================
// SPEECH RECOGNITION
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


    // ------------------------------------
    // VOICE BUTTON
    // ------------------------------------

    voiceButton.addEventListener(
        "click",
        function () {

            try {

                recognition.start();


                voiceButton.classList.add(
                    "listening"
                );


                voiceStatus.textContent =
                    "Listening...";


                showMessage(
                    "I'm listening, Boss..."
                );


            } catch (error) {

                console.log(
                    "Recognition start error:",
                    error
                );

            }

        }
    );


    // ------------------------------------
    // RESULT
    // ------------------------------------

    recognition.onresult =
        function (event) {

            const transcript =
                event.results[0][0].transcript
                .trim()
                .toLowerCase();


            console.log(
                "You said:",
                transcript
            );


            // ----------------------------
            // OPEN DASHBOARD
            // ----------------------------

            if (
                transcript.includes(
                    "open dashboard"
                ) ||

                transcript.includes(
                    "dashboard open"
                ) ||

                transcript.includes(
                    "dashboard kholo"
                ) ||

                transcript.includes(
                    "dashboard khol"
                )
            ) {

                openDashboard();

                return;
            }


            // ----------------------------
            // CLOSE DASHBOARD
            // ----------------------------

            if (
                transcript.includes(
                    "close dashboard"
                ) ||

                transcript.includes(
                    "dashboard close"
                ) ||

                transcript.includes(
                    "dashboard band"
                )
            ) {

                closeDashboardPanel();

                return;
            }


            // ----------------------------
            // HELLO
            // ----------------------------

            if (
                transcript.includes(
                    "hello sara"
                ) ||

                transcript.includes(
                    "hi sara"
                ) ||

                transcript === "hello" ||

                transcript === "hi" ||

                transcript === "sara"
            ) {

                const message =
                    "Hello Boss, I'm listening.";


                showMessage(message);


                saraSpeak(message);


                return;
            }


            // ----------------------------
            // WHO ARE YOU
            // ----------------------------

            if (
                transcript.includes(
                    "who are you"
                ) ||

                transcript.includes(
                    "what are you"
                )
            ) {

                const message =
                    "I'm SARA THE AI, your personal AI assistant, Boss.";


                showMessage(message);


                saraSpeak(message);


                return;
            }


            // ----------------------------
            // HOW ARE YOU
            // ----------------------------

            if (
                transcript.includes(
                    "how are you"
                ) ||

                transcript.includes(
                    "kaisi ho sara"
                ) ||

                transcript.includes(
                    "kaise ho sara"
                )
            ) {

                const message =
                    "I'm great, Boss. I'm ready to help you.";


                showMessage(message);


                saraSpeak(message);


                return;
            }


            // ----------------------------
            // THANK YOU
            // ----------------------------

            if (
                transcript.includes(
                    "thank you"
                ) ||

                transcript.includes(
                    "thanks"
                )
            ) {

                const message =
                    "You're welcome, Boss.";


                showMessage(message);


                saraSpeak(message);


                return;
            }


            // ----------------------------
            // UNKNOWN COMMAND
            // ----------------------------

            const message =
                "I heard you, Boss.";


            showMessage(message);


            saraSpeak(message);

        };


    // ------------------------------------
    // RECOGNITION START
    // ------------------------------------

    recognition.onstart =
        function () {

            console.log(
                "SARA microphone started."
            );


            voiceButton.classList.add(
                "listening"
            );


            voiceStatus.textContent =
                "Listening...";

        };


    // ------------------------------------
    // RECOGNITION END
    // ------------------------------------

    recognition.onend =
        function () {

            console.log(
                "SARA microphone stopped."
            );


            voiceButton.classList.remove(
                "listening"
            );


            voiceStatus.textContent =
                "Tap to talk";

        };


    // ------------------------------------
    // ERROR
    // ------------------------------------

    recognition.onerror =
        function (event) {

            console.log(
                "Microphone error:",
                event.error
            );


            voiceButton.classList.remove(
                "listening"
            );


            voiceStatus.textContent =
                "Tap to talk";


            if (
                event.error ===
                "not-allowed"
            ) {

                showMessage(
                    "Boss, microphone permission is blocked."
                );


                return;
            }


            if (
                event.error ===
                "no-speech"
            ) {

                showMessage(
                    "I didn't hear you, Boss."
                );


                saraSpeak(
                    "I didn't hear you, Boss."
                );


                return;
            }


            showMessage(
                "Boss, something went wrong with the microphone."
            );

        };


// ========================================
// VOICE NOT SUPPORTED
// ========================================

} else {

    console.log(
        "Speech recognition is not supported."
    );


    voiceStatus.textContent =
        "Voice not supported";


    showMessage(
        "Boss, voice recognition is not supported in this browser."
    );

}


// ========================================
// STARTUP
// ========================================

window.addEventListener(
    "load",
    function () {

        if (greeting) {
            greeting.textContent =
                "Hello Boss";
        }


        showMessage(
            "I'm SARA, your personal AI assistant."
        );


        console.log(
            "SARA THE AI is ready."
        );

    }
);
