console.log("background");

// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     // With a new rule ...
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         // That fires when a page's URL contains a 'g' ...
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlContains: 'g' },
//           })
//         ],
//         // And shows the extension's page action.
//         actions: [ new chrome.declarativeContent.ShowPageAction() ]
//       }
//     ]);
//   });
// });
// chrome.declarativeContent.ShowPageAction()

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?hackmd\.io/;
chrome.pageAction.onClicked.addListener((tab) => {
  console.log("pageAction.onClicked");
  console.log(tab);

  if (urlRegex.test(tab.url)) {
    // ...if it matches, send a message specifying a callback too
    console.log(tab.url);
    chrome.tabs.sendMessage(
      tab.id,
      { text: "clicked" },
      function (something) { console.log(something) }
    );
  }
});

// chrome.runtime.sendMessage('lfpdgfdmmplbmanbbcanilffkgjfgaei', {text:'inject'})
//   chrome.tabs.sendMessage(tab.id, { text: "start" }, callback);
// }

// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     // With a new rule ...
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         // That fires when a page's URL contains a 'g' ...
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { hostEquals: 'hackmd.io', schemes: ['https'] },
//             css: ['textarea[tabindex]']
//           })
//         ],
//         // And shows the extension's page action.
//         actions: [ new chrome.declarativeContent.ShowPageAction() ]
//       }
//     ]);
//   });
// });

// chrome.runtime.onMessage.addListener(
//   function(message, sender, sendResponse) {
//     if (message.todo === 'showPageAction') {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
//         chrome.pageAction.show(tab[0].id)
//       })
//     }
//   });

// chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//   if(message.type === 'showPageAction'){
//       chrome.pageAction.show(sender.tab.id);
//   }
// });
