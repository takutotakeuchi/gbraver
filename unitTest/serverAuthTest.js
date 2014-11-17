describe('serverクラスのテスト', function() {
    var SERVER_PORT = process.env.PORT || 3000;
    var SERVER_URL = 'http://localhost:'+SERVER_PORT;

    var assert = require('chai').assert;
    var io = require('socket.io-client');
    var server = require('../server.js');
    var dbMock = require('./dbMock.js')();

    var app;
    var option;
    var Server;
    var dbMockInst;
    
    beforeEach(function(){
        option = {
            'forceNew' : true
        };
        app = require('http').createServer().listen(SERVER_PORT);
        Server = server({
            httpServer : app,
            dao : dbMock
        });
    });
    
    afterEach(function() {
        app.close();
    });
    
    describe('認証系テスト',function(){
        it('存在するユーザなので認証に成功する',function(done){
            var client = io(SERVER_URL, option);
            client.on('connect',function(){
                client.emit('auth', {
                    userId : 'test001@gmail.com'
                });
                client.on('successAuth', function(data) {
                    var expect = {
                        armdozerId : 'granBraver',
                        pilotId : 'kyoko'
                    };
                    assert.deepEqual(data,expect,'選択しているアームドーザの画像名が正しい');
                    done();
                });
            });
        });
    });
}); 