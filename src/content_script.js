const hackmdInput = document.querySelector('textarea[tabindex="0"]');
let currentLanguage = "zh-TW";

console.log("content.js");

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



// recognition.start();
// chrome.runtime.onMessage.addListener((message) => {
//   console.log(message)
//   if (message.text === 'start') recognition.start();
//   if (message.test === 'stop') recognition.stop();
// })
// chrome.runtime.sendMessage.addListener({todo: 'showPageAction'});

// chrome.runtime.sendMessage({type:'showPageAction'});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message)
  console.log(sender)
  console.log(sendResponse)
  if (message.text === 'clicked') {
      // Call the specified callback, passing
      // the web-page's DOM content as argument
      sendResponse('');
  }
});