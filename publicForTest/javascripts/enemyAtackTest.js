enchant();
window.onload = firstPlayerAtack_asDefenther;

/**
 * 敵が攻撃を選択する
 */
function firstPlayerAtack_asDefenther(){
    var assert = chai.assert;
    var statusArray = {
        'test002@gmail.com' : getTestPlayerData('test002@gmail.com'),
        'test001@gmail.com' : getTestPlayerData('test001@gmail.com')
    };
    var Game;
    initGame();

    function initGame(){
        Game = game({
            userId : 'test002@gmail.com'});
        Game.start();
        Game.onload = function(){
            Game.changeBattleScene({
                statusArray : statusArray,
                userId : 'test002@gmail.com'
            });
            waitPhase();
        };
    }
    
    function waitPhase(){
        var waitPhaseData = {
            phase : 'wait',
            atackUserId : 'test001@gmail.com',
            turn : 20,
            statusArray : {
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                },
                'test001@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                }
            }
        };
        Game.emitServerResp('resp',waitPhaseData);
        Game.onSendMessage(function(message,data){
            //message、dataはenemyChargeTestで確認済み
            atackCommandPhase();
        });
    }
    
    function atackCommandPhase(){
        var data = {
            phase : 'atackCommand',
            statusArray : {
                'test001@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                },
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                }
            }
        };
        Game.emitServerResp('resp',data);
        Game.onSendMessage(assertAtackCommandPhase);
    }
    
    function assertAtackCommandPhase(message,data){
        var expectData = {
            method : 'ok'
        };
        assert.equal(message, 'command', '攻撃コマンドフェイズ終了時のサーバ送信メッセージ名が正しい');
        assert.deepEqual(data, expectData, '攻撃コマンドフェイズ終了時のサーバ送信データが正しい');
        assert.equal(Game.currentScene.charaSpriteArray['test001@gmail.com'].frame,1,'敵キャラのポーズが「攻撃」である');
        defenthCommandPhase();
      
    }

    function defenthCommandPhase() {
        var data = {
            phase : 'defenthCommand',
            statusArray : {
                'test001@gmail.com' : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                },
                'test002@gmail.com' : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                }
            }
        };
        Game.emitServerResp('resp',data);
        selectCommnad();
    }
    
    function selectCommnad(){
        Game.onSendMessage(assertDefenthCommand);
        touch(Game.battleScene.plusIcon);
        touch(Game.battleScene.okIcon);
    }
    
    function assertDefenthCommand(message,data){
        var expectData = {
            method : 'defenth',
            param : {
                battery : 2
            }
        };
        assert.equal(message,'command','防御コマンドフェイズのサーバ送信メッセージ名が正しい');
        assert.deepEqual(data, expectData, '防御コマンドフェイズのサーバ送信データが正しい');    
        damagePhase();
    }
    
    function damagePhase() {
        var damagePhaseData = {
            phase : 'damage',
            hit : 1,
            damage : 1600,
            atackBattery : 3,
            defenthBattery : 2,
            statusArray : {
                'test001@gmail.com' : {
                    hp : 3200,
                    battery : 2,
                    active : 0
                },
                'test002@gmail.com' : {
                    hp : 3100,
                    battery : 3,
                    active : 3000
                }
            }
        };
        
        Game.emitServerResp('resp',damagePhaseData);
        Game.onSendMessage(assertDamagePhase);
    }
    
    function assertDamagePhase(message,data){
        var expectData = {
            method : 'ok'
        };
        assert.equal(message, 'command', 'サーバ送信メッセージ名が正しい');
        assert.deepEqual(data, expectData, 'ウェイトフェイズ2のコマンドが正しい');
        assert.equal(Game.currentScene.charaSpriteArray['test001@gmail.com'].frame,0,'敵キャラのポーズが「立ち」である');
        waitPhase2();      
    }

    function waitPhase2(){
        var data = {
            phase : 'wait',
            atackUserId : 'test002@gmail.com',
            turn : 14,
            statusArray : {
                'test001@gmail.com' : {
                    hp : 3200,
                    battery : 2,
                    active : 3500
                },
                'test002@gmail.com' : {
                    hp : 3100,
                    battery : 4,
                    active : 5100
                }
            }
        };
        Game.emitServerResp('resp',data);
        Game.onSendMessage(function(message,command) {
            finishTest();
        });
    }
}