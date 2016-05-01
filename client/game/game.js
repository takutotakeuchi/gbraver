import __ from 'underscore';
import EventEmitter from 'event-emitter';
import gameBase from './gameBase';
import battleScene from '../scene/battleScene';
import roomSelectScene from '../scene/roomSelectScene';
import topScene from '../scene/topScene';
import selectPilotScene from '../scene/selectPilotScene';
import selectArmdozerScene from '../scene/selectArmdozerScene';
import selectStageScene from '../scene/selectStageScene';
import tournamentScene from '../scene/tournamentScene';

module.exports = function(spec, my) {
    /**
     * ゲームコア
     */
    var contentBaseUrl = spec&&spec.contentBaseUrl || location.origin;
    var that = gameBase({
        contentBaseUrl : contentBaseUrl
    });
    var userId = spec.userId;
    var armdozerId = spec.armdozerId;
    var pilotId = spec.pilotId;

    var pilotList = spec.pilotList;
    var armdozerList = spec.armdozerList;
    var stageData = spec.stageData;
    var scenarioData = spec.scenarioData;

    var currentScenarioId = 'first';
    var nextScenarioId = null;
    var battleMode = that.BATTLE_MODE_TWO_PLAY;

    that.ee = new EventEmitter();

    /**
     * シーン変更のヘルパー関数
     * @param scene 変更するシーン
     */
    function replaceScene(scene) {
        that.replaceScene(scene);
        that.ee.emit('changeScene', scene.getName());
    }

    /**
     * アームドーザIDを取得する
     * @returns {string} アームドーザID
     */
    that.getArmdozerId = function() {
        return armdozerId;
    }

    /**
     * パイロットIDを取得する
     * @returns {string} パイロットID
     */
    that.getPilotId = function(){
        return pilotId;
    }

    /**
     * 戦闘モードを取得する
     * @returns {string} 戦闘モード
     */
    that.getBattleMode = function(){
        return battleMode;
    }

    /**
     * 戦闘モードを設定する
     * @param mode 戦闘モード
     */
    that.setBattleMode = function(mode){
        battleMode = mode;
    }

    /**
     * シナリオIDを取得する
     * @returns {string} シナリオID
     */
    that.getScenarioId = function(){
        return currentScenarioId;
    }

    /**
     * 戦闘シーンに変更する
     *
     * @param spec battleSceneに渡すspec
     */
    that.changeBattleScene = function(spec){
        spec.userId = userId;
        var scene = battleScene(spec);
        scene.onCommand(function(command){
            that.ee.emit('sendMessage', 'command',command);
        });
        scene.onPushBattleEndIcon(function(isWin){
            if(battleMode===that.BATTLE_MODE_TWO_PLAY){
                that.ee.emit('sendMessage', 'getRoomInfo',null);
            } else if(battleMode===that.BATTLE_MODE_SINGLE_PLAY) {
                that.changeSelectStageScene();
            }
        });
        replaceScene(scene);
    };

    /**
     * ルームセレクトシーンに変更する
     *
     * @param roomInfo ルーム情報
     */
    that.changeRoomSelectScene = function(roomInfo){
        battleMode = that.BATTLE_MODE_TWO_PLAY;
        var scene = roomSelectScene({
            roomInfo : roomInfo
        });
        scene.onEnterRoom(function(data){
            that.ee.emit('sendMessage', 'enterRoom',data);
        });
        scene.onPushPrevButton(function(data){
            that.changeTopScene();
        });
        scene.onLeaveRoom(function(){
            that.ee.emit('sendMessage', 'leaveRoom',null);
        });
        scene.onPushRefreshButton(function(){
            that.ee.emit('sendMessage', 'getRoomInfo',null);
        });
        replaceScene(scene);
    };

    /**
     * トップシーンに変更する
     *
     */
    that.changeTopScene = function(){
        var scene = topScene({
            armdozerId : armdozerId,
            pilotId : pilotId,
            armdozerList : armdozerList,
            pilotList : pilotList
        });
        scene.ee.on('pushTournamentButton',  ()=>that.changeTournamentScene());
        scene.ee.on('pushSelectArmdozer',()=>that.changeSelectArmdozerScene());
        scene.ee.on('pushBattleRoomButton',()=>that.ee.emit('sendMessage', 'getRoomInfo',null));
        scene.ee.on('pushSelectPilotButton', ()=>that.changeSelectPilotScene());
        scene.ee.on('logOff', ()=>that.ee.emit('logOff'));
        replaceScene(scene);
    };

    /**
     * トーナメントシーンに遷移する
     */
    that.changeTournamentScene = function() {
        let scene = tournamentScene();
        replaceScene(scene);
    }

    /**
     * パイロット選択シーンに変更する
     */
    that.changeSelectPilotScene = function() {
        var scene = selectPilotScene({
            pilotList : pilotList,
            selectPilotId : pilotId
        });
        scene.onPushPrevButton(function(){
            that.changeTopScene();
        });
        scene.onPushOkButton(function(l_pilotId){
            var data = {
                pilotId : l_pilotId
            };
            that.ee.emit('sendMessage', 'setPilot',data);
            pilotId = l_pilotId;
        });
        replaceScene(scene);
    }

    /**
     * アームドーザ選択シーンに変更する
     *
     */
    that.changeSelectArmdozerScene = function(){
        var scene = selectArmdozerScene({
            armdozerList : armdozerList,
            selectArmdozerId : armdozerId
        });
        scene.onPushOkButton(function(l_armdozerId){
            var sendData = {
                armdozerId : l_armdozerId
            };
            that.ee.emit('sendMessage', 'setArmdozer',sendData);
            armdozerId = l_armdozerId;
        });
        scene.onPushPrevButton(function(){
            that.changeTopScene();
        });replaceScene(scene);
    }

    /**
     * ステージ選択シーンに変更する
     *
     */
    that.changeSelectStageScene = function(){
        var scene = selectStageScene({
            stageData : stageData,
            armdozerList : armdozerList
        });
        scene.onPushPrevButton(function(){
            that.changeTopScene();
        });
        scene.onPushStageButon(function(enemyId,pilotId,routineId){
            var data = {
                enemyId : enemyId,
                pilotId : pilotId,
                routineId : routineId
            };
            that.ee.emit('sendMessage', 'startSinglePlay',data);
        });
        battleMode = that.BATTLE_MODE_SINGLE_PLAY;
        replaceScene(scene);
    }

    /**
     * サーバからgameStartが返された際のイベントハンドラ
     * @param data サーバレスポンス
     */
    function onGameStart(data) {
        that.changeBattleScene({
            timeOver : that.COMMAND_TIME_OVER,
            statusArray : __.mapObject(data,function(val, key){
                return val.status;
            })
        });
        that.ee.emit('sendMessage', 'command',{
            method : 'ready'
        });
    }

    /**
     * サーバからrespが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onResp(data){
        __.chain({
            wait: 'doWaitPhase',
            atackCommand: 'doAtackCommandPhase',
            charge: 'doChargePhase',
            defenthCommand: 'doDefenthCommandPhase',
            damage: 'doDamagePhase',
            gameEnd: 'doGameEnd',
            pilotSkill: 'doPilotSkill',
            armdozerAbility: 'doArmdozerAbility'
        }).filter(function(val, key){
            return key === data.phase;
        }).each(function(val, key) {
            that.currentScene[val](data);
        });
    }

    /**
     * サーバからdissolveRoomが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onDissolveRoom(data) {
        if(that.currentScene.getName()==='battle'){
            that.currentScene.doDissolveRoom();
        }
    }

    /**
     * サーバからsuccesEnterRoomが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onSuccesEnterRoom(data) {
        if(that.currentScene.getName()==='selectRoom'){
            that.currentScene.emitSuccesEnterRoom();
        }
    }

    /**
     * サーバからsuccessLeaveRoomが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onSuccessLeaveRoom() {
        that.ee.emit('sendMessage', 'getRoomInfo',null);
    }

    /**
     * サーバからenterRoomErrorが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onEnterRoomError(data) {
        if(that.currentScene.getName()==='selectRoom') {
            that.currentScene.emitEnterRoomError(data);
        }
    }

    /**
     * サーバからbattleErrorが返された際のイベントハンドラ
     * @param data サーバからのデータ
     */
    function onBattleError(data) {
        if(that.currentScene.getName()==='battle'){
            that.changeTopScene();
        } else if(that.currentScene.getName()==='selectRoom') {
            that.currentScene.emitEnterRoomError('そのコネクションは既に入室しています。');
        }
    }

    /**
     * サーバからメッセージが来た際のイベントハンドラ
     * @param message メッセージ
     * @param data データ
     */
    that.ee.on('serverResp', function(message, data){
        __.chain({
            successSetArmdozer: that.changeTopScene,
            gameStart: onGameStart,
            resp: onResp,
            dissolveRoom: onDissolveRoom,
            succesEnterRoom: onSuccesEnterRoom,
            successLeaveRoom: onSuccessLeaveRoom,
            successGetRoomInfo: that.changeRoomSelectScene,
            enterRoomError: onEnterRoomError,
            successSetPilot: that.changeTopScene,
            battleError: onBattleError
        }).filter(function(val, key){
            return message === key;
        }).each(function(val, key){
            val(data);
        });
    });

    return that;
}
