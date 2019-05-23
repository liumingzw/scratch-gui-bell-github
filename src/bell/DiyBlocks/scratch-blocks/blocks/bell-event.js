export default function (Blockly) {
    // 接收消息 msg
    Blockly.Blocks['bell_event_get_msg'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_GET_MSG,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "VALUE",
                    }
                ],
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_hat"]
            });
        }
    };

    // 发送消息 msg
    Blockly.Blocks['bell_event_send_msg'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_SEND_MSG,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "VALUE",
                    }
                ],
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_statement"]
            });
        }
    };

    // 当触控球（1）的状态为 [按下，没按下]
    Blockly.Blocks['bell_event_touch_press'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_TOUCH_PRESS,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "touch",
                        "multiMode": false,
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
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_hat"]
            });
        }
    }

    // 当红外传感器（1） [=>,=,<=] 距离 [0,0,20]
    Blockly.Blocks['bell_event_infrared_cm'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_INFRARED_CM,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "infrared",
                        "multiMode": false,
                    },
                    {
                        "type": "field_dropdown",
                        "name": "DISTANCE",
                        "options": [
                            ['=>', 'LOUDNESS'],
                            ['=', 'TIMER'],
                            ['<=', 'TIMER']
                        ]
                    },
                    {
                        "type": "field_disanceDialog",
                        "name": "SECONDS",
                        "defaultValue": "6",
                    },
                ],
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_hat"]
            });
        }
    }

    // 当陀螺仪的[俯仰角度,翻滚角度,旋转角度] [=>,=,<=][0,0,20]
    Blockly.Blocks['bell_event_gyro_cm'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_GYRO_CM,
                "args0": [
                    {
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
                        "name": "TOUCHPRESS",
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
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_hat"]
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
    }

    // 当颜色传感器（1） [=>,=,<=] (1)
    Blockly.Blocks['bell_event_color_type'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_EVENT_COLOR_TYPE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "color",
                        "multiMode": false,
                    },
                    {
                        "type": "field_dropdown",
                        "name": "DISTANCE",
                        "options": [
                            ['=', 'TIMER'],
                        ]
                    },
                    {
                        "type": "field_colourDialog",
                        "name": "COLOR",
                    },
                ],
                "category": Blockly.Categories.event,
                "extensions": ["colours_event", "shape_hat"]
            });
        }
    }
}