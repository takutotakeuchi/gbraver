var testData = require('../testlib/testData');
var testUtil = require('../testlib/testUtil');
var game = require('../../src/game/game');

enchant();
window.onload = dpoTest;

function dpoTest(){
    var assert = chai.assert;
    var testDataInst = testData();
    var Game;
    initGame();

    function initGame(){
        Game = game({
            userId : 'test001@gmail.com',
            armdozerId : 'granBraver',
            pilotId : 'kyoko',
            armdozerList : testDataInst.getMasterData().armdozerList,
            pilotList : testDataInst.getMasterData().pilotList,
            stageData : testDataInst.getStageData()
        });
        Game.start();
        Game.onload = function(){
            Game.changeSelectStageScene();
            pushPrevtButton();
        };
    }

    function pushPrevtButton(){
        Game.onChangeScene(assertOfChangeScene);
        testUtil.touch(Game.currentScene.prevButton);
    }

    function assertOfChangeScene(scene) {
        assert.equal(scene,'top','トップシーンに遷移する');
        testUtil.finishTest();
    }
}