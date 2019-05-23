export default function (Blockly) {
    // 设置 主控驱动球(1) 灯光颜色为 [颜色],  模式为[呼吸,渐变,变化]
    Blockly.Blocks['bell_light_color_mode'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_COLOR_MODE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "CENTER",
                        "options": [
                            [Blockly.Msg.BELL_MAIN_BALL, '1'],
                            [Blockly.Msg.BELL_DRIVE_BALL, '2']
                        ]
                    },
                    {
                        "type": "field_colourDialog",
                        "name": "COLOR",
                        "colour": ['#000000', '#0050dc', '#78fa00', '#ffff00', '#ff1428', '#ffffff', '#c81eff', '#ff9800'],
                    },
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": [
                            [Blockly.Msg.BELL_BALL_BREATHE_MODE, '1'],
                            [Blockly.Msg.BELL_BALL_SHADOW_MODE, '2']
                        ]
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
            // 动态改变field 
            this.setOnChange(function (event) {
                if (!event.blockId) return;
                if (event.blockId !== this.id) return;
                if (event.name == 'CENTER' && event.element == 'field') {
                    if (parseInt(event.newValue) === 2) {
                        if (!this.getField('MOTOR')) {
                            var fieldDialog = new Blockly.FieldModuleDialog(
                                '1',
                                Blockly.FieldModuleDialog.MODULE_MOTOR,
                                true
                            );
                            // index, field, opt_name
                            this.getInput('').insertFieldAt(
                                2,
                                fieldDialog,
                                'MOTOR'
                            );
                        }
                    } else {
                        this.getField('MOTOR') ? this.getInput('').removeField('MOTOR') : '';
                    }
                }
            });
        }
    }

    // 设置 主控驱动球(1) （1）  灯光颜色为 [颜色],  模式为[呼吸,渐变,变化], 持续（2）秒, 是否阻断
    Blockly.Blocks['bell_light_color_mode_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_COLOR_MODE_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "CENTER",
                        "options": [
                            [Blockly.Msg.BELL_MAIN_BALL, '1'],
                            [Blockly.Msg.BELL_DRIVE_BALL, '2']
                        ]
                    },
                    {
                        "type": "field_colourDialog",
                        "name": "COLOR",
                    },
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": [
                            [Blockly.Msg.BELL_BALL_BREATHE_MODE, '1'],
                            [Blockly.Msg.BELL_BALL_SHADOW_MODE, '2']
                        ]
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "SECONDS",
                        "defaultValue": "1",
                    },
                    {
                        "type": "field_clockwise_image",
                        "name": "BLOCK",
                        "src": require('../../static/images/blk_ic_blocked.png'),
                        "width": 24,
                        "height": 24,
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
            this.setOnChange(function (event) {
                if (!event.blockId) return;
                if (event.blockId !== this.id) return;
                if (event.name == 'CENTER' && event.element == 'field') {
                    if (parseInt(event.newValue) === 2) {
                        if (!this.getField('MOTOR')) {
                            var fieldDialog = new Blockly.FieldModuleDialog(
                                '1',
                                Blockly.FieldModuleDialog.MODULE_MOTOR,
                                true
                            );
                            // index, field, opt_name
                            this.getInput('').insertFieldAt(
                                2,
                                fieldDialog,
                                'MOTOR'
                            );
                        }
                    } else {
                        this.getField('MOTOR') ? this.getInput('').removeField('MOTOR') : '';
                    }
                }
            });
        }
    }

    // 设置 主控驱动球(1) 灯光颜色为 [R][G][B],  模式为[呼吸,渐变,变化]
    Blockly.Blocks['bell_light_color_rgb'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_COLOR_RGB,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "CENTER",
                        "options": [
                            [Blockly.Msg.BELL_MAIN_BALL, '1'],
                            [Blockly.Msg.BELL_DRIVE_BALL, '2']
                        ]
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_R",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_G",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_B",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": [
                            [Blockly.Msg.BELL_BALL_BREATHE_MODE, '1'],
                            [Blockly.Msg.BELL_BALL_SHADOW_MODE, '2']
                        ]
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
            this.setOnChange(function (event) {
                if (!event.blockId) return;
                if (event.blockId !== this.id) return;
                if (event.name == 'CENTER' && event.element == 'field') {
                    if (parseInt(event.newValue) === 2) {
                        if (!this.getField('MOTOR')) {
                            var fieldDialog = new Blockly.FieldModuleDialog(
                                '1',
                                Blockly.FieldModuleDialog.MODULE_MOTOR,
                                true
                            );
                            // index, field, opt_name
                            this.getInput('').insertFieldAt(
                                2,
                                fieldDialog,
                                'MOTOR'
                            );
                        }
                    } else {
                        this.getField('MOTOR') ? this.getInput('').removeField('MOTOR') : '';
                    }
                }
            });
        }
    }

    // 设置 主控驱动球(1) 灯光颜色为 [R][G][B],  模式为[呼吸,渐变,变化], 持续（2）秒, 是否阻断
    Blockly.Blocks['bell_light_color_rgb_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_COLOR_RGB_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "CENTER",
                        "options": [
                            [Blockly.Msg.BELL_MAIN_BALL, '1'],
                            [Blockly.Msg.BELL_DRIVE_BALL, '2']
                        ]
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_R",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_G",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "COLOR_B",
                        "defaultValue": "0",
                        "min": '0',
                        "max": '255'
                    },
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": [
                            [Blockly.Msg.BELL_BALL_BREATHE_MODE, '1'],
                            [Blockly.Msg.BELL_BALL_SHADOW_MODE, '2']
                        ]
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "COLOR",
                        "defaultValue": "1",
                    },
                    {
                        "type": "field_clockwise_image",
                        "name": "BLOCK",
                        "src": require('../../static/images/blk_ic_blocked.png'),
                        "width": 24,
                        "height": 24,
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
            this.setOnChange(function (event) {
                if (!event.blockId) return;
                if (event.blockId !== this.id) return;
                if (event.name == 'CENTER' && event.element == 'field') {
                    if (parseInt(event.newValue) === 2) {
                        if (!this.getField('MOTOR')) {
                            var fieldDialog = new Blockly.FieldModuleDialog(
                                '1',
                                Blockly.FieldModuleDialog.MODULE_MOTOR,
                                true
                            );
                            // index, field, opt_name
                            this.getInput('').insertFieldAt(
                                2,
                                fieldDialog,
                                'MOTOR'
                            );
                        }
                    } else {
                        this.getField('MOTOR') ? this.getInput('').removeField('MOTOR') : '';
                    }
                }
            });
        }
    }

    // 主控驱动球(1) 灯光关闭
    Blockly.Blocks['bell_light_closed'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_CLOSED,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "CENTER",
                        "options": [
                            [Blockly.Msg.BELL_MAIN_BALL, '1'],
                            [Blockly.Msg.BELL_DRIVE_BALL, '2']
                        ]
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
        }
    }

    // 播放蜂鸣器, 音调 [高,中,低], 音阶[1,2,...,9]
    Blockly.Blocks['bell_light_play_buzzer'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_PLAY_BUZZER,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "TONE",
                        "options": [
                            [Blockly.Msg.BELL_OPTIONS_HIGH, '1'],
                            [Blockly.Msg.BELL_OPTIONS_MIDDLE, '2'],
                            [Blockly.Msg.BELL_OPTIONS_LOW, '3']
                        ]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "SCALE",
                        "options": [
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                            ['9', '9'],
                        ]
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
        }
    }

    // // 播放蜂鸣器, 音调 [高,中,低], 音阶[1,2,...,9], 持续（2）秒, 是否阻断
    Blockly.Blocks['bell_light_play_buzzer_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_PLAY_BUZZER_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "TONE",
                        "options": [
                            [Blockly.Msg.BELL_OPTIONS_HIGH, '1'],
                            [Blockly.Msg.BELL_OPTIONS_MIDDLE, '2'],
                            [Blockly.Msg.BELL_OPTIONS_LOW, '3']
                        ]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "SCALE",
                        "options": [
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                            ['9', '9'],
                        ]
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "SECONDS",
                        "defaultValue": "1",
                    },
                    {
                        "type": "field_clockwise_image",
                        "name": "BLOCK",
                        "src": require('../../static/images/blk_ic_blocked.png'),
                        "width": 24,
                        "height": 24,
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
        }
    }

    // 停止蜂鸣
    Blockly.Blocks['bell_light_closed_buzzer'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_LIGHT_CLOSED_BUZZER,
                "args0": [
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.sound,
                "extensions": ["colours_control", "shape_statement"],
            });
        }
    }
}