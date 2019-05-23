import inherits from './inherits';
export default function (Blockly) {
    Blockly.FieldColurDialog = function (colour) {
        Blockly.FieldColurDialog.superClass_.constructor.call(this, colour);
        this.columns_ = colour || ['#000000', '#0050dc', '#78fa00', '#ffff00', '#ff1428', '#ffffff', '#c81eff', '#ff9800'];
        // 配置颜色
        // this.columns_ = ['#000000', '#0050dc', '#78fa00', '#ffff00', '#ff1428', '#ffffff', '#c81eff', '#ff9800'];
    };
    inherits(Blockly.FieldColurDialog, Blockly.Field);

    Blockly.FieldColurDialog.fromJson = function (element) {
        return new Blockly.FieldColurDialog(element.colour);
    };

    Blockly.FieldColurDialog.prototype.showEditor_ = function () {
        var div = document.createElement('div');
        var row = document.createElement('div');
        row.className = 'bell-colour-dialog';

        for (var i = 0; i < this.columns_.length; i++) {
            var colour = this.columns_[i];
            var item = document.createElement('div');
            item.className = 'bell-colour-items';
            item.style['background-color'] = colour;
            item.style.border = this.getValue() === colour ? '2px solid black' : 'none';
            item.setAttribute('colour', colour);
            row.appendChild(item);

            Blockly.bindEvent_(item, 'mousedown', this, function (e) {
                var colour = e.target.getAttribute('colour');
                this.setValue(colour);
                Blockly.DialogDiv.hide(); // hide
            });
        }
        div.appendChild(row);

        Blockly.DialogDiv.show(div, function () {
            Blockly.unbindEvent_(item);
            // 点击空白区域取消 恢复当前设置的值
            // me.innerData_ = me.text_;
        });
    }

    /**
     * Draws the border with the correct width.
     * Saves the computed width in a property.
     * @private
     */
    Blockly.FieldColurDialog.prototype.render_ = function () {
        // 所有的fiel 都在fielgroup里面
        // 是否初次创建，是否创建过，init初始化的时候会创建一个this.textElement 类型为text的，这个不能放进去
        if (this.visible_ && this.fieldGroup_ && (!this.textElement_ || this.textElement_.nodeName == 'text')) {
            this.textElement_ = Blockly.utils.createSvgElement('path', {
                'fill': this.getValue(), //'#ff2000',
                'd': 'm 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z',
                'fill-opacity': '1',
                'stroke': '#FFFFFF'
            }, this.fieldGroup_);
            // this.updateEditable();
        } else if (this.textElement_) {
            // 给创建过的field设置颜色
            this.textElement_.setAttribute('fill', this.getValue());
        }

        this.updateWidth(); // 计算宽度间距

        // Update any drawn box to the correct width and height.
        if (this.box_) {
            this.box_.setAttribute('width', this.size_.width);
            this.box_.setAttribute('height', this.size_.height);
        }
    };

    /**
     * Updates the width of the field. This calls getCachedWidth which won't cache
     * the approximated width on IE/Edge when `getComputedTextLength` fails. Once
     * it eventually does succeed, the result will be cached.
     **/
    Blockly.FieldColurDialog.prototype.updateWidth = function () {
        this.size_.width = 30 + 2 * 2;
    };

    Blockly.FieldColurDialog.prototype.dispose = function () {
        this.columns_ = null;
    }

    Blockly.Field.register('field_colourDialog', Blockly.FieldColurDialog);
}