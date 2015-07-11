function pictNumber(spec,my){
    var that = new Group();
    var MAX_NUMBER_SPRITE = 6;
    var SPRITE_WIDTH = spec.width || 32;
    var SPRITE_HEIGHT = spec.height || 32;
    var pict = spec.pict;
    var numberSpriteArray = new Array(MAX_NUMBER_SPRITE);

    init();
    function init(){
        for(var i=0; i<MAX_NUMBER_SPRITE; i++){
            numberSpriteArray[i] = new Sprite(SPRITE_WIDTH,SPRITE_HEIGHT);
            numberSpriteArray[i].x = i*32;
            numberSpriteArray[i].image = pict;
            that.addChild(numberSpriteArray[i]);
        }
    }

    //TODO メソッド名をsetValuに変更する
    that.setDamage = function(damage){
        var damageStr = damage.toString();
        var digits = damageStr.length;
        var i=0;

        for(;i<MAX_NUMBER_SPRITE; i++){
            if(i<digits){
                numberSpriteArray[i].visible = true;
                numberSpriteArray[i].x = -SPRITE_WIDTH*digits/2 + SPRITE_WIDTH*i;
                numberSpriteArray[i].frame = damageStr.substr(i,1);
            } else {
                numberSpriteArray[i].visible = false;
            }
        }
    }

    that.setVisible = function(visible){
        for(var i=0; i<MAX_NUMBER_SPRITE; i++){
            numberSpriteArray[i].visible = visible;
        }
    }

    return that;
}