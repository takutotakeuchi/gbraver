var testData = require('../testlib/testData');
var testUtil = require('../testlib/testUtil');
var game = require('../../../../client/game/game');

//対戦モードの場合、バトル終了後はルーム選択画面に遷移する
enchant();
window.onload = doTest;

function doTest(){
    var assert = chai.assert;
    var testDataInst = testData();
    var statusArray = {
        'test002@gmail.com' : testDataInst.getPlayerData('test002@gmail.com').status,
        'saikyou@gmail.com' : testDataInst.getPlayerData('saikyou@gmail.com').status
    };
    var Game;

    initGame();
    function initGame(){
        Game = game({
            userId : 'test002@gmail.com',
            armdozerId : 'landozer',
            pilotId : 'kyoko',
            armdozerList : testDataInst.getMasterData().armdozerList,
            pilotList : testDataInst.getMasterData().pilotList
        });
        Game.start();
        Game.onload = onLoad;
    }

    function onLoad(){
        Game.setBattleMode(Game.BATTLE_MODE_TWO_PLAY);
        Game.changeBattleScene({
            statusArray : statusArray
        });
        waitPhase();
    }

    function waitPhase(){
        var waitPhaseData = {
            phase : 'wait',
            atackUserId : 'saikyou@gmail.com',
            turn : 20,
            statusArray : {
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000,
                    skillPoint : 1,
                    overHeatFlag : false
                },
                'saikyou@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000,
                    skillPoint : 1,
                    overHeatFlag : false
                }
            }
        };
        Game.ee.emit('serverResp', 'resp',waitPhaseData);
        Game.ee.once('sendMessage', function(message,data){
            //message,dataはenemyAtackTestで確認済み
            atackCommandPhase();
        });
    }

    function atackCommandPhase(){
        var atackCommandPhaseData = {
            phase : 'atackCommand',
            statusArray : {
                'saikyou@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000,
                    skillPoint : 1,
                    overHeatFlag : false
                },
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000,
                    skillPoint : 1,
                    overHeatFlag : false
                }
            }
        };
        Game.ee.emit('serverResp', 'resp',atackCommandPhaseData);
        Game.ee.once('sendMessage', function(message,data){
            //message,dataはenemyAtackTestで確認済み
            defenthCommandPhase();
        });
    }

    function defenthCommandPhase(){
        var defenthCommandData = {
            phase : 'defenthCommand',
            statusArray : {
                'saikyou@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000,
                    skillPoint : 1,
                    overHeatFlag : false
                },
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000,
                    skillPoint : 1,
                    overHeatFlag : false
                }
            }
        };
        Game.ee.emit('serverResp', 'resp',defenthCommandData);
        selectCommand();
    }

    function selectCommand(){
        testUtil.touch(Game.currentScene.plusIcon);
        testUtil.touch(Game.currentScene.okIcon);

        Game.ee.once('sendMessage', function(message,data){
            //message,dataはplayerAtackTestで確認済み
            damagePhase();
        });
    }

    function damagePhase(){
        var damagePhaseData = {
            phase : 'damage',
            hit : 1,
            damage : 5000,
            atackBattery : 3,
            defenthBattery : 2,
            statusArray : {
                'saikyou@gmail.com' : {
                    hp : 3200,
                    battery : 2,
                    active : 0,
                    skillPoint : 1,
                    overHeatFlag : false
                },
                'test002@gmail.com' : {
                    hp : -300,
                    battery : 3,
                    active : 3000,
                    skillPoint : 1,
                    overHeatFlag : false
                }
            }
        };
        Game.ee.emit('serverResp', 'resp',damagePhaseData);
        Game.ee.once('sendMessage', function(message,data){
            //message,dataはplayerAtackTestで確認済み
            Game.currentScene.tl.delay(30).then(gameEnd);
        });
    }

    function gameEnd(){
        var gameEndData = {
            phase : 'gameEnd',
            winner : 'saikyou@gmail.com',
            statusArray : {
                'saikyou@gmail.com' : {
                    hp : 3200,
                    battery : 2,
                    active : 0,
                    skillPoint : 1,
                    overHeatFlag : false
                },
                'test002@gmail.com' : {
                    hp : -300,
                    battery : 3,
                    active : 3000,
                    skillPoint : 1,
                    overHeatFlag : false
                }
            }
        };
        Game.ee.emit('serverResp', 'resp',gameEndData);
        Game.ee.once('sendMessage', assertOfGameEnd);
    }

    function assertOfGameEnd(message,data){
        var expectData = {
            method : 'ok'
        };
        assert.equal(message,'command','ゲーム終了時のサーバ送信メッセージが正しい');
        assert.deepEqual(data,expectData,'ゲーム終了時のサーバ送信データが正しい');
        Game.currentScene.tl.delay(30).then(doDissolveRoom);
    }

    function doDissolveRoom(){
        Game.ee.emit('serverResp', 'dissolveRoom',null);
        assert.equal(Game.currentScene.battleEndIcon.getVisible(),true,'戦闘終了ボタンが表示されている');
        Game.currentScene.tl.delay(30).then(pushBattleEndIcon);
    }

    function pushBattleEndIcon(){
        Game.ee.once('sendMessage', assertOfSendMessage2);
        testUtil.touch(Game.currentScene.battleEndIcon);
    }

    function assertOfSendMessage2(message,data){
        assert.equal(message,'getRoomInfo','サーバ送信メッセージが正しい');
        assert.equal(data,null,'サーバ送信データが正しい');
        assert.equal(Game.currentScene.battleEndIcon.getVisible(),false,'戦闘終了ボタンが表示されていない');
        assert.equal(Game.currentScene.mesWindow.getVisible(),true,'メッセージウインドウが表示されている');
        assert.equal(Game.currentScene.mesWindow.getText(),'ルーム情報取得中','メッセージウインドウの文字が正しい');
        Game.currentScene.tl.delay(30).then(respSuccessGetRoomInfo);
    }

    function respSuccessGetRoomInfo(){
        var data = {
            '0' : [],
            '1' : [],
            '2' : [],
            '3' : [],
            '4' : []
        };
        Game.ee.once('changeScene', assertOfChangeScene);
        Game.ee.emit('serverResp', 'successGetRoomInfo',data);
    }

    function assertOfChangeScene(scene){
        assert.equal(scene,'selectRoom','ルーム選択画面へ遷移する');
        testUtil.finishTest();
    }
}