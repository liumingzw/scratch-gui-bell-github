import inherits from './inherits';
export default function (Blockly) {
    Blockly.FieldNumberDialog = function (defaultValue) {
        this.numList = [];
        this.eventWrapper = [];

        defaultValue = (defaultValue && !isNaN(defaultValue)) ? String(defaultValue) : '0';

        Blockly.FieldNumberDialog.superClass_.constructor.call(this, defaultValue);
        this.setText(defaultValue);
        this.innerData_ = defaultValue;
    }

    inherits(Blockly.FieldNumberDialog, Blockly.FieldTextInput);

    // 显示框引用
    Blockly.FieldNumberDialog.prototype.labelNode = null;
    // 按键引用
    Blockly.FieldNumberDialog.prototype.numList = null;

    Blockly.FieldNumberDialog.fromJson = function (element) {
        return new Blockly.FieldNumberDialog(element.defaultValue);
    };


    Blockly.FieldNumberDialog.prototype.showEditor_ = function () {
        var dom = document.createElement("div");
        dom.className = 'bell-field-number-dialog';
        // 输入框
        var input = document.createElement("div");
        input.className = 'bell-field-number-input';
        dom.appendChild(input);

        // 数字框
        this.labelNode = document.createElement("span");
        input.appendChild(this.labelNode);
        // 删除
        var del = document.createElement("div");
        del.className = 'bell-field-number-del';
        input.appendChild(del);

        Blockly.bindEvent_(del,'mouseup',this,() => {
            this.getInput(-1);
        });
        // 珊格
        var grid = document.createElement("div");
        grid.className = 'bell-field-number-numpad';
        dom.appendChild(grid);

        function captureClick(index) {
            return function () {
                this.getInput(index);
            };
        }
        var numSymbol = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '+/-', '0', '.'];
        for (var i = 0; i < numSymbol.length; i++) {
            var gridItem = document.createElement("div");
            gridItem.className = 'bell-field-number-grid-item';
            grid.appendChild(gridItem);

            this.numList.push(gridItem);
            var num = document.createElement('button');
            num.className = i % 3 == 2 ? 'bell-field-number-num right-edge' : 'bell-field-number-num';
            gridItem.appendChild(num);

            var spanTxt = document.createElement('span');
            spanTxt.innerText = numSymbol[i];
            num.appendChild(spanTxt);

            var event = Blockly.bindEvent_(gridItem, 'click', this, captureClick(i));
            this.eventWrapper.push(event);
        }
        this.reloadUI(); //需调用，改变UI
        // 确认按钮
        var saveBtn = document.createElement('div');
        saveBtn.className = 'bell-field-dialog-btn';
        dom.appendChild(saveBtn);

        Blockly.bindEvent_(saveBtn, 'mousedown', null, (e) => {
            // 删除语句块时， 如果结果是int 会提示不是node类型， 需要将结果转换为string
            this.setText(this.getValue());
            Blockly.DialogDiv.hide(); // hide
        });

        var me = this;
        Blockly.DialogDiv.show(dom, function () {
            Blockly.unbindEvent_(saveBtn);
            Blockly.unbindEvent_(del);
            // 点击空白区域取消 恢复当前设置的值
            me.innerData_ = me.text_;
        });
    }

    Blockly.FieldNumberDialog.prototype.getInput = function (index) {
        if (this.innerData_.length > 12 && !(index == -1 || index == 9)) {
            return;
        }
        // 将负号提取出来，单独处理
        var neg = false;
        // startsWith()方法用来判断当前字符串是否是以另外一个给定的子字符串“开头”的，根据判断结果返回 true 或 false。
        if (this.innerData_.startsWith('-')) {
            neg = true;
            this.innerData_ = this.innerData_.substring(1, this.innerData_.length);
        }
        switch (index) {
            case -1:
                {
                    // 退格删光
                    if (this.innerData_.length == 1) {
                        neg = false;
                        this.innerData_ = '0';
                    } else {
                        this.innerData_ = this.innerData_.substr(0, this.innerData_.length - 1);
                    }
                }
                break;
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                {
                    if (this.innerData_ == '0') {
                        this.innerData_ = new String(index + 1);
                    } else {
                        this.innerData_ += new String(index + 1);
                    }
                }
                break;
            case 9:
                neg = !neg;
                break;
            case 10:
                if (this.innerData_ != '0') {
                    this.innerData_ += '0';
                }
                break;
            case 11:
                if (this.innerData_.indexOf('.') == -1) {
                    this.innerData_ += '.';
                }
                break;
            default:
                console.error('no such button');
        }
        if (neg) {
            this.innerData_ = '-' + this.innerData_;
        }
        this.reloadUI();
    };

    Blockly.FieldNumberDialog.prototype.reloadUI = function () {
        this.labelNode.innerText = this.innerData_;
    };

    Blockly.FieldNumberDialog.prototype.getValue = function () {
        var result = parseFloat(this.innerData_);
        return this.innerData_ = isNaN(result) ? 0 : String(result);
    };

    /** 需要转换成字符串类型
     */
    Blockly.FieldNumberDialog.prototype.setValue = function (val) {
        this.innerData_ = String(val);
    };

    Blockly.FieldNumberDialog.prototype.dispose = function () {
        this.labelNode = null;
        this.numList = null;
        this.innerData_ = null;
        for (var i = 0; i < this.eventWrapper.length; i++) {
            Blockly.unbindEvent_(this.eventWrapper[i]);
        }
        this.eventWrapper = null;
        Blockly.FieldNumberDialog.superClass_.dispose.call(this);
    };

    Blockly.Field.register('field_numberDialog', Blockly.FieldNumberDialog);
}