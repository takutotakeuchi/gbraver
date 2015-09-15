enchant();
window.onload = doTest;

function doTest() {
    var assert = chai.assert;
    var testMerter = null;
    var testGame = gameBase();
    var testDataInst = testData();

    testGame.start();
    testGame.onload = viewSpecialMerter;

    function viewSpecialMerter() {
        testMerter = specialMerter({
            isPlayer : true,
            ability : {
                type : 'hyperShield',
                value : 1000
            }
        });
        testGame.currentScene.addChild(testMerter);
        assertOfMerter();
    }

    function assertOfMerter(){
        finishTest();
    }
}