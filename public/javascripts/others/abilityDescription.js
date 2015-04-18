function getArmdozerAbilityDescription(ability){
    var ret = 'アームドーザアビリティ';
    switch(ability.type){
        case 'boostBattery':
            ret = 'バッテリーが'+ability.battery+'回復';
            break;
        case 'boostActive':
            ret = 'アクティブゲージが' + ability.active*100 +'%増加する';
            break;
        case 'boostPower':
            ret = '攻撃が'+ability.power+'増加する';
            break;
    }
    return ret;
}

function getArmdozerAbilityTrigger(ability) {
    var ret = 'アビリティ発動条件';
    switch(ability.type){
        case 'boostBattery':
        case 'boostActive':
        case 'boostPower':
            ret = 'HPが'+ability.threshold*100+'%以下';
            break;
    }
    return ret;
}