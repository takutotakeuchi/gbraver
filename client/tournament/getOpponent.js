import isTournamentBlock from './isTournamentBlock';
import compressionBlock from './compressionBlock';

// TODO テストを書く
/**
 * 指定したパイロットIDが含まれる戦闘ブロックを返す
 *
 * @param data トーナメントデータ
 * @param id パイロットID
 * @returns {Object} トーナメントブロック
 */
function getBLockById(data, id) {
    if (!isTournamentBlock(data)) {
        return null;
    }

    if (data.left.id === id || data.right.id === id) {
        return data;
    }

    let left = getBLockById(data.left, id);
    if(left) {
        return left;
    }

    let right = getBLockById(data.right, id);
    if(right) {
        return right;
    }

    return null;
}

/**
 * 対戦相手を取得する
 * 
 * @param data トーナメントデータ
 * @param id プレイヤーID
 * @returns {Object} 対戦相手のデータ
 */
export default function getOpponent(data, id) {
    let collectData = compressionBlock(data);
    let targetBlock = getBLockById(collectData, id);
    if (!targetBlock) {
        return null;
    }

    return targetBlock.left.id === id ? targetBlock.right : targetBlock.left;
}