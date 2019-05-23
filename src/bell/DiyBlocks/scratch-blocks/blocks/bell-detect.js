export default function (Blockly) {
    // 触控球（1）的状态为 [按下,没按下]
    Blockly.Blocks['bell_detect_touch_press_state'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_TOUCH_PRESS_STATE,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "touch",
                },
                {
                    "type": "field_dropdown",
                    "name": "TOUCHPRESS",
                    "options": [
                        [Blockly.Msg.BELL_TOUCH_PRESS, 'LOUDNESS'],
                        [Blockly.Msg.BELL_TOUCH_NO_PRESS, 'TIMER']
                    ]
                }
                ],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_boolean"]
            });
        }
    };

    // 颜色传感器（1）[=] (color)
    Blockly.Blocks['bell_detect_color_equal_value'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_COLOR_EQUAL_VALUE,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "color",
                },
                {
                    "type": "field_dropdown",
                    "name": "TOUCHPRESS",
                    "options": [
                        ['=', 'LOUDNESS'],
                    ]
                },
                {
                    "type": "field_colourDialog",
                    "name": "COLOR",
                },
                ],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_boolean"]
            });
        }
    };

    // 红外传感器（1）[=] (cm)
    Blockly.Blocks['bell_detect_infrared_equal_cm'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_INFRARED_EQUAL_CM,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "infrared",
                },
                {
                    "type": "field_dropdown",
                    "name": "TOUCHPRESS",
                    "options": [
                        ['=', 'LOUDNESS'],
                    ]
                },
                {
                    "type": "field_disanceDialog",
                    "name": "SECONDS",
                    "defaultValue": "6",
                },
                ],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_boolean"]
            });
        }
    };

    // 陀螺仪的[俯仰角度,翻滚角度,旋转角度] [=>,=,<=][0,0,20]
    Blockly.Blocks['bell_detect_gyro_angle_value'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_GYRO_ANGLE_VALUE,
                "args0": [{
                    "type": "field_dropdown",
                    "name": "DISTANCE",
                    "options": [
                        [Blockly.Msg.BELL_ANGLE_OPTIONS_ONE, 'PITCH'],
                        [Blockly.Msg.BELL_ANGLE_OPTIONS_TWO, 'ROLL'],
                        [Blockly.Msg.BELL_ANGLE_OPTIONS_THREE, 'ROTATE']
                    ]
                },
                {
                    "type": "field_dropdown",
                    "name": "COMPUTE",
                    "options": [
                        ['=>', 'GREATER'],
                        ['=', 'EQUAL'],
                        ['<=', 'LESS']
                    ]
                },
                {
                    "type": "field_speedDialog",
                    "name": "POWER",
                    "defaultValue": "0",
                    "min": '0',
                    "max": '255'
                },
                ],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_boolean"]
            });
            // 动态改变field 
            this.setOnChange(function (event) {
                if (!event.blockId) return;
                if (event.blockId !== this.id) return;
                if (event.name == 'DISTANCE' && event.element == 'field') {
                    this.getField('POWER') ? this.getInput('').removeField('POWER') : '';
                    // [俯仰角度,翻滚角度] speedDialog
                    // 旋转角度 numberDialog
                    if (event.newValue == 'PITCH') {
                        var fieldDialog = new Blockly.FieldSpeedDialog(
                            '0',
                            0,
                            255
                        );
                        // index, field, opt_name
                        this.getInput('').insertFieldAt(
                            3,
                            fieldDialog,
                            'POWER'
                        );
                    } else if (event.newValue == 'ROLL') {
                        var fieldDialog = new Blockly.FieldSpeedDialog(
                            '0',
                            0,
                            180
                        );
                        // index, field, opt_name
                        this.getInput('').insertFieldAt(
                            3,
                            fieldDialog,
                            'POWER'
                        );
                    } else if (event.newValue == 'ROTATE') {
                        var fieldDialog = new Blockly.FieldNumberDialog(
                            '0'
                        );
                        // index, field, opt_name
                        this.getInput('').insertFieldAt(
                            3,
                            fieldDialog,
                            'POWER'
                        );
                    }
                }
            });
        }
    };


    // 获取颜色传感器（1） 的值
    Blockly.Blocks['bell_detect_get_color_value'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_GET_COLOR_VALUE,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "color",
                }],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_number"],
            });
        }
    };

    // 获取红外传感器（1） 的值
    Blockly.Blocks['bell_detect_get_infrared_value'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_GET_INFRARED_VALUE,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "infrared",
                }],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_number"],
            });
        }
    };

    // 获取陀螺仪（1） 的值
    Blockly.Blocks['bell_detect_get_gyro_value'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_DETECT_GET_GYRO_VALUE,
                "args0": [{
                    "type": "field_dialog",
                    "name": "MOTOR",
                    "defaultValue": "1",
                    "module": "motor",
                }],
                "category": Blockly.Categories.operators,
                "extensions": ["colours_operators", "output_number"],
            });
        }
    };
};