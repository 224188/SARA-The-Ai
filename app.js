/* ==========================================
   SARA THE AI
   MAIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  console.log("SARA THE AI started");


  /* =========================
     GET ELEMENTS
  ========================= */

  const dashboardButton =
    document.getElementById("dashboardButton");

  const dashboard =
    document.getElementById("dashboard");

  const closeDashboard =
    document.getElementById("closeDashboard");

  const voiceButton =
    document.getElementById("voiceButton");

  const voiceStatus =
    document.getElementById("voiceStatus");

  const assistantText =
    document.getElementById("assistantText");

  const statusText =
    document.getElementById("statusText");


  /* =========================
     OPEN DASHBOARD
  ========================= */

  dashboardButton.onclick = function () {

    console.log("Opening dashboard");

    dashboard.classList.remove("hidden");

    assistantText.textContent =
      "Dashboard opened successfully.";

    setTimeout(function () {

      dashboard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);

  };


  /* =========================
     CLOSE DASHBOARD
  ========================= */

  closeDashboard.onclick = function () {

    console.log("Closing dashboard");

    dashboard.classList.add("hidden");

    assistantText.textContent =
      "I'm SARA, your personal AI assistant.";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  /* =========================
     VOICE RECOGNITION
  ========================= */

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!SpeechRecognition) {

    console.log(
      "Speech recognition is not supported."
    );

    voiceStatus.textContent =
      "Voice not supported in this browser";

  }

  else {

    const recognition =
      new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    /* =====================
       VOICE BUTTON
    ===================== */

    voiceButton.onclick = function () {

      try {

        recognition.start();

        voiceButton.classList.add(
          "listening"
        );

        voiceStatus.textContent =
          "Listening...";

        statusText.textContent =
          "Listening";

      }

      catch (error) {

        console.log(
          "Voice start error:",
          error
        );

      }

    };


    /* =====================
       SPEECH RESULT
    ===================== */

    recognition.onresult =
      function (event) {

        const text =
          event.results[0][0].transcript
          .toLowerCase()
          .trim();


        console.log(
          "SARA heard:",
          text
        );


        voiceStatus.textContent =
          "You said: " + text;


        /* OPEN DASHBOARD */

        if (

          text.includes(
            "open dashboard"
          )

          ||

          text.includes(
            "dashboard open"
          )

          ||

          text.includes(
            "dashboard kholo"
          )

          ||

          text.includes(
            "dashboard khol"
          )

        ) {

          dashboard.classList.remove(
            "hidden"
          );


          assistantText.textContent =
            "Opening your dashboard, Abbu.";


          setTimeout(function () {

            dashboard.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 100);

        }


        /* CLOSE DASHBOARD */

        else if (

          text.includes(
            "close dashboard"
          )

          ||

          text.includes(
            "dashboard band"
          )

        ) {

          dashboard.classList.add(
            "hidden"
          );


          assistantText.textContent =
            "Dashboard closed, Abbu.";

        }


        /* HELLO */

        else if (

          text.includes(
            "hello sara"
          )

          ||

          text.includes(
            "hi sara"
          )

          ||

          text.includes(
            "hello"
          )

          ||

          text.includes(
            "sara"
          )

        ) {

          assistantText.textContent =
            "Yes Abbu, I'm listening.";

        }


        /* OTHER COMMAND */

        else {

          assistantText.textContent =
            "I heard you, Abbu.";

        }

      };


    /* =====================
       VOICE END
    ===================== */

    recognition.onend =
      function () {

        voiceButton.classList.remove(
          "listening"
        );

        voiceStatus.textContent =
          "Tap to talk";

        statusText.textContent =
          "Online";

      };


    /* =====================
       VOICE ERROR
    ===================== */

    recognition.onerror =
      function (event) {

        console.log(
          "Voice error:",
          event.error
        );


        voiceButton.classList.remove(
          "listening"
        );


        statusText.textContent =
          "Online";


        if (
          event.error ===
          "not-allowed"
        ) {

          voiceStatus.textContent =
            "Allow microphone permission";

        }

        else {

          voiceStatus.textContent =
            "Voice error — tap again";

        }

      };

  }


  /* =========================
     READY
  ========================= */

  console.log(
    "SARA THE AI is ready"
  );

});
