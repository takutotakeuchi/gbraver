enchant();
var gbraverDebug = {};
var assert;
gbraverDebug.statusArray = {
    2 : {
        name : 'ランドーザ',
        pictName : 'Landozer.PNG',
        hp : 4700,
        speed : 150,
        weapons : {
            1 : {
                name : 'ブレイクパンチ',
                power : 1200
            },
            2 : {
                name : 'ブレイクパンチ',
                power : 1700
            },
            3 : {
                name : 'ブレイクパンチ',
                power : 2300
            },
            4 : {
                name : 'ブレイクパンチ',
                power : 2900
            },
            5 : {
                name : 'ブレイクパンチ',
                power : 3800
            }
        }
    },
    1 : {
        name : 'グランブレイバー',
        pictName : 'GranBraver.PNG',
        hp : 3200,
        speed : 250,
        active : 0,
        battery : 5,
        weapons : {
            1 : {
                name : 'バスターナックル',
                power : 800
            },
            2 : {
                name : 'バスターナックル',
                power : 1100
            },
            3 : {
                name : 'バスターナックル',
                power : 1600
            },
            4 : {
                name : 'バスターナックル',
                power : 2100
            },
            5 : {
                name : 'バスターナックル',
                power : 2800
            },
        }
    }
};

window.onload = function() {
    assert = chai.assert;
    firstTurnPlayerCharge_asFirstTurnplayer();
    //firstTurnPlayerCharge_asSecondTurnplayer();
    //firstPlayerAtack();
};

/**
 * 先攻プレイヤーがチャージを選択する　＃先攻プレイヤー
 */
function firstTurnPlayerCharge_asFirstTurnplayer() {
    var Game = game({
        statusArray : gbraverDebug.statusArray,
        userId : '1'
    });
    Game.start();
    Game.onReady(function() {
        var waitPhaseData = {
            phase : 'wait',
            atackUserId : '1',
            turn : 20,
            statusArray : {
                2 : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                },
                1 : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                }
            }
        };
        Game.doWaitPhase(waitPhaseData);
        Game.onCommand(function(command) {
            var expect = {
                method : 'ok'
            };
            assert.deepEqual(command,expect,'ウェイトフェイズ終了時のコマンド送信が正しい');
            
            var data = {
                phase : 'atackCommand',
                statusArray : {
                    1 : {
                        hp : 3200,
                        battery : 5,
                        active : 5000
                    },
                    2 : {
                        hp : 4700,
                        battery : 5,
                        active : 3000
                    }
                }
            };
            Game.doAtackCommandPhase(data);
            console.log('チャージを選択');
            Game.onCommand(function(command) {
                var expect = {
                    method : 'charge'
                };
                assert.deepEqual(command,expect,'チャージ選択時のコマンド送信が正しい');
                
                var data = {
                    phase : 'charge',
                    statusArray : {
                        1 : {
                            hp : 3200,
                            battery : 5,
                            active : 0
                        },
                        2 : {
                            hp : 4700,
                            battery : 5,
                            active : 3000
                        }
                    }
                };
                Game.doChargePhase(data);
                Game.onCommand(function(command) {
                    var expect = {
                        method : 'ok'
                    };
                    assert.deepEqual(command,expect,'チャージ終了時のコマンド送信が正しい');
                    console.log('finish');
                });
            });
        });
    });
}

/**
 * 先攻プレイヤーがチャージを選択する　＃後攻プレイヤー視点
 */
function firstTurnPlayerCharge_asSecondTurnplayer() {
    var Game = game({
        statusArray : gbraverDebug.statusArray,
        userId : '2'
    });
    Game.start();
    Game.onReady(function() {
        var waitPhaseData = {
            phase : 'wait',
            atackUserId : '1',
            turn : 20,
            statusArray : {
                2 : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                },
                1 : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                }
            }
        };
        Game.doWaitPhase(waitPhaseData);
        Game.onCommand(function(command) {
            console.log(command);
            var data = {
                phase : 'atackCommand',
                statusArray : {
                    1 : {
                        hp : 3200,
                        battery : 5,
                        active : 5000
                    },
                    2 : {
                        hp : 4700,
                        battery : 5,
                        active : 3000
                    }
                }
            };
            Game.doAtackCommandPhase(data);
            Game.onCommand(function(command) {
                console.log(command);
                var data = {
                    phase : 'charge',
                    statusArray : {
                        1 : {
                            hp : 3200,
                            battery : 5,
                            active : 0
                        },
                        2 : {
                            hp : 4700,
                            battery : 5,
                            active : 3000
                        }
                    }
                };
                Game.doChargePhase(data);
                Game.onCommand(function(command) {
                    console.log(command);
                });
            });
        });
    });
}

function firstPlayerAtack(){
    var Game = game({
        statusArray : gbraverDebug.statusArray,
        userId : '1'
    });
    Game.start();
    Game.onReady(function() {
        var waitPhaseData = {
            phase : 'wait',
            atackUserId : '1',
            turn : 20,
            statusArray : {
                2 : {
                    hp : 4700,
                    battery : 5,
                    active : 3000
                },
                1 : {
                    hp : 3200,
                    battery : 5,
                    active : 5000
                }
            }
        };
        Game.doWaitPhase(waitPhaseData);
        Game.onCommand(function(command) {
            console.log(command);
            var data = {
                phase : 'atackCommand',
                statusArray : {
                    1 : {
                        hp : 3200,
                        battery : 5,
                        active : 5000
                    },
                    2 : {
                        hp : 4700,
                        battery : 5,
                        active : 3000
                    }
                }
            };
            Game.doAtackCommandPhase(data);
            Game.onCommand(function(command){
                
            });
        });   
    });    
}