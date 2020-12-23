# Speech input only for HackMD

![安裝後畫面](https://i.imgur.com/7HcQVlY.jpg)

安裝後在瀏覽 [Hack.MD](https://hackmd.io/) 的編輯頁面時，
在網頁右上角會出現 ![mic icon](https://icons.getbootstrap.com/icons/mic-fill.svg) 圖示，
點擊可以開啟/關閉 Speech Recognition。

Speech Recognition 辨識完句子後會先換行再開始 recode

---

## 為什麼想做這個 extension 的動機

目前所接觸到的研討會上大家習慣會使用 hack.md 開一個共筆筆記，
由多人輪流接力把講者說的東西記錄下來。
但是 Hack.MD 的編輯頁面有許多和一般輸入表單不一樣的行為，造成電腦上的語音輸入執行不順暢，
所以大略觀察 Hack.MD 所監聽的事件，做出這個專屬 Hack.MD 上使用的 語音輸入 extension。

---

## 簡單說明

1. 網頁載入時按照 manifest.json 所設定的匹配 URL
2. 如果匹配到預先設定在 manifest.json 的 URL，則把 content_script inject 進去目前正在瀏覽的網頁
3. 因為 extension match pattern 的規則，所以在 content_script 執行時判斷正在瀏覽的 Hack.MD 頁面是否存在編輯頁面會出現的特定元素。如果沒有，代表這個頁面不是編輯頁面，可能是首頁或者其他功能頁，跳出不執行剩餘步驟。
4. 如果判斷是編輯頁面的話，則啟用瀏覽器原生的 Speech Recognition API，於編輯頁面右上方插入 mic icon 按鈕，負責開始、停止 Speech Recognition instance。
5. Speech Recognition API 在開始、停止之間使用 dispatchEvent 模擬 Hack.MD 可能所監聽的事件

---

## Google extension 的組成

**可以**有以下 4 個部分

1. manifest.json
2. background scripts
3. content scripts
4. UI element

依照 extension 想要達成的目標`，
挑選、向 manifest 註冊所需要的元件，
只有 manifest 是絕對必要的。

### UI element 又大概有這幾個元件

1. popup page
2. option page
3. context menu
    (在瀏覽器中 滑鼠右鍵出現的選單選項)
4. omnibox
    (允許註冊 keyword，把瀏覽器網址列變成類似 commend line 的輸入)

[Architecture-Overview](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)

---

### manifest.json  (絕對必要)

- 最主要最必要的**表單**，用來告訴 chrome 你的 Google extension 裡面有什麼東西、extension 的基本資料、需要用到什麼權限、icons、會使用到哪一種 scope...等等

> manifest 目前正在從 v2 升級到 v3

### background Script

- 會一直存在, 但不一定會一直運作
- 如果沒有運作會進入休眠，在下一次事件發生後才會再被讀取
    (除非在 manifest 設置 `"persistent": true`)
- 主要負責用來
  - 監聽瀏覽器中的事件
  - 監聽其他三個 script(content, option, popup) 中發出的 message

### cotent script

- 會被 inject 到網頁裡面
- 唯一能夠操作正在瀏覽中網頁的 dom 的 script
- 能夠像是在寫一般 script 一樣使用我們常使用的網頁 api
- 在操作瀏覽器的 api 在上面有所[限制](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#capabilities)
- **Isolated worlds**: 與原本正在瀏覽中的網頁 scope 是分開的

### Isolated worlds

![Isolated worlds](https://i.imgur.com/smibbl9.png)
> 圖片節自 [Google developer - Content Scripts and Isolated Worlds 2009](https://www.youtube.com/watch?v=laLudeUmXHM)

共享同一個網頁的 DOM
不會互相影響
假設原本正在瀏覽的網頁使用了 Jquery 1.2
在 content.js 使用的Jquery 1.3
兩邊的 Jquery 並不會有影響

### UI element

1. popup page
  點擊 icon 會出現的小網頁
2. option page
  像是該 extension 的後台網頁
3. context menu
  在瀏覽器中，滑鼠右鍵出現的選單選項
4. omnibox
  允許註冊 keyword，把瀏覽器網址列變成類似 commend line 的輸入

---

## 實作中遇到的重要觀念

1. background_script, content_script, page script 都是獨立的 scope，
  溝通必須透過chrome API 來傳遞 message

2. content_script 和 當前瀏覽頁面原本的 script 互不衝突、干擾，
   google extension 官方稱之為 **Isolated worlds**

3. chrome api 都是 async
  覺得 background_script 與 content_script、page_script 之間的溝通，
  可以想像成 網頁與伺服器之間的關係。
  extension 可能會面臨到多個 windows、多個 tabs 的狀況，
  那同一份 background_script 就會面臨多個 content_script。

  background_script / content / page script 各司其職，
  如果讓 background_script 常駐的話會消耗整體瀏覽器的效能，
  因此在溝通上 background_script *通常應該*只會負責監聽 runtime event,
  不會有主動發送 message 的動作，
  發送應該由 UI element 來負責，這樣可能也比較合理。

## 遇到的困難紀錄

1. 開發期間 google extension document 正在從 v2 升級改寫到 v3，
  許多專有名詞無法獲得近一步地解釋，連結也失效

2. 有很多出現在官方 sample 的用法都沒有寫在文件內，
  只能瀏覽 sample 程式碼猜測並找答案

3. 在 menifest 註冊 page_action 來表現 點選 toolbar icon 的行為時，
  剛開始分不清楚 gray out 具體會出現的時機。
  
  如果設置 content_script，
  在沒有 match 到符合的 URL 時，icon 會是 gray out 的狀態，反之亦然。
  但是如果點選 icon 要觸發 popup page，
  必須先執行 chrome.pageActive.show()，
  此時的 pageAction 才算是真的有效...
  (雖然最後沒用上，決定直接把 UI element 嵌入進去 Hack.MD 編輯頁面)
