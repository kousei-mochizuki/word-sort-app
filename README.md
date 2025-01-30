# word-sort-app

※ 以下の3つをダウンロードしておく
```
・Rust
https://www.rust-lang.org/tools/install
・Node.js
npmでもyarnでも好きな物をインストールしておく
・各種ビルドツール
Microsoft C++ Build Toolsをインストールしておく
```

#### ➀まずは `$ npm create tauri-app@latest` を実行する
#### ➁できたプロジェクトフォルダの `src` の `App.tsx` と `App.css` をここにあるプログラムに置き換える
#### ➂完成。

```
参考
Tauriでデスクトップアプリを開発する
https://qiita.com/k-yaina60/items/d120a39578a3b29b953d
TAURIのインストールと関数呼び出し方法
https://qiita.com/tarou-imokenpi/items/84798005ed7519502566
```

```
一応各種node_moduleのバージョンを追記

プロジェクトフォルダ
├── @tauri-apps/api@2.2.0
├── @tauri-apps/cli@2.2.7
├── @tauri-apps/plugin-shell@2.2.0
├── @types/react-dom@18.3.5
├── @types/react@18.3.18
├── @vitejs/plugin-react@4.3.4
├── react-dom@18.3.1
├── react@18.3.1
├── typescript@5.7.3
└── vite@5.4.14
```
