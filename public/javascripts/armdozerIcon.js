function armdozerIcon(spec,my){
    var that = new Group();
    var windowPict = spec.windowPict;
    var armdozerPict = spec.armdozerPict;
    var visible = true;
    var armdozerButton = {};
    var miniPilot = {};

    init();
    function init(){
        armdozerButton = gridWindow({
            pict : windowPict,
            width : 5,
            height : 5
        });
        that.addChild(armdozerButton);

        miniPilot = new Sprite(80,80);
        miniPilot.image = createFaceIcon(armdozerPict);
        that.addChild(miniPilot);
    }

    that.getVisible = function(){
        return visible;
    }

    that.setVisible = function(value){
        visible = value;
        armdozerButton.setVisible(value);
        miniPilot.visible = value;
    }

    function createFaceIcon(image) {
        var widthMargin = 48;
        var size = 64;
        var faceIcon = new Surface(80,80);
        faceIcon.draw(image,widthMargin,0,size,size,6,6,68,68);
        return faceIcon;
    }

    return that;
}