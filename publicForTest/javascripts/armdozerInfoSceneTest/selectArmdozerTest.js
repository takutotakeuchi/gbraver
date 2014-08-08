enchant();
//TODO : モバイル環境でTouch to Start から先に進まない不具合を回避するために追加
//       http://make-muda.weblike.jp/2014/04/1283/
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;
window.onload = selectArmdozer;

function selectArmdozer(){
    var assert = chai.assert;
    var armdozerInfo = {
        armdozerId : 'granBraver',
        name : 'グランブレイバー',
        pictName : 'GranBraver.PNG',
        hp : 3000,
        speed : 110,
        weapons : {
            1 : {
                name : 'バスターナックル',
                power : 1000
            },
            2 : {
                name : 'バスターナックル',
                power : 1200
            },
            3 : {
                name : 'バスターナックル',
                power : 1500
            },
            4 : {
                name : 'バスターナックル',
                power : 1700
            },
            5 : {
                name : 'バスターナックル',
                power : 2000
            }
        }
    };
    var Game = gameBase();
    var testScene;

    Game.start();
    Game.onload = function(){
        testScene = armdozerInfoScene({
            armdozerInfo : armdozerInfo
        })
        Game.replaceScene(testScene);
        pushOkButton();
    };

    function pushOkButton(){
        touch(testScene.okButton);
        testScene.onPushOkButton(assertOfSelectArmdozer);
    }

    function assertOfSelectArmdozer(data){
        var expect = {
            armdozerId : 'granBraver'
        };
        assert.deepEqual(data,expect,'決定ボタンを押した時のデータが正しい');
        assertOfWaitScene();
    }

    function assertOfWaitScene(){
        assert.equal(Game.currentScene.okButton.visible,false,'「決定」ボタンが無効である');
        assert.equal(Game.currentScene.prevButton.visible,false,'「戻る」ボタンが無効である');
        finishTest();
    }
}