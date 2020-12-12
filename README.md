# Speech input only for HackMD

## google extension

google extension 主要由以下五個部件組成:

1. Manifest
1. Background Script
1. UI Elements
1. Content Script
1. Options Page

Manifest 為最主要的，負責告訴瀏覽器你的 extension 裡面有什麼、需要什麼權限...等等。
Content Script (content.js) 是唯一能操控**正在瀏覽的當前網頁DOM**的要件。

[Architecture-Overview](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)
