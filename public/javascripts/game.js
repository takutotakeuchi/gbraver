function game(spec, my) {
    /**
     * ゲームコア
     */
    var core = gameBase();
    var userId = spec.userId;
    var armdozerPict = spec.armdozerPict;
    var emitChangeScene = function(scene){};
    var emitSendMessage = function(message,data){};

    /**
     * 戦闘シーンに切り替える 
     * @param {Object} spec
     * {
     *     userId : String
     * }
     */
    core.changeBattleScene = function(spec){
        spec.userId = userId;
        core.battleScene = battleScene(spec);
        core.battleScene.onCommand(function(command){
            emitSendMessage('command',command);
        });
        core.pushScene(core.battleScene);
        emitChangeScene('battle');
    };

    core.changeRoomSelectScene = function(){
        core.roomSelectScene = roomSelectScene();
        core.roomSelectScene.onEnterRoom(function(data){
            emitSendMessage('enterRoom',data);
        });
        core.roomSelectScene.onPushPrevButton(function(data){
            core.changeTopScene();
        });
        core.roomSelectScene.onLeaveRoom(function(){
            emitSendMessage('leaveRoom',null);
        });
        core.replaceScene(core.roomSelectScene);
        emitChangeScene('selectRoom');
    };
    
    core.changeTopScene = function(){
        core.topScene = topScene({
            armdozerPict : armdozerPict
        });
        core.topScene.onPushSetArmdozer(function(){
            emitSendMessage('getCharacterList',null);
        });
        core.topScene.onPushBattleRoom(function(){
            core.changeRoomSelectScene();
        });
        core.replaceScene(core.topScene);
        emitChangeScene('top');
    };
    
    core.changeSetArmdozerScene = function(data){
        core.setArmdozerScene = setArmdozerScene(data);
        core.setArmdozerScene.onSelectArmdozer(function(data){
            emitSendMessage('getCharacterInfo',data);
        });
        core.setArmdozerScene.onPushPrevButton(function(data){
            core.changeTopScene();
        });
        core.replaceScene(core.setArmdozerScene);
        emitChangeScene('setArmdozer');
    };

    core.changeArmdozerInfoScene = function(respData){
        var scene = armdozerInfoScene({
            armdozerInfo : respData
        });
        scene.onPushOkButton(function(sendData){
            armdozerPict = respData.pictName;
            emitSendMessage('setArmdozer',sendData);
        });
        scene.onPushPrevButton(function(){
            emitSendMessage('getCharacterList');
        })
        core.replaceScene(scene);
        emitChangeScene('armdozerInfo');

    }

    core.onChangeScene = function(fn){
        emitChangeScene = fn;
    };
    
    core.onSendMessage = function(fn){
        emitSendMessage = fn;
    };
    
    core.emitServerResp = function(message,data){
        switch(message) {
            case 'successSetArmdozer' :
                emitSendMessage('getCharacterList');
                break;
            case 'gameStart' :
                var statusArray = {};
                for (var uid in data) {
                    statusArray[uid] = data[uid].status;
                }
                core.changeBattleScene({
                    statusArray : statusArray
                });
                emitSendMessage('command',{
                    method : 'ready'
                });
                break;
            case 'resp' :
                changePhase(data);
                break;
            case 'dissolveRoom':
                core.battleScene = null;
                core.changeTopScene();
                break;
            case 'successGetCharacterList' :
                core.changeSetArmdozerScene({
                    armdozerIdList : data
                });
                break;
            case 'successGetCharacterInfo':
                core.changeArmdozerInfoScene(data);
                break;
            case 'succesEnterRoom':
                core.roomSelectScene.emitSuccesEnterRoom();
                break;
            case 'successLeaveRoom':
                core.roomSelectScene.emitSuccesLeaveRoom();
                break;
        }
    };

    core.getArmdozerPict = function() {
        return armdozerPict;
    }
    
    function changePhase(data){
        var phase = data.phase;
        switch(phase) {
            case 'wait':
                core.battleScene.doWaitPhase(data);
                break;
            case 'atackCommand':
                core.battleScene.doAtackCommandPhase(data);
                break;
            case 'charge':
                core.battleScene.doChargePhase(data);
                break;
            case 'defenthCommand':
                core.battleScene.doDefenthCommandPhase(data);
                break;
            case 'damage':
                core.battleScene.doDamagePhase(data);
                break;
            case 'gameEnd':
                core.battleScene.doGameEnd(data);
                break;
        }
    }

    return core;
}
