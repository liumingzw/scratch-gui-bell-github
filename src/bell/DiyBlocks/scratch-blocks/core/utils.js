export default function (Blockly) {

    Blockly.utils.IMAGE_PATH_DEV = './dist/mabot_star/bell/images/';
    Blockly.utils.IMAGE_PATH_IN_MABOT_STAR = './blockly/bell/images/';

    Blockly.utils.MEDIA_PATH_DEV = './dist/mabot_star/bell/media/';
    Blockly.utils.MEDIA_PATH_IN_MABOT_STAR = './blockly/media/';

    Blockly.utils.isMabotStarDev_ = function () {
        // FIXME: more intelligent way?
        return /\:[0-9]{4}\//.test(window.location.href);
    };

    Blockly.utils.getRuntimeImagePath = function (relativePath) {
        if (Blockly.utils.isCordova() || Blockly.utils.isMabotStarDev_()) {
            return Blockly.utils.IMAGE_PATH_IN_MABOT_STAR + relativePath;
        } else {
            return Blockly.utils.IMAGE_PATH_DEV + relativePath;
        }
    };

    Blockly.utils.getRuntimeMediaPath = function () {
        if (Blockly.utils.isCordova() || Blockly.utils.isMabotStarDev_()) {
            return Blockly.utils.MEDIA_PATH_IN_MABOT_STAR;
        } else {
            return Blockly.utils.MEDIA_PATH_DEV;
        }
    };

    Blockly.utils.isCordova = function () {
        return !!window.cordova;
    };

    /**
     * Removes the first occurrence of a particular value from an array.
     * @param {!Array} arr Array from which to remove
     *     value.
     * @param {*} obj Object to remove.
     * @return {boolean} True if an element was removed.
     * @package
     */
    Blockly.utils.arrayRemove = function (arr, obj) {
        var i = arr.indexOf(obj);
        if (i == -1) {
            return false;
        }
        arr.splice(i, 1);
        return true;
    };

    // 判断两个数组内容是否一样,可以顺序不一样
    Blockly.utils.arrayEqualsIgnoreOrder = function (arr1, arr2) {
        if (!arr1 && !arr2) return true;
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length) return false;
        arr1 = arr1.sort(function (a, b) { return a - b; });
        arr2 = arr2.sort(function (a, b) { return a - b; });

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };

}