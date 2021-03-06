var gridWindow = require('../window/gridWindow');

module.exports = function(spec,my){
    var COLOR_WHITE = '#FFFFFF';
    var GRID_WIDTH = 9;
    var GRID_HEIGHT = 2;

    var that = new Group();
    var core = enchant.Core.instance;
    var pict = spec.pict;
    var subPict = spec.subPict;
    var stageNo = spec.stageNo;
    var stageTitle = spec.stageTitle;
    var baseWindow = gridWindow({
        pict : pict,
        width : GRID_WIDTH,
        height : GRID_HEIGHT,
        spriteWidth : 32,
        spriteHeight : 32
    });
    var stageNoLabel = new Label();
    var stageTitleLabel = new Label();
    var visible = true;

    init();
    function init(){
        //ベースウインドウ
        that.addChild(baseWindow);

        //ステージNo
        stageNoLabel.text = 'STAGE '+stageNo;
        stageNoLabel.color = COLOR_WHITE;
        stageNoLabel.x = 12;
        stageNoLabel.y = 12;
        that.addChild(stageNoLabel);

        //ステージタイトル
        stageTitleLabel.text = stageTitle;
        stageTitleLabel.color = COLOR_WHITE;
        stageTitleLabel.x = 12;
        stageTitleLabel.y = 32;
        that.addChild(stageTitleLabel);
    }

    that.addEventListener(Event.TOUCH_START,function(){
        baseWindow.setPict(subPict);
        core.assets[core.SOUND_PUSH_BUTTON].play();
    });

    that.addEventListener(Event.TOUCH_END,function(){
        baseWindow.setPict(pict);
    });

    that.setVisible = function(value){
        baseWindow.setVisible(value);
        stageNoLabel.visible = value;
        stageTitleLabel.visible = value;
        visible = value;
    }

    that.getVisible = function(){
        return visible;
    }

    return that;
}