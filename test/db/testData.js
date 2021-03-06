var MongoClient = require('mongodb').MongoClient;

/**
 * ユーザデータ
 */
var take = {
    userId : 'take',
    armdozerId : 'granBraver',
    pilotId : 'kyoko'
};

var uchi = {
    userId : 'uchi',
    armdozerId : 'landozer',
    pilotId : 'akane'
};

/**
 * アームドーザデータ
 */
var granBraver = {
    armdozerId : 'granBraver',
    name : 'グランブレイバー',
    pictName : 'GranBraver.PNG',
    hp : 3200,
    speed : 230,
    defense : 150,
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
        }
    }
};

var landozer = {
    armdozerId : 'landozer',
    name : 'ランドーザ',
    pictName : 'Landozer.PNG',
    hp : 4700,
    speed : 150,
    defense : 200,
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
};

//要素にcpuOnlyがある場合にCPU専用機となる
var zakoDozer = {
    armdozerId : 'zakoDozer',
    cpuOnly : true,
    name : 'ザコドーザ',
    pictName : 'Landozer.PNG',
    hp : 800,
    speed : 80,
    defense : 200,
    weapons : {
        1 : {
            name : 'バスターナックル',
            power : 600
        },
        2 : {
            name : 'バスターナックル',
            power : 600
        },
        3 : {
            name : 'バスターナックル',
            power : 600
        },
        4 : {
            name : 'バスターナックル',
            power : 600
        },
        5 : {
            name : 'バスターナックル',
            power : 600
        }
    }
};

/**
 * パイロットデータ
 */
var kyoko = {
    id : 'kyoko',
    name : '恭子',
    pict : 'kyoko.png',
    shout : 'やぁぁぁぁて、やるぜ！！    ……なんてね。',
    type : 'quickCharge',
    battery : 3,
    hp : 100,
    power : 100,
    defense : -50,
    speed : 100
};

var akane = {
    id : 'akane',
    name: '茜',
    pict: 'akane.png',
    shout: 'まだまだ、勝負はこれからよ。',
    type : 'recoverHp',
    value : 0.5,
    hp : 0,
    power : 0,
    defense : 0,
    speed : 0
};

var iori = {
    id : 'iori',
    name : '伊織',
    pict : 'iori.png',
    shout : 'この一撃に、全てを掛ける！！',
    type : 'quickCharge',
    battery : 3,
    hp : 0,
    power : 0,
    defense : 0,
    speed : 0
};

/**
 * ステージデータ
 * */
var stage1 = {
    title : '初級',
    enemyId : 'landozer',
    routineId : 'attack3'
};

var stage2 = {
    title : '中級',
    enemyId : 'granBraver',
    routineId : 'attack3'
};

var stage3 = {
    title : '上級',
    enemyId : 'zeroBraver',
    routineId : 'attack3'
};

/**
 * シナリオデータ
 */
var mesTest = {
    id : 'mesTest',
    data :     [
        {
            method : 'mes',
            param :
            '春日野高校の恭子よ<br>'+
            'アームドーザの操縦には、結構自信があるんだ<br>'+
            'お互いにベストを尽くしましょう'
        },
        {
            method : 'mes',
            param :
            'でかい口叩けるのも、今のうちよ<br>'+
            '私のランドーザが最強なんだから'
        }
    ]
};

var pilotLeftTest = {
    id : 'pilotLeftTest',
    data :    [
        {
            method : 'pilot',
            param : {
                id : 'kyoko',
                dir : 'left'
            }
        }
    ]
};

var userData = [take,uchi];
var armdozerData = [granBraver,landozer,zakoDozer];
var pilotData = [kyoko,akane,iori];
var stageData = [stage1,stage2,stage3];
var scenarioData = [mesTest, pilotLeftTest];

function insertData(mongoUrl,fnc) {
    MongoClient.connect(mongoUrl, function(err, db) {
        insertUserData(userData,db,function(err,result){
            insertArmdozerData(armdozerData,db,function(err,result){
                insertPilotData(pilotData,db,function(err,result){
                    insertStageData(stageData,db,function(err,result){
                        insertScenarioData(scenarioData,db,function(err,result){
                            db.close();
                            fnc(null,true);
                        });
                    });
                });
            });
        });
    });
}

function insertUserData(userData,db,fnc) {
    var collection = db.collection('users');
    collection.remove({}, {}, function(err, deletes) {
        collection.insert(userData, function(err, data) {
            fnc(null, true);
        });
    });
}

function insertArmdozerData(armdozerData,db,fnc) {
    var collection = db.collection('armdozers');
    collection.remove({}, {}, function(err, deletes) {
        collection.insert(armdozerData, function(err, data) {
            fnc(null, true);
        });
    });
}

function insertPilotData(pilotData,db,fnc) {
    var collection = db.collection('pilots');
    collection.remove({}, {}, function(err, deletes) {
        collection.insert(pilotData, function(err, data) {
            fnc(null, true);
        });
    });
}

function insertStageData(stageData,db,fnc){
    var collection = db.collection('stages');
    collection.remove({}, {}, function(err, deletes) {
        collection.insert(stageData, function(err, data) {
            fnc(null, true);
        });
    });
}

function insertScenarioData(scenarioData,db,fnc){
    var collection = db.collection('scenarios');
    collection.remove({}, {}, function(err, deletes) {
        collection.insert(scenarioData, function(err, data) {
            fnc(null, true);
        });
    });
}

module.exports.insertData = insertData;