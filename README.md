# WakuraTimeline

- 画面: https://codefornoto.github.io/WakuraTimeline/  
- スプレッドシート: https://docs.google.com/spreadsheets/d/1xyLAGfQFpNZdFLn39wC322Qmpi_oKqEl0ZyXA7vR2cQ/edit?gid=334419812#gid=334419812  
- GAS: https://script.google.com/home/projects/1O1NZL9kexAmsdh7Ll-k2a0SvkOta8r27Ty7i-u8ltJOY9Br29s0IfeVK/edit

## フォルダー構成

```
└── backend: GASのコード、スプレッドシートのデータをフロントに渡す
└── frontend: Timelineの表示
```


## クエリの仕様

* id: 取得するシート名(デフォルト: test)

## 新たな地域を追加する場合

1. スプレッドシートにシートを追加
2. [config.ts](./frontend/src/config.ts) にページタイトルを追加


## ローカルでの動かし方

### 事前準備

* git install
  * [手順](https://git-scm.com/downloads)
* nodejs install
  * [手順](https://nodejs.org/en/download)
* npm install  
  * [手順](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  * nodejsがインストールされていれば、ターミナルコマンドプロンプトで```npm install -g npm```すればOK（たぶん）

### 起動方法

githubからファイルダウンロード〜必要なライブラリインストール~起動

以下をターミナル/コマンドプロンプトで実行
```
git clone https://github.com/codefornoto/WakuraTimeline
cd WakuraTimeline/frontend
npm install
npm run dev
```
