/**
 * ゲームメインクラス
 * @param {Object} spec
 * @param {Object} my
 */
function game(spec, my) {
    /**
     * 継承元クラス
     */
    var core = new Core(320, 320);
    
    /**
     * 定数
     */
    const MAX_PLAYER_NUM = 2;
    
    /**
     * プライベート変数の宣言
     */
    var socket = spec.socket;
    var roomId = spec.roomId;
    var userId = spec.userId;
    var enemyUserId = spec.enemyUserId;
    var statusMap = {};
    var playerSprite;
    var enemySprite;
    var labelUnitName;
    var labelHp;
    var labelActive;
    var labelBattery;
    var labelEnemyUnitName;
    var labelEnemyHp;
    var labelEnemyActive;
    var labelEnemyBattery;
    var labelEnemySelectBattery;
    var iconPlus;
    var iconMinus;
    var executePhase = waitPhase;
    var playerSelectBatterySprite;
    var inputs = null;
    var atackUserId = null;
    var defenthUserId = null;
    
    /**
     * 定数の宣言
     */
    const MAX_ACTIVE = 5000;
    
    /**
     * コンストラクタ
     */
    function constructor() {
        //FPSの設定
        core.fps = 60;
        
        //キャラクターのステータスをセット
        statusMap[userId] = spec.usersInfo[userId].status;
        statusMap[enemyUserId] = spec.usersInfo[enemyUserId].status;
        
        //素材のプリロード
        preLoad();
        
        //プリロード完了後の処理
        core.onload = function() {
            init();
            core.rootScene.addEventListener('enterframe', enterFrame);
        };
        
        //ゲーム開始処理
        core.start();
    };
    constructor();
    
    /**
     * 全ユーザの入力を受け取る
     */
    socket.on("resp", function(data) {
        inputs = data.inputs;
    });

    /**
     * リソースのプリロード
     */
    function preLoad(){
        core.preload('/images/'+statusMap[userId].pictName);
        core.preload('/images/'+statusMap[enemyUserId].pictName); 
        core.preload('/images/plus.png');
        core.preload('/images/minus.png');
        core.preload('/images/Battery.png');
    }    
    
    /**
     * リフレッシュレートごとの処理 
     * @param {Object} e
     */
    function enterFrame(e) {
        refreshMertor();
        executePhase();
    }
    
    /**
     * 初期化
     */
    function init(){

        for(var uid in statusMap){
            statusMap[uid].active = 0;
            statusMap[uid].battery = 5;
            statusMap[uid].selectBattery = 0;
        }
        
        playerSprite = new Sprite(128, 128);
        playerSprite.image = core.assets['/images/'+statusMap[userId].pictName];
        playerSprite.x = 192;
        playerSprite.y = 80;
        core.rootScene.addChild(playerSprite);
        
        enemySprite = new Sprite(128, 128);
        enemySprite.image = core.assets['/images/'+statusMap[enemyUserId].pictName];
        enemySprite.x = 0;
        enemySprite.y = 80;
        enemySprite.scaleX = -1;
        core.rootScene.addChild(enemySprite);
        
        labelUnitName = new Label();
        labelUnitName.x = 200;
        labelUnitName.y = 0;
        labelUnitName.color = '#fff';
        core.rootScene.addChild(labelUnitName);
        
        labelHp = new Label('HP');
        labelHp.x = 200;
        labelHp.y = 16;
        labelHp.color = '#fff';
        core.rootScene.addChild(labelHp);
        
        labelActive = new Label('Active');
        labelActive.x = 200;
        labelActive.y = 32;
        labelActive.color = '#fff';
        core.rootScene.addChild(labelActive);
        
        labelBattery = new Label('Battery');
        labelBattery.x = 200;
        labelBattery.y = 48;
        labelBattery.color = '#fff';
        core.rootScene.addChild(labelBattery);
        
        labelEnemyUnitName = new Label();
        labelEnemyUnitName.x = 32;
        labelEnemyUnitName.y = 0;
        labelEnemyUnitName.color = '#fff';
        core.rootScene.addChild(labelEnemyUnitName);       

        labelEnemyHp = new Label('HP');
        labelEnemyHp.x = 32;
        labelEnemyHp.y = 16;
        labelEnemyHp.color = '#fff';
        core.rootScene.addChild(labelEnemyHp);
        
        labelEnemyActive = new Label('Active');
        labelEnemyActive.x = 32;
        labelEnemyActive.y = 32;
        labelEnemyActive.color = '#fff';
        core.rootScene.addChild(labelEnemyActive);
        
        labelEnemyBattery = new Label('Battery');
        labelEnemyBattery.x = 32;
        labelEnemyBattery.y = 48;
        labelEnemyBattery.color = '#fff';
        core.rootScene.addChild(labelEnemyBattery);
        
        labelEnemySelectBattery = new Label('');
        labelEnemySelectBattery.x = 32;
        labelEnemySelectBattery.y = 64;
        labelEnemySelectBattery.color = '#fff';
        core.rootScene.addChild(labelEnemySelectBattery);
        
        iconPlus = new Sprite(64, 64);
        iconPlus.image = core.assets['/images/plus.png'];
        iconPlus.x = 256;
        iconPlus.y = 180;
        iconPlus.addEventListener(Event.TOUCH_START,function(e){
            playerSelectBatterySprite.value += 1;
            playerSelectBatterySprite.frame = playerSelectBatterySprite.value;
        });
        
        iconMinus = new Sprite(64, 64);
        iconMinus.image = core.assets['/images/minus.png'];
        iconMinus.x = 180;
        iconMinus.y = 180;
        iconMinus.addEventListener(Event.TOUCH_START,function(e){
            playerSelectBatterySprite.value += -1;
            playerSelectBatterySprite.frame = playerSelectBatterySprite.value;
        });
        
        playerSelectBatterySprite = new Sprite(64,64);
        playerSelectBatterySprite.image = core.assets['/images/Battery.png'];
        playerSelectBatterySprite.x = 220;
        playerSelectBatterySprite.y = 100;
        playerSelectBatterySprite.frame = 1;
        playerSelectBatterySprite.value = 1;
        playerSelectBatterySprite.addEventListener(Event.TOUCH_START,function(e){
            //アイコンを消す
            core.rootScene.removeChild(playerSelectBatterySprite);
            core.rootScene.removeChild(iconPlus);
            core.rootScene.removeChild(iconMinus);
            
            //入寮情報を送信する
            socket.emit("input", {
                roomId : roomId,
                userId : userId,
                input : playerSelectBatterySprite.value
            });
        });
        
        core.rootScene.backgroundColor = "black";
    }
    
    /**
     * メータ系更新 
     */
    function refreshMertor() {
        labelHp.text = 'HP ' + statusMap[userId].hp;
        labelActive.text = 'Active ' + statusMap[userId].active;
        labelBattery.text = 'Battery' + statusMap[userId].battery;

        labelEnemyHp.text = 'HP ' + statusMap[enemyUserId].hp;
        labelEnemyActive.text = 'Active ' + statusMap[enemyUserId].active;
        labelEnemyBattery.text = 'Battery' + statusMap[enemyUserId].battery;
    }

    /**
     * ウェイトフェイズ 
     */
    function waitPhase(){
        //アクティブゲージを加算
        for(var uid in statusMap){
            statusMap[uid].active += statusMap[uid].speed;
        }

        if(statusMap[userId].active >= MAX_ACTIVE){
            //プレイヤーを攻撃側に設定する
            atackUserId = userId;
            defenthUserId = enemyUserId;
            
            //コマンドボタンを表示する
            core.rootScene.addChild(iconPlus);
            core.rootScene.addChild(iconMinus);
            core.rootScene.addChild(playerSelectBatterySprite);
            
            //攻撃バッテリー決定フェイズへ
            executePhase = atackBatteryPhase;
        } else if(statusMap[enemyUserId].active >= MAX_ACTIVE) {
            //敵を攻撃側に設定する
            atackUserId = enemyUserId;
            defenthUserId = userId;
            
            //コマンドを送信する
            //待ちフェイズの場合、OKという文字を入力としてサーバへ送信する
            socket.emit("input", {
                roomId : roomId,
                userId : userId,
                input : 'OK'
            });
            
            //攻撃バッテリー決定フェイズに遷移
            executePhase = atackBatteryPhase;
        }
    }
    
    /**
     * 攻撃バッテリー決定フェイズ
     */
    function atackBatteryPhase(){
        //サーバからのレスポンスがない場合、関数を終了する
        if(inputs === null){
            return;
        }
        
        //サーバの入力を受け取る
        statusMap[atackUserId].selectBattery = inputs[atackUserId];
        inputs = null;

        //攻撃側がプレイヤーの場合
        if (atackUserId === userId) {
            //コマンドを送信する
            //待ちフェイズの場合、OKという文字を入力としてサーバへ送信する
            socket.emit("input", {
                roomId : roomId,
                userId : userId,
                input : 'OK'
            });
        }
        //攻撃側が敵の場合
        else {
            //コマンドボタンを表示する
            core.rootScene.addChild(iconPlus);
            core.rootScene.addChild(iconMinus);
            core.rootScene.addChild(playerSelectBatterySprite);
        }

        //防御バッテリー決定待フェイズへ遷移
        executePhase = defenthBatteryPhase;
    }

    /**
     * 防御バッテリー決定フェイズ
     */
    function defenthBatteryPhase(){
        //サーバからのレスポンスがない場合、関数を終了する
        if(inputs === null){
            return;
        }
        
        //サーバの入力を受け取る
        statusMap[defenthUserId].selectBattery = inputs[defenthUserId];
        inputs = null;
        
        console.log('player Battery : ' + statusMap[userId].selectBattery);
        console.log('enemy Battery : ' + statusMap[enemyUserId].selectBattery);        
        
    }

    return core;
};