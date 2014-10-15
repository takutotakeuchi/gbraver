機動倶楽部Gブレイバー
=======

## はじめに
機動倶楽部Gブレイバーとは、竹内佑介が趣味で作成している通信対戦ゲームです。
node.js、socket.io、enchant.jsがあれば簡単に出来るだろうという軽いノリで作りました。


## ゲームについて
ジャンルは1対1の対戦PRGですが、バッテリーシステムという独自要素を実施しました。
詳細は以下の通りです。
* 攻撃側、防御側でバッテリーポイントと呼ばれる行動ポイントを出し合います
* 攻撃の当たり判定は全てバッテリーポイントの大小だけで決まります
* 攻撃側、防御側でポイントが同じだった場合、防御ということでダメージが半減されます
* 防御側がバッテリー0を出した場合、被ダメージが2倍になります  

詳細はこのスライドを参照して下さい。  
<http://www.slideshare.net/yuusuketakeuchi96/g-33989023>


## ローカル環境への導入
(1)必須ソフトウェア  
導入の前提として、以下のソフトがインストールされている必要があります。  
・node.js  
・mongodb  

(2)githubからソースコードのコピー  
githubからプロジェクトをダウントードします。


(3)依存ライブラリのインストール  
プロジェクトフォルダのルートに移動して、以下コマンドで依存ライブラリをインストールします。  

`npm install`


(4)データベースの初期化  
以下コマンドで、データベースを初期化します。  

`mongodb mongo ホスト名/gbraver dbShell/createDB.js`

(5)起動バッチの作成
起動バッチとしてstartup.shを作成します。
以下に示すテンプレート通りに作成して下さい。

    #!/bin/sh

    GOOGLE_CLIENT_ID="GoogleOAuth2.0のClient ID"
    GOOGLE_CLIENT_SECRET="GoogleOAuth2.0のGOOGLE CLIENT SECRET"

    export GOOGLE_CLIENT_ID
    export GOOGLE_CLIENT_SECRET

    node app.js


## ローカル環境の起動方法
'./startup.sh'
または
'npm start'


## ローカルでのテスト実行方法
テストの実行コマンドは以下の通りです。

ユニットテスト  
`npm test`

DAOテスト  
`mocha mongoDbTest/ -R spec`

画面系テスト  
`NODE_MAIL_ADDRESS="テスト用Googleアカウント"  NODE_PASSWORD="テスト用Googleアカウントパスワード" mocha seleniumTest/ -R spec`

- 画面系テストはpublicForDebug配下に置かれた、*Test.jsが実行されます。
- ホスト名:ポート/testList でテスト一覧が出ます

##herokuへのデプロイ方法
(1)前提条件
・heorokuコマンドが使える

(2)herokuインスタンスの用意
herokuインスタンスを用意します。アドオンでMongoHqを追加して下さい。

(3)環境変数の登録
herokuに環境変数を登録します。ここでは環境変数登録バッチのテンプレートを示します。

    #!/bin/sh

    herokuAppName="herokuアプリ名"
    heroku config:add BASE_URL="herokuアプリのURL" --app $herokuAppName
    heroku config:add GOOGLE_CLIENT_ID="GoogleOAuth2.0のClient ID" --app $herokuAppName
    heroku config:add GOOGLE_CLIENT_SECRET="GoogleOAuth2.0のGOOGLE CLIENT SECRET" --app $herokuAppName


(4)herokuへデプロイ
`git push heroku`


## ゲームのプレイ動画
<https://www.youtube.com/watch?v=yX4XXKsnl4A>


## その他
中の人のブログです。 毎日プログラム  <http://blog.livedoor.jp/kaidouji85/>    
α版公開サイト <http://gbraver.herokuapp.com/>