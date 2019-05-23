export default function (Blockly) {
    // 多行可变语句块MIXIN
    Blockly.Blocks.MIXIN_MULTI_LINES_BLOCK = {
        mixinMultiLinesData: [],
        // 弹窗显示时，需要获取mixin data中ball list
        // fix issue: 如果field内值被认为修改，需要在此处去获取最新数据
        mixinMultiLinesDataModuleList: function () {
            var data = [];
            for (var i = 0; i < this.mixinMultiLinesData.length; i++) {
                data.push(this.mixinMultiLinesData[i].seq);
            }
            return data;
        },
        onchange: function (e) {
            for (var i = 0, data; data = this.mixinMultiLinesData[i]; i++) {
                data.clockwise = this.getFieldValue('CLOCKWISE' + (i + 1));
                data.power = this.getFieldValue('POWER' + (i + 1));
                data.seconds = this.getFieldValue('SECONDS' + (i + 1));
            }
        },
        mutationToDom: function () {
            if (!this.mixinMultiLinesData || !this.mixinMultiLinesData.length ||
                !this.shouldCreateMultiRow) {
                return null;
            }
            return null; // FIXME: mutation保留导致一系列问题，能否解决?

            var container = document.createElement('mutation');
            for (var i = 0, data; data = this.mixinMultiLinesData[i]; i++) {
                var item = document.createElement('item');
                // 驱动球球号1-15
                item.setAttribute('seq', data.seq);
                // 顺时针 or 逆时针
                item.setAttribute('clockwise', data.clockwise);
                // 功率
                item.setAttribute('power', data.power);
                // 持续时间(s)
                item.setAttribute('seconds', data.seconds);
                container.appendChild(item);
            }
            return container;
        },
        domToMutation: function (element) {
            if (!this.shouldCreateMultiRow) return;
            this.mixinMultiLinesData.length = 0;
            // 首行数据
            var firstLineData = {
                seq: this.getFieldValue('MOTOR'),
                clockwise: this.getFieldValue('CLOCKWISE'),
                power: this.getFieldValue('POWER'),
                seconds: this.getFieldValue('SECONDS'),
            };
            this.mixinMultiLinesData.push(firstLineData);

            for (var i = 0, child; child = element.childNodes[i]; i++) {
                var item = {};

                // 驱动球球号
                item.seq = parseInt(child.getAttribute('seq'));
                // 顺时针 or 逆时针
                item.clockwise = parseInt(child.getAttribute('clockwise'));
                // 功率
                item.power = parseInt(child.getAttribute('power'));
                // 持续时间(s)
                item.seconds = parseFloat(child.getAttribute('seconds'));

                this.mixinMultiLinesData.push(item);
            }
            // re-render the block
            this.updateShape_();
        },
        updateShape_: function () {
            var data = this.mixinMultiLinesData;
            // 首行单独更新field值
            this.getField('MOTOR').setValue(data[0].seq);
            this.getField('CLOCKWISE').setValue(data[0].clockwise);
            this.getField('POWER').setValue(data[0].power);
            this.getField('SECONDS').setValue(data[0].seconds);
            // 其他行直接先干掉
            for (var i = this.inputList.length - 1, input; input = this.inputList[i]; i--) {
                if (input.type === Blockly.DUMMY_INPUT && input.fieldRow.length > 0 && i > 0) {
                    if (input.connection && input.connection.isConnected()) {
                        input.connection.setShadowDom(null);
                        var block = input.connection.targetBlock();
                        if (block.isShadow()) {
                            // Destroy any attached shadow block.
                            block.dispose();
                        } else {
                            // Disconnect any attached normal block.
                            block.unplug();
                        }
                    }
                    input.dispose();
                    this.inputList.splice(i, 1);
                }
            }
            // 添加行
            for (var i = 1, item; item = data[i]; i++) {
                var seqField = new Blockly.FieldModuleDialog(item.seq, Blockly.FieldModuleDialog.MODULE_MOTOR, true);
                // var clockwiseField = new Blockly.FieldClockwiseDialog(item.clockwise);
                var clockwiseField = new Blockly.FieldClockwiseDialog(0); // 默认0 顺时针
                var powerField = new Blockly.FieldSpeedDialog(item.power, 0, 180);
                var secondsField = new Blockly.FieldNumberDialog(item.seconds);
                this.appendDummyInput()
                    .appendField('驱动球')
                    .appendField(seqField, 'MOTOR' + i)
                    .appendField(',')
                    .appendField(clockwiseField, 'CLOCKWISE' + i)
                    .appendField('旋转, 功率')
                    .appendField(powerField, 'POWER' + i)
                    .appendField(', 持续')
                    .appendField(secondsField, 'SECONDS' + i)
                    .appendField('秒');
            }
            // fix issue: 需要把compose传过来的第一个data删除
            this.mixinMultiLinesData.splice(0, 1);
            // fix issue: 需要强制渲染一次block，防止出现空行
            this.render();
        },
        compose: function (newData) {
            if (!this.shouldCreateMultiRow) return;
            // 首行数据
            var firstLineData = {
                seq: this.getFieldValue('MOTOR'),
                clockwise: this.getFieldValue('CLOCKWISE'),
                power: this.getFieldValue('POWER'),
                seconds: this.getFieldValue('SECONDS'),
            };
            // 其余数据
            var otherLineData = this.mixinMultiLinesData;
            // 拼接起来
            var oldData = [];
            oldData.push({
                seq: firstLineData.seq,
                clockwise: firstLineData.clockwise,
                power: firstLineData.power,
                seconds: firstLineData.seconds,
            });
            for (var i = 0, otherLine; otherLine = otherLineData[i]; i++) {
                oldData.push({
                    seq: otherLine.seq,
                    clockwise: otherLine.clockwise,
                    power: otherLine.power,
                    seconds: otherLine.seconds,
                });
            }
            function findInOldDataBySeq(seq, oldData) {
                for (var i = 0, oldLine; oldLine = oldData[i]; i++) {
                    if (oldLine.seq == seq) {
                        return oldLine;
                    }
                }
                return null;
            }
            // 更新数据集
            var mergeData = [];
            for (var i = 0, newLine; newLine = newData[i]; i++) {
                var find = findInOldDataBySeq(newLine, oldData);
                if (!!find) {
                    mergeData.push({
                        seq: newLine,
                        clockwise: find.clockwise,
                        power: find.power,
                        seconds: find.seconds,
                    });
                } else {
                    // 没有，给默认值
                    mergeData.push({
                        seq: newLine,
                        clockwise: '1',
                        power: 30,
                        seconds: 3,
                    });
                }
            }
            this.mixinMultiLinesData = mergeData;
            this.updateShape_();
        },
        decompose: function () {
            if (!this.shouldCreateMultiRow) return;
            var data = this.mixinMultiLinesDataModuleList();
            data.unshift(this.getFieldValue('MOTOR'));
            return data;
        },
    };

    Blockly.Blocks.MIXIN_MULTI_LINES_SPEED_BLOCK = {
        mixinMultiLinesData: [],
        // 弹窗显示时，需要获取mixin data中ball list
        // fix issue: 如果field内值被认为修改，需要在此处去获取最新数据
        mixinMultiLinesDataModuleList: function () {
            var data = [];
            for (var i = 0; i < this.mixinMultiLinesData.length; i++) {
                data.push(this.mixinMultiLinesData[i].seq);
            }
            return data;
        },
        onchange: function (e) {
            for (var i = 0, data; data = this.mixinMultiLinesData[i]; i++) {
                data.clockwise = this.getFieldValue('CLOCKWISE' + (i + 1));
                data.power = this.getFieldValue('POWER' + (i + 1));
                data.seconds = this.getFieldValue('SECONDS' + (i + 1));
            }
        },
        mutationToDom: function () {
            if (!this.mixinMultiLinesData || !this.mixinMultiLinesData.length ||
                !this.shouldCreateMultiRow) {
                return null;
            }
            return null; // FIXME: mutation保留导致一系列问题，能否解决?

            var container = document.createElement('mutation');
            for (var i = 0, data; data = this.mixinMultiLinesData[i]; i++) {
                var item = document.createElement('item');
                // 驱动球球号1-15
                item.setAttribute('seq', data.seq);
                // 顺时针 or 逆时针
                item.setAttribute('clockwise', data.clockwise);
                // 功率
                item.setAttribute('power', data.power);
                // 持续时间(s)
                item.setAttribute('seconds', data.seconds);
                container.appendChild(item);
            }
            return container;
        },
        domToMutation: function (element) {
            if (!this.shouldCreateMultiRow) return;
            this.mixinMultiLinesData.length = 0;
            // 首行数据
            var firstLineData = {
                seq: this.getFieldValue('MOTOR'),
                clockwise: this.getFieldValue('CLOCKWISE'),
                power: this.getFieldValue('POWER'),
                seconds: this.getFieldValue('SECONDS'),
            };
            this.mixinMultiLinesData.push(firstLineData);

            for (var i = 0, child; child = element.childNodes[i]; i++) {
                var item = {};

                // 驱动球球号
                item.seq = parseInt(child.getAttribute('seq'));
                // 顺时针 or 逆时针
                item.clockwise = parseInt(child.getAttribute('clockwise'));
                // 功率
                item.power = parseInt(child.getAttribute('power'));
                // 持续时间(s)
                item.seconds = parseFloat(child.getAttribute('seconds'));

                this.mixinMultiLinesData.push(item);
            }
            // re-render the block
            this.updateShape_();
        },
        updateShape_: function () {
            var data = this.mixinMultiLinesData;
            // 首行单独更新field值
            this.getField('MOTOR').setValue(data[0].seq);
            this.getField('CLOCKWISE').setValue(data[0].clockwise);
            this.getField('POWER').setValue(data[0].power);
            this.getField('SECONDS').setValue(data[0].seconds);
            // 其他行直接先干掉
            for (var i = this.inputList.length - 1, input; input = this.inputList[i]; i--) {
                if (input.type === Blockly.DUMMY_INPUT && input.fieldRow.length > 0 && i > 0) {
                    if (input.connection && input.connection.isConnected()) {
                        input.connection.setShadowDom(null);
                        var block = input.connection.targetBlock();
                        if (block.isShadow()) {
                            // Destroy any attached shadow block.
                            block.dispose();
                        } else {
                            // Disconnect any attached normal block.
                            block.unplug();
                        }
                    }
                    input.dispose();
                    this.inputList.splice(i, 1);
                }
            }
            // 添加行
            for (var i = 1, item; item = data[i]; i++) {
                var seqField = new Blockly.FieldModuleDialog(item.seq, Blockly.FieldModuleDialog.MODULE_MOTOR, true);
                // var clockwiseField = new Blockly.FieldClockwiseDialog(item.clockwise);
                var clockwiseField = new Blockly.FieldClockwiseDialog(0); // 默认0 顺时针
                var powerField = new Blockly.FieldSpeedDialog(item.power, 0, 180);
                var secondsField = new Blockly.FieldNumberDialog(item.seconds);
                this.appendDummyInput()
                    .appendField('驱动球')
                    .appendField(seqField, 'MOTOR' + i)
                    .appendField(',')
                    .appendField(clockwiseField, 'CLOCKWISE' + i)
                    .appendField('旋转, 速度')
                    .appendField(powerField, 'POWER' + i)
                    .appendField(', 持续')
                    .appendField(secondsField, 'SECONDS' + i)
                    .appendField('秒');
            }
            // fix issue: 需要把compose传过来的第一个data删除
            this.mixinMultiLinesData.splice(0, 1);
            // fix issue: 需要强制渲染一次block，防止出现空行
            this.render();
        },
        compose: function (newData) {
            if (!this.shouldCreateMultiRow) return;
            // 首行数据
            var firstLineData = {
                seq: this.getFieldValue('MOTOR'),
                clockwise: this.getFieldValue('CLOCKWISE'),
                power: this.getFieldValue('POWER'),
                seconds: this.getFieldValue('SECONDS'),
            };
            // 其余数据
            var otherLineData = this.mixinMultiLinesData;
            // 拼接起来
            var oldData = [];
            oldData.push({
                seq: firstLineData.seq,
                clockwise: firstLineData.clockwise,
                power: firstLineData.power,
                seconds: firstLineData.seconds,
            });
            for (var i = 0, otherLine; otherLine = otherLineData[i]; i++) {
                oldData.push({
                    seq: otherLine.seq,
                    clockwise: otherLine.clockwise,
                    power: otherLine.power,
                    seconds: otherLine.seconds,
                });
            }
            function findInOldDataBySeq(seq, oldData) {
                for (var i = 0, oldLine; oldLine = oldData[i]; i++) {
                    if (oldLine.seq == seq) {
                        return oldLine;
                    }
                }
                return null;
            }
            // 更新数据集
            var mergeData = [];
            for (var i = 0, newLine; newLine = newData[i]; i++) {
                var find = findInOldDataBySeq(newLine, oldData);
                if (!!find) {
                    mergeData.push({
                        seq: newLine,
                        clockwise: find.clockwise,
                        power: find.power,
                        seconds: find.seconds,
                    });
                } else {
                    // 没有，给默认值
                    mergeData.push({
                        seq: newLine,
                        clockwise: '1',
                        power: 30,
                        seconds: 3,
                    });
                }
            }
            this.mixinMultiLinesData = mergeData;
            this.updateShape_();
        },
        decompose: function () {
            if (!this.shouldCreateMultiRow) return;
            var data = this.mixinMultiLinesDataModuleList();
            data.unshift(this.getFieldValue('MOTOR'));
            return data;
        },
    };



    /**
     * 参数说明
     * message0 语句块内容 需做国际化
     * args0 参数类型
     * category 语句块分类  比如 motion
     * extensions 语句块类型  具体看 vertical_extensions.js
     * mutator 弹出窗口的子块名称 (要对应MIXIN函数)
     */
    // 驱动球 (1), [顺时针, 逆时针] 旋转, 功率 (30), 持续 (1) 秒, 是否阻塞
    Blockly.Blocks['bell_motion_motor_power_concurrence'] = {
        // See block_render_svg_vertical.js line 800+
        // See github.com/LLK/scratch-blocks/issues/1658
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_MOTOR_POWER_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "motor",
                        "multiMode": true,
                    },
                    {
                        "type": "field_clockwise",
                        "name": "CLOCKWISE",
                        "defaultValue": "0",
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "POWER",
                        "defaultValue": "30",
                        "min": '0',
                        "max": '180'
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
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                "mutator": "bell_motion_motor_power_concurrence_mutator",
            });
        },
    };
    Blockly.Extensions.registerMutator('bell_motion_motor_power_concurrence_mutator',
        Blockly.Blocks.MIXIN_MULTI_LINES_BLOCK, null, []);

    // 驱动球 (1), [顺时针, 逆时针] 旋转, 功率 (30), 持续 (1) 秒
    Blockly.Blocks['bell_motion_motor_power'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_MOTOR_POWER,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "motor",
                        "multiMode": true,
                    },
                    {
                        "type": "field_clockwise",
                        "name": "CLOCKWISE",
                        "defaultValue": "0",
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "POWER",
                        "defaultValue": "30",
                        "min": '0',
                        "max": '180'
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "SECONDS",
                        "value": "3",
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                "mutator": "bell_motion_motor_power_mutator",
            });
        },
    };

    Blockly.Extensions.registerMutator('bell_motion_motor_power_mutator',
        Blockly.Blocks.MIXIN_MULTI_LINES_BLOCK, null, []);

    // 驱动球（1）,[顺时针, 逆时针] 旋转, 速度（30）转/分, （1）秒, 是否阻塞
    Blockly.Blocks['bell_motion_motor_rotate_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_MOTOR_ROTATE_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "motor",
                        "multiMode": true,
                    },
                    {
                        "type": "field_clockwise",
                        "name": "CLOCKWISE",
                        "defaultValue": "0",
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "POWER",
                        "defaultValue": "30",
                        "min": '0',
                        "max": '180'
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "SECONDS",
                        "value": "3",
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
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                "mutator": "bell_motion_motor_rotate_concurrence_mutator",
            });
        },
    };

    Blockly.Extensions.registerMutator('bell_motion_motor_rotate_concurrence_mutator',
        Blockly.Blocks.MIXIN_MULTI_LINES_SPEED_BLOCK, null, []);

    // 驱动球（1）,[顺时针, 逆时针] 旋转, 速度（30）转/分
    Blockly.Blocks['bell_motion_motor_rotate'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_MOTOR_ROTATE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "motor",
                        "multiMode": true,
                    },
                    {
                        "type": "field_clockwise",
                        "name": "CLOCKWISE",
                        "defaultValue": "0",
                    },
                    {
                        "type": "field_speedDialog",
                        "name": "POWER",
                        "defaultValue": "30",
                        "min": '0',
                        "max": '180'
                    },
                    {
                        "type": "field_numberDialog",
                        "name": "SECONDS",
                        "value": "3",
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                "mutator": "bell_motion_motor_rotate_mutator",
            });
        },
    };

    Blockly.Extensions.registerMutator('bell_motion_motor_rotate_mutator',
        Blockly.Blocks.MIXIN_MULTI_LINES_SPEED_BLOCK, null, []);

    // 驱动球（1） stop
    Blockly.Blocks['bell_motion_stop'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_STOP,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "motor",
                        "multiMode": true,
                    },
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
            })
        }
    }

    // 旋转关节球 度° ，是否阻塞
    Blockly.Blocks['bell_motion_waist_joint_deg_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_WAIST_JOINT_DEG_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "waist_joint",
                        "multiMode": true,
                    },
                    {
                        "type": "field_angleDialog",
                        "name": "ANGLE",
                        "defaultValue": "0",
                        "steeringGearType": 'armJoint',
                    },
                    {
                        "type": "field_clockwise_image",
                        "name": "BLOCK",
                        "module": 'isBlocks',
                        "src": require('../../static/images/blk_ic_blocked.png'),
                        "width": 24,
                        "height": 24,
                    },
                    {
                        "type": "input_dummy",
                    }
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                // "mutator": "bell_motion_waist_joint_deg_mutator",
            });
        }
    };
    // Blockly.Extensions.registerMutator('bell_motion_waist_joint_deg_mutator',
    //   Blockly.Blocks.MIXIN_MULTI_LINES_BLOCK_WAIST_JOINT, null, []);

    // 摇摆关节球 度° ，是否阻塞
    Blockly.Blocks['bell_motion_arm_joint_deg_concurrence'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_ARM_JOINT_DEG_CONCURRENCE,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "arm_joint",
                        "multiMode": true,
                    },
                    {
                        "type": "field_angleDialog",
                        "name": "ANGLE",
                        "defaultValue": "0",
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
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"],
                // "mutator": "bell_motion_arm_joint_deg_mutator",
            });
        }
    };
    // Blockly.Extensions.registerMutator('bell_motion_arm_joint_deg_mutator',
    //   Blockly.Blocks.MIXIN_MULTI_LINES_BLOCK_ARM_JOINT, null, []);

    // 获取旋转关节球的角度
    // 旋转关节球（1） 度（°）
    Blockly.Blocks['bell_motion_get_waist_deg'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_GET_WAIST_DEG,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "waist_joint",
                    }
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "output_number"],
            });
        }
    };

    // 获取摇摆关节球的角度
    // 摇摆关节球（1） 度（°）
    Blockly.Blocks['bell_motion_get_arm_deg'] = {
        shouldCreateMultiRow: true,
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.BELL_MOTION_GET_ARM_DEG,
                "args0": [
                    {
                        "type": "field_dialog",
                        "name": "MOTOR",
                        "defaultValue": "1",
                        "module": "arm_joint",
                    }
                ],
                "category": Blockly.Categories.motion,
                "extensions": ["colours_motion", "output_number"],
            });
        }
    };
}