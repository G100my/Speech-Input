# Speech input only for HackMD

## 為什麼想做這個 extension 的動機

因為家裡的長輩不會使用鍵盤輸入，桌機要用手寫輸入也是需要買手寫板，而它的軟體大多適用於繪圖，不一定方便手寫輸入。

## 適用情境

Speech Recognition 辨識完句子後會取代目前 focus 之處的文字。

適合用在短暫關鍵字的辨識。

## 安裝

![安裝完畫面](https://i.imgur.com/si3dydG.png)

安裝後在瀏覽器上會出現麥克風圖示。


## 使用方式

安裝完閉後，可以點擊 Open Mic 啟動/停止 Speech Recognition 語音辨識

### 啟動

1. 點擊右上方 mic icon 打開 popup 開啟麥克風: 啟動 Speech Recognition API，開始 Speech Recognition instance。
2. 點擊一下你要放置文字的位置。ex: Google Search Input
3. 對麥克風說話，就會成功把文字輸入到 focus 的位置
4. 再次說話，會將第一次說的內容取代。

### 停止

停止 Speech Recognition API 的方式有兩種

1. 可以透過語音「關閉」或「關掉」
2. 點擊右上方 mic icon 打開 popup 停用麥克風

## 簡單說明

Chrome Extension

1. 網頁載入時按照 manifest.json 所設定的匹配 URL
2. 如果匹配到預先設定在 manifest.json 的 URL，
3. content_script 這裡的 JS 會載入目前正在瀏覽的網頁。
   1. matches 因為 extension match pattern 的規則，改成所有頁面適用。
4. permissions 賦予正在瀏覽的網頁可以使用麥克風的權限。

程式行為

1. 點擊右上方 mic icon 打開 popup 開啟麥克風: 啟動 Speech Recognition API，開始 Speech Recognition instance。
2. 一次辨識就結束，所丈在辨識結束時，會判斷是否要繼續啟動。
3. 可以透過語音「關閉」或「關掉」:停止 Speech Recognition API
4. 點擊右上方 mic icon 打開 popup 停用麥克風: 停止 Speech Recognition API

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
