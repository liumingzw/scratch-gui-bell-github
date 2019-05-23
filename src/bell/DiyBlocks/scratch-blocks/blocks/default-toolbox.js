export default function (Blockly) {
    Blockly.Blocks.defaultToolboxBell = {};
    Blockly.Blocks.defaultToolboxBell.overrideDefaultToolbox = function () {
        const dom = Blockly.Xml.textToDom(Blockly.Blocks.defaultToolbox);

        Blockly.Blocks.defaultToolboxBell.addBellCategories(dom);
        return Blockly.Xml.domToText(dom);
    };

    Blockly.Blocks.defaultToolboxBell.CATEGORIES = [
        // bell_detect TODO:
        '<category name="侦测" id="bell_detect" colour="#40bf4a" secondaryColour="#40bf4a">' +
            // 触控球（1）的状态为 [按下,没按下]
            '<block type="bell_detect_touch_press_state" id="bell_detect_touch_press_state">' +
            '</block>' +
            // 颜色传感器（1）[=] (color)
            '<block type="bell_detect_color_equal_value" id="bell_detect_color_equal_value">' +
            '</block>' +
            // 红外传感器（1）[=] (cm)
            '<block type="bell_detect_infrared_equal_cm" id="bell_detect_infrared_equal_cm">' +
            '</block>' +
            // 陀螺仪的[俯仰角度,翻滚角度,旋转角度] [=>,=,<=][0,0,20]
            '<block type="bell_detect_gyro_angle_value" id="bell_detect_gyro_angle_value">' +
            '</block>' +
            // 获取颜色传感器（1） 的值
            '<block type="bell_detect_get_color_value" id="bell_detect_get_color_value">' +
            '</block>' +
            // 获取红外传感器（1） 的值
            '<block type="bell_detect_get_infrared_value" id="bell_detect_get_infrared_value">' +
            '</block>' +
            // 获取陀螺仪（1） 的值
            '<block type="bell_detect_get_gyro_value" id="bell_detect_get_gyro_value">' +
            '</block>' +
        '</category>',
    ];

    Blockly.Blocks.defaultToolboxBell.addBellCategories = function (parentDom) {
        for (var i = 0, category; category = Blockly.Blocks.defaultToolboxBell.CATEGORIES[i]; i++) {
            category = '<xml>' + category + '</xml>';
            // parentDom.appendChild(Blockly.Xml.textToDom(category).firstChild);

            parentDom.insertBefore(Blockly.Xml.textToDom(category).firstChild,
                parentDom.lastChild);
        }
    };

    Blockly.Blocks.defaultToolbox =
        Blockly.Blocks.defaultToolboxBell.overrideDefaultToolbox();
}