function turnTimer(spec,my){
    var core = enchant.Core.instance;
    var that = new Group();
    var turnCountNumber = null;
    var emitTimeOut = function(){};
    var sec = 0;
    var visible = true;

    (function(){
        spec ? null : spec = {};
        spec.pict = core.assets[core.PICT_DAMAGE];
        turnCountNumber = pictNumber(spec);
        that.addChild(turnCountNumber);
    })()

    that.startTurnCount = function(p_sec){
        sec = p_sec;
        turnCountNumber.setDamage(sec);
        turnCountNumber.tl.delay(40).then(tick).loop();
    }

    that.onTimeOut = function(fn){
        emitTimeOut = fn;
    }

    that.setVisible = function(value){
        turnCountNumber.setVisible(value);
        visible = value;
    }

    that.getVisible = function(){
        return visible;
    }

    function tick(){
        sec --;
        if(sec>=0 && visible){
            turnCountNumber.setDamage(sec);
        } else {
            emitTimeOut();
        }
    }


    return that;
}