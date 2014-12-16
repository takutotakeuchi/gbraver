function gameBase(spec,my){
    var core = new Core(320, 480);
    core.PICT_PREFIX = location.origin + '/images/';
    core.PICT_ACTIVE_BAR = core.PICT_PREFIX+'activeBar.png';
    core.PICT_ACTIVE_BAR_BACK = core.PICT_PREFIX+'activeBack.png';
    core.PICT_BATTERY_GAUGE = core.PICT_PREFIX+'batteryGauge.png';
    core.PICT_BATTERY_BACK = core.PICT_PREFIX+'batteryBack.png';
    core.PICT_BATTERY_NUMBER = core.PICT_PREFIX+'batteryNumber.png';
    core.PICT_ATTTACK_PARTICLE = core.PICT_PREFIX+'attackParticle.png';
    core.PICT_HIT_EFFECT = core.PICT_PREFIX+'hitEffect.png';
    core.PICT_DAMAGE = core.PICT_PREFIX+'damage.png';
    core.PICT_HIT_TEXT = core.PICT_PREFIX+'hitText.png';
    core.PICT_BG_GROUND = core.PICT_PREFIX+'bgGround.png';
    core.PICT_BG_GROUND2 = core.PICT_PREFIX+'bgGround2.png';
    core.PICT_WINDOW = core.PICT_PREFIX+'window.png';
    core.PICT_ACTIVE_WINDOW = core.PICT_PREFIX+'activeWindow.png';
    core.PICT_BLACK_WINDOW = core.PICT_PREFIX+'blackWindow.png';
    core.PICT_COMMAND_WINDOW = core.PICT_PREFIX+'commandWindow.png';
    core.PICT_WIN = core.PICT_PREFIX+'win.png';
    core.PICT_LOSE = core.PICT_PREFIX+'lose.png';
    core.SOUND_PREFIX = '/sound/';
    core.SOUND_BATTLE = core.SOUND_PREFIX + 'hsd.mp3';
    core.WAIT_TIME_ACTIVE_RESET = 30;
    core.ICON_WIDTH = 124;
    core.ICON_HEIGHT = 40;
    core.COMMAND_POS_Y = 300;
    core.FRAME_STAND = 0;
    core.FRAME_ATTACK = 1;
    core.FRAME_DAMAGE = 2;
    core.ATACK_HIT = 1;
    core.ATACK_MISS = 2;
    core.ATACK_GUARD = 3;
    core.ATACK_CRITICAL = 4;
    core.SYSTEM_BG_WIDTH = 320;
    core.SYSTEM_BG_HEIGHT = 480;
    core.BUTTON_WIDTH = 96;
    core.BUTTON_HEIGHT = 24;
    core.MESSAGE_WAIT_COMMUNICATE = '通信待機中';
    core.MESSAGE_WAIT_ENTERROOM = 'プレイヤーの入室待ち';
    core.MESSAGE_WAIT_COMMAND = '対戦相手がコマンドを選択中......';
    core.MESSAGE_GET_ROOMINFO = 'ルーム情報取得中';
    core.MESSAGE_WINDOW_Y = 276;

    core.fps = 40;
    core.battleScene = null;
    core.roomSelectScene = null;
    core.setArmdozerScene = null;
    preLoad();

    function preLoad() {
        core.preload(core.PICT_PREFIX+'GranBraver.PNG');
        core.preload(core.PICT_PREFIX+'Landozer.PNG');
        core.preload(core.PICT_PREFIX+'ZeroBraver.PNG');
        core.preload(core.PICT_PREFIX+'kyoko.png');
        core.preload(core.PICT_PREFIX+'akane.png');
        core.preload(core.PICT_PREFIX+'iori.png');
        core.preload(core.PICT_ACTIVE_BAR);
        core.preload(core.PICT_ACTIVE_BAR_BACK);
        core.preload(core.PICT_BATTERY_GAUGE);
        core.preload(core.PICT_BATTERY_BACK);
        core.preload(core.PICT_BATTERY_NUMBER);
        core.preload(core.PICT_ATTTACK_PARTICLE);
        core.preload(core.PICT_HIT_EFFECT);
        core.preload(core.PICT_DAMAGE);
        core.preload(core.PICT_HIT_TEXT);
        core.preload(core.PICT_BG_GROUND);
        core.preload(core.PICT_BG_GROUND2);
        core.preload(core.PICT_WINDOW);
        core.preload(core.PICT_ACTIVE_WINDOW);
        core.preload(core.PICT_BLACK_WINDOW);
        core.preload(core.PICT_COMMAND_WINDOW);
        core.preload(core.PICT_WIN);
        core.preload(core.PICT_LOSE);

        core.preload(core.SOUND_BATTLE);
    }
    return core;
}