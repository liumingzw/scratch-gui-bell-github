import inherits from './inherits';
export default function (Blockly) {
    // [顺时针, 逆时针]
    Blockly.FieldClockwiseDialog = function (defaultValue) {
        // FieldDropdown 的 <menuGenerator> 是要传的 option （数组和函数） 
        Blockly.FieldClockwiseDialog.superClass_.constructor.call(this, [
            [Blockly.Msg.BELL_OPTIONS_CW, '0'],
            [Blockly.Msg.BELL_OPTIONS_CCW, '1'],
        ]);
        this.setValue(defaultValue);
    }

    inherits(Blockly.FieldClockwiseDialog, Blockly.FieldDropdown);

    Blockly.FieldClockwiseDialog.fromJson = function (element) {
        return new Blockly.FieldClockwiseDialog(element.defaultValue);
    };

    Blockly.FieldClockwiseDialog.prototype.showEditor_ = function () {
        var value = this.getValue();
        var dialogData = Blockly.Dialogs.generateModuleClockwiseDialog(value,
      /*onChange*/function (value) {
                me.setValue(value);
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

    Blockly.Field.register('field_clockwise', Blockly.FieldClockwiseDialog);
}