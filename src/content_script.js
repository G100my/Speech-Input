(function () {
  let triggle = false;
  let currentLanguage = 'zh-TW';
  const hackmdInput = document.querySelector('textarea[tabindex="0"]');
  if (hackmdInput === null) return;

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = currentLanguage;

  recognition.addEventListener('start', () => {
    hackmdInput.dispatchEvent(new KeyboardEvent('keydown'));
  });

  recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    hackmdInput.value = transcript;

    if (event.results[0].isFinal) {
      hackmdInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
    }
  });

  recognition.addEventListener('end', () => {
    if (triggle) recognition.start();
  });

  // ====

  const mic = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/><path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/></svg>`;
  const micMute = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-mic-mute-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963L11 7.879zM5 6.12l4.486 4.486A3 3 0 0 1 5 8V6.121zm8.646 7.234l-12-12 .708-.708 12 12-.708.707z"/></svg>`;

  const li = document.createElement('li');
  const a = document.createElement('a');

  li.style.backgroundColor = '#eee !important';
  a.innerHTML = `${micMute}`;
  a.className = 'navbar-button-icon';
  li.prepend(a);

  const targetUl = document.querySelector('li[class="ui-share-button"]').parentElement;
  targetUl.prepend(li);

  li.addEventListener('click', function () {
    triggle = !triggle;
    if (triggle) {
      recognition.start();
      a.innerHTML = mic;
    } else {
      recognition.stop();
      a.innerHTML = micMute;
    }
  });

  console.log('Script inject finished. Engine start ㄍㄥˊ ㄍㄥˊ ~ ~');
})();
