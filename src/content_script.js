const hackmdInput = document.querySelector('textarea[tabindex="0"]');
let currentLanguage = "zh-TW";

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = currentLanguage;

recognition.addEventListener('speechstart', () => {
  hackmdInput.dispatchEvent(new KeyboardEvent('keydown'))
})

recognition.addEventListener("result", (event) => {

  const transcript = Array.from(event.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  hackmdInput.value = transcript;

  if (event.results[0].isFinal) {
    hackmdInput.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':13}))
  }
});

recognition.addEventListener("end", recognition.start);

recognition.start();
