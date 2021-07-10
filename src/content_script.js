const onMessage = message => {
  console.log('message.action', message.action)
  switch (message.action) {
    case 'ACTIVE':
      toggle = message.action;
      main();
      break;
    case 'DEACTIVE':
      toggle = message.action;
      delete recognition;
      break;
    default:
      break;
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
chrome.runtime.onMessage.addListener(onMessage);

function main() {

  console.log("啟動");

  function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  const onStart = () => console.log('start')
  const onEnd = () => {
    console.log("start again toggle", toggle)
    if (toggle === 'ACTIVE') {
      recognition.start();
    } else if (toggle === 'DEACTIVE') {
      delete recognition;
    }
  }

  const onResult = event => {
    const transcript = [...event.results]
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
      console.log(transcript)

    document.activeElement.value = transcript;
    // console.log(["關掉", "關閉"].includes(transcript),  transcript.length, ["關掉", "關閉"].includes(transcript) && transcript.length === 2)
    // console.log('toggle on result', toggle)
    if (["關掉", "關閉"].includes(transcript) && transcript.length === 2) toggle = "DEACTIVE";
    // console.log('toggle on result', toggle)
  }

  let toggle = 'ACTIVE'
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = 'zh-TW';

  recognition.addEventListener('start', onStart);
  recognition.addEventListener('result', debounce(onResult, 350));
  recognition.addEventListener('end', onEnd);
  recognition.start();
}
