import inherits from './inherits';
export default function (Blockly) {
    // 外形borrow自scratch-blocks中的field_dropdown
    Blockly.FieldModuleDialog = function (defaultValue, module, multiMode) {
        Blockly.FieldModuleDialog.superClass_.constructor.call(this, [['1', '1']],
            null);
        this.setValue(defaultValue || "1");
        this.module_ = module;
        this.isMultiMode_ = multiMode;
        if (Blockly.FieldModuleDialog.MODULE_LIST.indexOf(module) < 0) {
            throw 'Unknown module: ' + module;
        }
    };
    inherits(Blockly.FieldModuleDialog, Blockly.FieldDropdown);

    Blockly.FieldModuleDialog.fromJson = function (element) {
        return new Blockly.FieldModuleDialog(element.defaultValue,
            element.module, element.multiMode);
    };

    Blockly.FieldModuleDialog.MODULE_MC = 'mc';
    Blockly.FieldModuleDialog.MODULE_BATTERY = 'battery';
    Blockly.FieldModuleDialog.MODULE_MOTOR = 'motor';
    Blockly.FieldModuleDialog.MODULE_WAIST_JOINT = 'waist_joint';
    Blockly.FieldModuleDialog.MODULE_ARM_JOINT = 'arm_joint';
    Blockly.FieldModuleDialog.MODULE_TOUCH = 'touch';
    Blockly.FieldModuleDialog.MODULE_COLOR = 'color';
    Blockly.FieldModuleDialog.MODULE_INFRARED = 'infrared';

    Blockly.FieldModuleDialog.MODULE_LIST = [
        // Blockly.FieldModuleDialog.MODULE_MC, // 主控
        // Blockly.FieldModuleDialog.MODULE_BATTERY, // 电池
        Blockly.FieldModuleDialog.MODULE_MOTOR, // 电机(驱动球)
        Blockly.FieldModuleDialog.MODULE_WAIST_JOINT, // 舵机(水平关节, 旋转关节)
        Blockly.FieldModuleDialog.MODULE_ARM_JOINT, // 舵机(摇摆关节)
        // sensors
        Blockly.FieldModuleDialog.MODULE_TOUCH, // 触碰
        Blockly.FieldModuleDialog.MODULE_COLOR, // 颜色
        Blockly.FieldModuleDialog.MODULE_INFRARED, // 红外
    ];

    Blockly.FieldModuleDialog.prototype.module_ = null;
    Blockly.FieldModuleDialog.prototype.isMultiMode_ = false;

    Blockly.FieldModuleDialog.prototype.showEditor_ = function () {
        // Update colour to look selected.
        if (!this.disableColourChange_) {
            if (this.sourceBlock_.isShadow()) {
                this.sourceBlock_.setShadowColour(this.sourceBlock_.getColourTertiary());
            } else if (this.box_) {
                this.box_.setAttribute('fill', this.sourceBlock_.getColourTertiary());
            }
        }

        var sourceBlock = this.sourceBlock_;
        var value; // 2,4,5
        var moreValue; // decompose
        var oldMutationDom;
        var oldMutation;
        // 3种情况：   NOTE 多行 必须要用mutator，单选不要
        // 1. 多行多选
        // 2. 单行多选
        // 3. 单行单选
        if (!!sourceBlock.decompose) { // 1.
            value = this.getValue();
            moreValue = sourceBlock.decompose();
            oldMutationDom = sourceBlock.mutationToDom();
            oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
        } else if (this.isMultiMode_) { // 2.
            moreValue = this.getValue().split(', ');
            value = moreValue[moreValue.length - 1];
        } else if (!this.isMultiMode_) { // 3.
            moreValue = [this.getValue()];
            value = this.getValue();
        } else {
            // ignore
        }

        // 根据不同module显示不同的dialogs
        // 此外，还需指定是否多选模式，当前焦点位置
        var dialogData = Blockly.Dialogs.generateModuleDialog(this.module_,
            moreValue, this.isMultiMode_, value,
      /*onChange*/function (newBallList) { // [ '3' ]
                if (sourceBlock.compose) {
                    // compose like mutators
                    sourceBlock.compose(newBallList);
                    // fire that the mutation has changed
                    var newMutationDom = sourceBlock.mutationToDom();
                    var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
                    if (oldMutation != newMutation) {
                        Blockly.Events.fire(new Blockly.Events.BlockChange(sourceBlock,
                            'mutation', null, oldMutation, newMutation));
                    }
                } else {
                    if (me.isMultiMode_) {
                        me.setValue(newBallList.join(', '));
                    } else {

                        me.setValue(newBallList[0]);
                    }
                }
            }
        );
        var me = this;
        Blockly.DialogDiv.show(dialogData.dom, function () {
            if (dialogData.eventWrappers && dialogData.eventWrappers.length) {
                for (var i = 0, eventWrapper; eventWrapper = dialogData.eventWrappers[i]; i++) {
                    Blockly.unbindEvent_(eventWrapper);
                }
            }
            if (dialogData.onHide) dialogData.onHide();
            me.onHide();
        });
    };

    Blockly.Field.register('field_dialog', Blockly.FieldModuleDialog);
}