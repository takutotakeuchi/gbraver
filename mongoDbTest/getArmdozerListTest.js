var assert = require('chai').assert;
var mongoDao = require('../mongoDao.js');
var insertData = require('./testData.js').insertData;
var MongoClient = require('mongodb').MongoClient;

describe('Mongo DBからアームドーザリストを取得する', function() {
    const mongoUrl = 'mongodb://localhost/gbraverTest';

    before(function(done) {
        insertData(mongoUrl, function(err, result) {
            done();
        });
    });

    it('キャラクターリストを取得することができる',function(done){
        var dao = mongoDao({
            url : mongoUrl
        });
        dao.getArmdozerList(function(err,armdozerList){
            var expect = [
                {
                    armdozerId : 'granBraver',
                    name : 'グランブレイバー',
                    pictName : 'GranBraver.PNG',
                    hp : 3200,
                    speed : 230,
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
                },
                {
                    armdozerId : 'landozer',
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
                }

            ];
            assert.deepEqual(armdozerList,expect,'アームドーザリストが正しく取得できる');
            done();
        });
    });
});