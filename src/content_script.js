(function () {
  console.log("啟動");
  let toggle = 'DEACTIVE'

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = 'zh-TW';

  recognition.addEventListener('start', () => {
    console.log("start")
  });



  recognition.addEventListener('result', (event) => {
    const transcript = [...event.results]
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');
      console.log(transcript)

    document.activeElement.value = transcript;
    if (["關掉", "關閉"].includes(transcript)) toggle = "DEACTIVE";
  });

  recognition.addEventListener('end', () => {
    if (toggle === 'ACTIVE') {
      console.log("start again")
      recognition.start();
    }
  });
  // recognition.start();

  const onMessage = (message) => {
    console.log('message.action', message.action)
    switch (message.action) {
      case 'ACTIVE':
        toggle = message.action;
        recognition.start();
        break;
      case 'DEACTIVE':
        toggle = message.action;
        break;
      default:
        break;
    }
  }

  chrome.runtime.onMessage.addListener(onMessage);
})();
