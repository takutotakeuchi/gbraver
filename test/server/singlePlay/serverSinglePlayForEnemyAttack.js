//TODO : socket.ioコネクション処理を1.0推奨の非同期方式にする
describe('serverクラスのテスト', function() {
    var SERVER_PORT = process.env.PORT || 3000;
    var SERVER_URL = 'http://localhost:'+SERVER_PORT;

    var testEnemyRoutineDefine = require('./../testData/testEnemyRoutineDefine.js');
    var assert = require('chai').assert;
    var io = require('socket.io-client');
    var http = require('http');
    var server = require('../../../server/server.js');
    var dbMock = require('./../testData/dbMock.js')();

    var app;
    var testServer;
    var option = {
        'forceNew' : true
    };

    beforeEach(function() {
        app = http.createServer().listen(SERVER_PORT);
        testServer = server({
            httpServer : app,
            dao : dbMock
        });
        testServer.onGetAttackRoutine(testEnemyRoutineDefine.getAttackRoutine);
        testServer.onGetDefenseRoutine(testEnemyRoutineDefine.getDefenseRoutine);
    });

    afterEach(function() {
        app.close();
    });

    describe(' 一人用モード戦闘',function(){
        it('敵が攻撃する',function(done){
            var client = io(SERVER_URL, option);
            client.on('connect',doAuth);

            function doAuth() {
                client.emit('auth',{
                    userId : 'test002@gmail.com'
                });
                client.once('successAuth',startSinglePlay);
            }

            function startSinglePlay() {
                client.emit('startSinglePlay',{
                    enemyId : 'granBraver',
                    pilotId : 'kyoko',
                    routineId : 'zero'
                });
                client.once('gameStart',gameStart);
            }

            function gameStart(){
                client.emit('command',{
                    method : 'ready'
                });
                client.once('resp',waitPhase);
            }

            function waitPhase(data){
                var expect = {
                    phase : 'wait',
                    atackUserId : 'nonePlayerCharacter',
                    turn : 10,
                    statusArray : {
                        'nonePlayerCharacter' : {
                            hp : 3200,
                            battery : 5,
                            active : 5000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        },
                        'test002@gmail.com' : {
                            hp : 4700,
                            battery : 5,
                            active : 3000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        }
                    }
                };
                assert.deepEqual(data,expect,'ウェイトフェイズの情報が正しい');
                sendWaitPhaseCommand();
            }

            function sendWaitPhaseCommand(){
                client.emit('command',{
                    method : 'ok'
                });
                client.once('resp',attackCommandPhase);
            }

            function attackCommandPhase(data) {
                var expect = {
                    phase : 'atackCommand',
                    statusArray : {
                        'nonePlayerCharacter' : {
                            hp : 3200,
                            battery : 5,
                            active : 5000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        },
                        'test002@gmail.com' : {
                            hp : 4700,
                            battery : 5,
                            active : 3000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        }
                    }
                };
                assert.deepEqual(expect,data,'アタックフェイズのデータが正しい');
                sendAtacckCommand();
            }

            function sendAtacckCommand() {
                client.emit('command',{
                    method : 'ok'
                });
                client.once('resp',defenseCommandPhase);
            }

            function defenseCommandPhase(data){
                var expect = {
                    phase : 'defenthCommand',
                    statusArray : {
                        'nonePlayerCharacter' : {
                            hp : 3200,
                            battery : 5,
                            active : 5000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        },
                        'test002@gmail.com' : {
                            hp : 4700,
                            battery : 5,
                            active : 3000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        }
                    }
                };
                assert.deepEqual(data,expect,'ディフェンスコマンドフェイズのデータが正しい');
                sendDefenseCommand();
            }

            function sendDefenseCommand(){
                client.emit('command',{
                    method : 'defenth',
                    param : {
                        battery : 2
                    }
                });
                client.once('resp',damagePhase);
            }

            function damagePhase(data){
                var expect = {
                    phase : 'damage',
                    hit : 2,
                    damage : 0,
                    atackBattery : 0,
                    defenthBattery : 2,
                    statusArray : {
                        'nonePlayerCharacter' : {
                            hp : 3200,
                            battery : 5,
                            active : 0,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        },
                        'test002@gmail.com' : {
                            hp : 4700,
                            battery : 3,
                            active : 3000,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        }
                    }
                };
                assert.deepEqual(data,expect,'ダメージフェイズのデータが正しい');
                sendDamagePhaseCommand();
            }

            function sendDamagePhaseCommand(){
                client.emit('command',{
                    method : 'ok'
                });
                client.once('resp',waitPhase2);
            }

            function waitPhase2(data){
                var expect = {
                    phase : 'wait',
                    atackUserId : 'test002@gmail.com',
                    turn : 7,
                    statusArray : {
                        'nonePlayerCharacter' : {
                            hp : 3200,
                            battery : 5,
                            active : 3500,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        },
                        'test002@gmail.com' : {
                            hp : 4700,
                            battery : 4,
                            active : 5100,
                            skillPoint : 1,
                            overHeatFlag : false,
                            specialPoint : 0
                        }
                    }
                };
                assert.deepEqual(data,expect,'2回目ウェイトフェイズのデータが正しい');
                done();
            }

        });
    });
});