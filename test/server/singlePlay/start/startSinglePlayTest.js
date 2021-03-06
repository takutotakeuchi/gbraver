//TODO : socket.ioコネクション処理を1.0推奨の非同期方式にする
describe('一人用モード開始テスト', function () {
    var SERVER_PORT = process.env.PORT || 3000;
    var SERVER_URL = 'http://localhost:' + SERVER_PORT;

    var testEnemyRoutineDefine = require('./../../testData/testEnemyRoutineDefine.js');
    var assert = require('chai').assert;
    var io = require('socket.io-client');
    var http = require('http');
    var server = require('../../../server/server.js');
    var dbMock = require('./../../testData/dbMock.js')();

    var app;
    var testServer;
    var option = {
        'forceNew': true
    };

    beforeEach(function () {
        app = http.createServer().listen(SERVER_PORT);
        testServer = server({
            httpServer: app,
            dao: dbMock
        });
        testServer.onGetAttackRoutine(testEnemyRoutineDefine.getAttackRoutine);
        testServer.onGetDefenseRoutine(testEnemyRoutineDefine.getDefenseRoutine);
    });

    afterEach(function () {
        app.close();
    });


    it('一人モードを開始できる', function (done) {
        var client = io(SERVER_URL, option);
        client.on('connect', doAuth);

        function doAuth() {
            client.emit('auth', {
                userId: 'test001@gmail.com'
            });
            client.once('successAuth', startSinglePlay);
        }

        function startSinglePlay() {
            client.emit('startSinglePlay', {
                enemyId: 'landozer',
                pilotId : 'akane',
                routineId: 'zero'
            });
            client.once('gameStart', assertOfGameStart);
        }

        function assertOfGameStart(data) {
            var expect = {
                'test001@gmail.com': {
                    userId: 'test001@gmail.com',
                    status: {
                        name: 'グランブレイバー',
                        pictName: 'GranBraver.PNG',
                        active: 0,
                        battery: 5,
                        hp: 3200,
                        defense: 0,
                        speed: 500,
                        skillPoint: 1,
                        overHeatFlag : false,
                        specialPoint : 0,
                        weapons: {
                            1: {
                                name: 'バスターナックル',
                                power: 800
                            },
                            2: {
                                name: 'バスターナックル',
                                power: 1100
                            },
                            3: {
                                name: 'バスターナックル',
                                power: 1600
                            },
                            4: {
                                name: 'バスターナックル',
                                power: 2100
                            },
                            5: {
                                name: 'バスターナックル',
                                power: 2800
                            }
                        },
                        ability: {
                            type: 'none'
                        },
                        pilot: {
                            name : '恭子',
                            pict : 'kyoko.png',
                            shout : 'やぁぁぁぁて、やるぜ！！    ……なんてね。',
                            type : 'quickCharge',
                            battery : 3,
                            hp : 0,
                            power : 0,
                            defense : 0,
                            speed : 0
                        }
                    }
                },
                'nonePlayerCharacter': {
                    userId: 'nonePlayerCharacter',
                    status: {
                        name: 'ランドーザ',
                        pictName: 'Landozer.PNG',
                        hp: 4700,
                        defense: 0,
                        speed: 300,
                        active: 0,
                        battery: 5,
                        skillPoint: 1,
                        overHeatFlag : false,
                        specialPoint : 0,
                        weapons: {
                            1: {
                                name: 'ブレイクパンチ',
                                power: 1200
                            },
                            2: {
                                name: 'ブレイクパンチ',
                                power: 1700
                            },
                            3: {
                                name: 'ブレイクパンチ',
                                power: 2300
                            },
                            4: {
                                name: 'ブレイクパンチ',
                                power: 2900
                            },
                            5: {
                                name: 'ブレイクパンチ',
                                power: 3800
                            }
                        },
                        ability: {
                            type: 'none'
                        },
                        pilot: {
                            name: '茜',
                            pict: 'akane.png',
                            shout: 'まだまだ、勝負はこれからよ。',
                            type: 'recoverHp',
                            value: 0.5,
                            hp : 0,
                            power : 0,
                            defense : 0,
                            speed : 0
                        }
                    }
                }
            };
            assert.deepEqual(expect, data, 'gameStartのデータが正しい');
            done();
        }
    });
});