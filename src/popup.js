var getSelectedTab = tab => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  document.getElementById('active').addEventListener('click', () => sendMessage({ action: 'ACTIVE' }));
  document.getElementById('desactive').addEventListener('click', () => sendMessage({ action: 'DEACTIVE' }));
}

chrome.tabs.getSelected(null, getSelectedTab);