# Speech input only for HackMD

## google extension

google extension 主要由以下五個部件組成:

1. Manifest
1. Background Script
1. UI Elements
1. Content Script
1. Options Page

Manifest 為最主要的，負責告訴瀏覽器你的 extension 裡面有什麼、需要什麼權限...等等。
Content Script (content.js) 是唯一能操控**正在瀏覽的當前網頁 DOM**的要件。

[Architecture-Overview](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)

## 遇到的困難紀錄

1. 開發期間 google extension document 正在遷移、改寫，許多部位名詞無法獲得近一步地解釋

2. 無法正確地從 background script / popup script 傳遞 message 到 content script

## 正在進行

理想情況:

- 採用 pageActive 點選 icon 觸發開關, 且在不允許使用的情況下 grayed out
- 需要考慮 content script 是 inject declaratively (manifest) 還是 inject programmatically (background script??)
- 動態載入需要 activeTab permission

### dev: 實作 pageActive 發出 message 操控 content script

- pageActive 寫在 background script
- content script matche 到填寫在 manifest 裡的 url 後造成 pageActive 點擊無效，取而代之的是出現 context menu... (阿官方不是寫說是有 popup 才會無效嗎 orz)

### popup: 實作 popup script 發出 message 操控 content script

- 在 popup.html 裡面做 button 發出 message
