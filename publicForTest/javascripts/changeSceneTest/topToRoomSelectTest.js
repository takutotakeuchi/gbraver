enchant();
window.onload = topToRoomSelect;

function topToRoomSelect(){
    var assert = chai.assert;
    var Game;
    initGame();

    function initGame(){
        Game = game({
            userId : 'test001@gmail.com',
            armdozerPict : 'GranBraver.PNG'
        });
        Game.start();
        Game.onload = function(){
            Game.changeTopScene();
            pushBattleRoomButton();
        };
    }
    
    function pushBattleRoomButton(){
        //console.log('対戦ルーム入室ボタンを押す');
        touch(Game.topScene.battleRoomButton);
        Game.onSendMessage(sendGetRoomInfo);
    }

    function sendGetRoomInfo(message,data) {
        assert.equal(message,'getRoomInfo','サーバ送信メッセージが正しい');
        assert.equal(data,null,'サーバ送信データが正しい');
        assert.equal(Game.currentScene.mesWindow.getVisible(),true,'メッセージウインドウが表示される');
        assert.equal(Game.currentScene.mesWindow.getText(),'ルーム情報取得中','メッセージが正しい');
        assert.equal(Game.currentScene.title.getVisible(),false,'画面タイトルが非表示である');
        Game.currentScene.tl.delay(30).then(respSuccessGetRoomInfo);
    }

    function respSuccessGetRoomInfo() {
        var data = {
            '0' : [],
            '1' : [],
            '2' : [],
            '3' : [],
            '4' : []
        };
        Game.onChangeScene(assertOfChangeScene);
        Game.emitServerResp('successGetRoomInfo',data);
    }

    function assertOfChangeScene(scene){
        assert.equal(scene,'selectRoom','ルーム選択画面へ遷移する');
        finishTest();
    }
}