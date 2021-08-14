# めっちゃシンプルなタイルクライアント

国土地理院などが配布しているタイル形式の配布物を比較的簡単に取得するためのライブラリです。  
内部に Axios を搭載してます。

# 使用例

```ts
import { SimpleClient } from "simpletileclient";

const client = new SimpleClient(
  "https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson"
);

client
  .get(16, 57442, 26004)
  .then((tile) => console.log(tile))
  .catch((e) => console.error(e));
```

# API

## Constructor

---

**new SimpleClient(url: string, reqOpt?: AxiosRequestConfig)** —タイルを取得するクライアントを作成する。  
`url`には`{z},{x},{y}`の三つがそれぞれ含まれている必要がある。  
画像や Pbf 形式のものなどは`reqOpt.responseType`と`reqOpt.headers`などを設定しないとデータを正しく取得できない。  
また、`url`を設定せずに`reqOpt.baseURL`で設定すると正しく取得できない。

## Method

---

**get(zoom: number, x: number, y: number)=>Promise<AxiosResponse>** —  
インスタンスを作成したときに指定した URL の `{z},{x},{y}`をそれぞれ置き換えて axios の get メソッドを使用し、  
レスポンスを返す。

**getByRect(zoom: number, cx: number, cy: number, width: number, height: number)=>Promise<AxiosResponse[]>** —  
`cx`,`cy`を中心として幅`width`,高さ`height`の範囲のタイルを全取得し、それぞれを配列にして返します
