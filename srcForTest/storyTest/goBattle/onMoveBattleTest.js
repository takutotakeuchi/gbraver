var storyScene = require('../../../src/scene/storyScene');
var testUtil = require('../../testlib/testUtil');
var testScenarioData = require('../../testlib/testScenarioData');
var gameBase = require('../../../src/game/gameBase');

enchant();
window.onload = doTest;

function doTest(){
    var assert = chai.assert;
    var Game = gameBase();
    var testScene;
    var testScenario = testScenarioData().getData('moveBattleTest');

    Game.start();
    Game.onload = function(){
        testScene = storyScene({
            scenarioData : testScenario
        });
        Game.replaceScene(testScene);
        pushNextButton();
    };

    function pushNextButton(){
        Game.currentScene.onEndStory(assertEndOfStory);
        testUtil.touch(Game.currentScene);

    }

    function assertEndOfStory(battle) {
        assert.equal(Game.currentScene.getStoryIndex(),1,'ストーリーインデックスが正しい');
        assert.equal(battle.enemyId, 'landozer', 'アームドーザIDが正しい');
        assert.equal(battle.pilotId, 'akane', 'パイロットIが正しい');
        assert.equal(battle.routineId,'attack3','ルーチンが正しい');
        testUtil.finishTest();
    }
}