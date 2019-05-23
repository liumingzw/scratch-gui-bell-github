import inherits from './inherits';
export default function (Blockly) {
    /**
     * 阻塞和非阻塞
     */
    // 外形borrow自scratch-blocks中的field_image
    Blockly.FieldImageDialog = function (src, width, height) {
        // 通过构造函数 传递参数
        Blockly.FieldImageDialog.superClass_.constructor.call(this, src, width, height);
        this.setValue(src);
    };

    inherits(Blockly.FieldImageDialog, Blockly.FieldImage); // 继承image

    Blockly.FieldImageDialog.fromJson = function (element) {
        return new Blockly.FieldImageDialog(element.src, element.width, element.height);
    };

    /**
     * 因为field_image 没有绑定事件
     * 所以我们通过prototype 在 init 函数中给  this.imageElement_ 绑定事件
     */
    Blockly.FieldImageDialog.prototype.init = function () {
        Blockly.FieldImageDialog.superClass_.init.call(this);

        Blockly.bindEvent_(this.imageElement_, 'mouseup', this, function (e) {
            this.showEditor_();
        });
    };

    Blockly.FieldImageDialog.prototype.dispose = function () {
        Blockly.FieldImageDialog.superClass_.init.call(this);
        Blockly.unbindEvent_(this.imageElement_);
    }

    Blockly.FieldImageDialog.prototype.showEditor_ = function () {
        var value = this.getValue();
        var dialogData = Blockly.Dialogs.generateModuleBlockDialog(value,
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
            //   me.onHide();
        });
    };

    Blockly.Field.register('field_clockwise_image', Blockly.FieldImageDialog);

}