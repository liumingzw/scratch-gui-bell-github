import inherits from './inherits';
export default function (Blockly) {
    Blockly.FieldSpeedDialog = function (defaultValue, min, max) {
        if (!isNaN(min) && !isNaN(max) && max > min) {
            this.min = min;
            this.max = max;
        }
        Blockly.FieldSpeedDialog.superClass_.constructor.call(this, defaultValue);

        this.setValue(defaultValue);
        this.innerData_ = defaultValue;
    }
    inherits(Blockly.FieldSpeedDialog, Blockly.FieldTextInput);

    Blockly.FieldSpeedDialog.fromJson = function (element) {
        return new Blockly.FieldSpeedDialog(element.defaultValue, element.min, element.max);
    };

    // 保存变量
    Blockly.FieldSpeedDialog.prototype._roundedRectProgress = null; // 圆弧rect进度
    Blockly.FieldSpeedDialog.prototype._circleOutter = null; // 圆点外圆
    Blockly.FieldSpeedDialog.prototype._circleInner = null; // 圆点内圆
    Blockly.FieldSpeedDialog.prototype._label = null; // 圆点上文字,指示当前刻度值
    Blockly.FieldSpeedDialog.prototype._innerLabel = null; // 显示具体刻度值
    Blockly.FieldSpeedDialog.prototype._innerLabel2 = null; // 显示具体刻度值
    Blockly.FieldSpeedDialog.prototype._label2 = null; // 圆点上文字,指示当前刻度值

    Blockly.FieldSpeedDialog.MIN_VAL = 0;
    Blockly.FieldSpeedDialog.MAX_VAL = 50;
    Blockly.FieldSpeedDialog.prototype.min = Blockly.FieldSpeedDialog.MIN_VAL; // default
    Blockly.FieldSpeedDialog.prototype.max = Blockly.FieldSpeedDialog.MAX_VAL; // default

    Blockly.FieldSpeedDialog.prototype.showEditor_ = function () {
        var container_box = document.createElement('div');
        var div = document.createElement('div');
        div.className = 'bell-speed-dialog';

        this.container_ = div;
        container_box.appendChild(div);

        var speedContainer = document.createElement('div');
        speedContainer.className = 'bell-speed-container';
        div.appendChild(speedContainer);

        // minus and plus buttons
        var minus = document.createElement('img');
        minus.className = 'bell-speed-minus';
        minus.setAttribute('src', require('../../static/images/dialogs/speed/minus.png'));
        speedContainer.appendChild(minus);

        var plus = document.createElement('img');
        plus.className = 'bell-speed-plus';
        plus.setAttribute('src', require('../../static/images/dialogs/speed/plus.png'));
        speedContainer.appendChild(plus);

        // text labels
        var label = document.createElement('label');
        label.className = 'bell-speed-label-start';
        label.innerHTML = String(this.min);
        speedContainer.appendChild(label);

        var labelCenter = document.createElement('label');
        labelCenter.className = 'bell-speed-label-center';
        label = labelCenter;
        label.innerHTML = String(parseInt((this.max - this.min) / 2));
        speedContainer.appendChild(label);

        var labelEnd = document.createElement('label');
        labelEnd.className = 'bell-speed-label-end';
        label = labelEnd;
        label.innerHTML = String(this.max);
        speedContainer.appendChild(label);

        var svg = Blockly.utils.createSvgElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '325px',
            viewBox: '0 0 310 50',
            style: 'position: absolute; left: 30px; height: 50px; top: 50%; transform: translate(0, -50%);padding: 0px 10px;box-sizing: content-box; overflow: inherit;'
        });

        speedContainer.appendChild(svg);
        var roundedRect = Blockly.utils.createSvgElement('path', {
            fill: 'none',
            stroke: 'rgb(39, 184, 239)',
            'stroke-width': '1',
            d: 'm 25,0 h260 a 25, 25 0 0 1 25 25 a 25, 25 0 0 1 -25, 25 h-260 a25,25 0 0 1 -25,-25 a 25, 25 0 0 1 25, -25z'
        });
        svg.appendChild(roundedRect);
        var roundedRectProgress = Blockly.utils.createSvgElement('path', {
            fill: 'rgb(39, 184, 239)',
            d: 'm 25,0 h260 a 25, 25 0 0 1 25 25 a 25, 25 0 0 1 -25, 25 h-260 a25,25 0 0 1 -25,-25 a 25, 25 0 0 1 25, -25z'
        });
        svg.appendChild(roundedRectProgress);
        var circleOutter = Blockly.utils.createSvgElement('circle', {
            stroke: 'rgb(39, 184, 239)',
            'stroke-width': '3',
            fill: 'white',
            cx: '80',
            cy: '25',
            r: '26',
            class: 'draggable'
        });
        svg.appendChild(circleOutter);
        var circleInner = Blockly.utils.createSvgElement('circle', {
            fill: 'rgb(229, 248, 255)',
            cx: '80',
            cy: '25',
            r: '20'
        });
        circleInner.style.cssText = "pointer-events: none;";
        svg.appendChild(circleInner);
        label = Blockly.utils.createSvgElement('text', {
            x: '80',
            y: '30',
            fill: 'rgb(39, 184, 239)',
            'text-anchor': 'middle'
        });
        label.innerHTML = '40';
        label.style.cssText = "pointer-events: none;";
        svg.appendChild(label);
        // 具体刻度值
        var innerLabel = Blockly.utils.createSvgElement('rect', {
            fill: '#78dd99',
            rx: '5',
            ry: '5',
            x: '0',
            y: '-68',
            width: '50',
            height: '40'
        });
        svg.appendChild(innerLabel);
        var innerLabel2 = Blockly.utils.createSvgElement('rect', {
            fill: '#78dd99',
            x: '0',
            y: '-30',
            width: '15',
            height: '15',
            transform: 'rotate(45 0 -40)'
        });
        svg.appendChild(innerLabel2);
        var label2 = Blockly.utils.createSvgElement('text', {
            x: '80',
            y: '-42',
            fill: '#fff',
            'text-anchor': 'middle'
        });
        label2.innerHTML = '40';

        svg.appendChild(label2);

        // 确认按钮
        var saveBtn = document.createElement('div');
        saveBtn.className = 'bell-field-dialog-btn';
        div.appendChild(saveBtn);

        Blockly.bindEvent_(saveBtn, 'mousedown', null, (e) => {
            // 删除语句块时， 如果结果是int 会提示不是node类型， 需要将结果转换为string
            this.setText(this.getText());
            Blockly.DialogDiv.hide(); // hide
        });

        // save instances
        this._roundedRectProgress = roundedRectProgress;
        this._circleOutter = circleOutter;
        this._circleInner = circleInner;
        this._label = label;
        this._label2 = label2;
        this._innerLabel = innerLabel;
        this._innerLabel2 = innerLabel2;
        this._svg = svg;
        this._div = div;

        this._bindListeners(minus, plus);

        var me = this;
        Blockly.DialogDiv.show(div, function () {
            Blockly.unbindEvent_(saveBtn);
            // 点击空白区域取消 恢复当前设置的值
            me.innerData_ = me.text_;
        });
    }

    Blockly.FieldSpeedDialog.prototype._bindListeners = function (minus, plus) {
        this.reloadUI(); //需调用，改变UI
        function getTouchPosition(e) {
            var pos = {
                x: 0,
                y: 0
            };
            if (e.type.indexOf('drag') >= 0 || e.type.indexOf('mouse') >= 0) {
                pos.x = e.pageX;
                pos.y = e.pageY;
            } else {
                pos.x = e.targetTouches[0].pageX;
                pos.y = e.targetTouches[0].pageY;
            }

            var parent = that._svg;
            return window.convertPointFromPageToNode(parent, pos.x, pos.y);
        };

        var that = this;
        this.container_.onmousedown = function (e) {
            if (e.type.indexOf('touch') >= 0) {
                return;
            }
            // that.dialogDiv = that.dialog_.getBackgroundElement(); //年久失修的代码, 不知道有啥用 干掉
            // let svg = e.target;
            let isMouseDown = true;
            that.container_.addEventListener('mousemove', drag);
            that.container_.addEventListener('mouseup', endDrag);
            // that.container_.addEventListener('mouseleave', endDrag);
            // that.dialogDiv.addEventListener('mousemove', drag);

            let selectedElement = false;
            if (e.target.classList.contains('draggable')) {
                selectedElement = e.target;
            }

            function drag(e) {
                if (selectedElement && isMouseDown) {
                    e.preventDefault();
                    var origin = that._svg;
                    var localPos = getTouchPosition(e);
                    var percentage = that.innerData_;
                    if (localPos.x < 0 || localPos.x > origin.clientWidth || localPos.y < 0 || localPos.y > origin.clientHeight) {
                        if (localPos.x < 0) {
                            percentage = that.min;
                        } else if (localPos.x > origin.clientWidth) {
                            percentage = that.max;
                        }
                    } else {
                        percentage = Math.floor(localPos.x / origin.clientWidth * (that.max - that.min));
                    }

                    that.innerData_ = parseInt(percentage);
                    that.reloadUI();

                    // 移动的时候显示
                    that._innerLabel.style.display = 'block';
                    that._innerLabel2.style.display = 'block';
                    that._label2.style.display = 'block';
                }
            }

            function endDrag(e) {
                selectedElement = false;
                isMouseDown = false;
                that.container_.removeEventListener('mousemove', drag);
                that.container_.removeEventListener('mouseup', endDrag);
                // that.container_.removeEventListener('mouseleave', endDrag);
            }
            var body = document.getElementsByTagName('body')[0];
            body.onmouseup = that.container_.onmouseup = that._svg.onmouseup = that._div.onmouseup
                // = that.dialogDiv.onmouseup = that.dialogDiv.onmouseleave 
                = function (e) {
                    if (selectedElement && isMouseDown) {
                        that.container_.removeEventListener('mousemove', drag);
                        that.container_.removeEventListener('mouseup', endDrag);
                        // that.container_.removeEventListener('mouseleave', endDrag);
                        // that.dialogDiv.removeEventListener('mouse', drag);
                    }
                }
        }

        this._circleOutter.ontouchstart = this._circleOutter.ontouchmove = function (e) {
            var origin = e.target.parentNode;
            var localPos = getTouchPosition(e);

            var percentage = that.innerData_;
            if (localPos.x < 0 || localPos.x > origin.clientWidth || localPos.y < 0 || localPos.y > origin.clientHeight) {
                if (localPos.x < 0) {
                    percentage = that.min;
                } else if (localPos.x > origin.clientWidth) {
                    percentage = that.max;
                }
            } else {
                percentage = Math.floor(localPos.x / origin.clientWidth * (that.max - that.min));
            }

            that.innerData_ = parseInt(percentage);
            that.reloadUI();

            // 移动的时候显示
            that._innerLabel.style.display = 'block';
            that._innerLabel2.style.display = 'block';
            that._label2.style.display = 'block';
        };
        //touchend
        this._circleInner.ontouchend = this._circleOutter.ontouchend = this._label.ontouchend = function (e) {
            // 不移动的时候隐藏
            // that._innerLabel.style.display = 'none';
            // that._innerLabel2.style.display = 'none';
            // that._label2.style.display = 'none';
        }

        minus.onclick = function (e) {
            var val = !isNaN(that.innerData_) ? parseInt(that.innerData_) : 0;
            val--;
            val = Math.max(that.min, Math.min(that.max, val));
            that.innerData_ = val;
            that.reloadUI();
        };
        plus.onclick = function (e) {
            var val = !isNaN(that.innerData_) ? parseInt(that.innerData_) : 0;
            val++;
            val = Math.max(that.min, Math.min(that.max, val));
            that.innerData_ = val;
            that.reloadUI();
        };
    }


    Blockly.FieldSpeedDialog.prototype.reloadUI = function () {
        var val = !isNaN(this.innerData_) ? parseInt(this.innerData_) : 0;
        // 更新label上文字
        this._label.innerHTML = val;
        this._label2.innerHTML = val;
        // rounded 进度 0~160
        this._roundedRectProgress.setAttribute('d',
            // `m 25,0 h${val / (this.max - this.min) * 160} a 25, 25 0 0 1 25 25 a 25, 25 0 0 1 -25, 25 h-${val / (this.max - this.min) * 160} a25,25 0 0 1 -25,-25 a 25, 25 0 0 1 25, -25z`);
            `m 25,0 h${val / (this.max - this.min) * 260} a 25, 25 0 0 1 25 25 a 25, 25 0 0 1 -25, 25 h-${val / (this.max - this.min) * 260} a25,25 0 0 1 -25,-25 a 25, 25 0 0 1 25, -25z`);
        // circles outter/inner: 25~185
        // var cx = val / (this.max - this.min) * (185 - 25) + 25;
        var cx = val / (this.max - this.min) * (285 - 25) + 25;
        this._circleOutter.setAttribute('cx', cx);
        this._circleInner.setAttribute('cx', cx);
        this._label.setAttribute('x', cx);
        this._label2.setAttribute('x', cx);
        this._innerLabel.setAttribute('x', cx - 25); // 具体刻度值位移
        this._innerLabel2.setAttribute('x', cx - 25); // 具体刻度值位移
        this._innerLabel2.setAttribute('transform', `rotate(45 ${cx} -6)`); // 具体刻度值位移
    };

    Blockly.FieldSpeedDialog.prototype.getText = function () {
        return this.innerData_;
    };

    Blockly.FieldSpeedDialog.prototype.getValue = function () {
        return String(this.innerData_);
    };

    Blockly.FieldSpeedDialog.prototype.dispose = function () {
        this._roundedRectProgress = null;
        this._circleOutter = null;
        this._circleInner = null;
        this._label = null;
        this._innerLabel = null; // 清空
        this._innerLabel2 = null; // 清空
        Blockly.FieldSpeedDialog.superClass_.dispose.call(this);
    };

    Blockly.Field.register('field_speedDialog', Blockly.FieldSpeedDialog);

    (function () {
        "use strict";
        var I = new WebKitCSSMatrix();
        function Point(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        Point.prototype.transformBy = function (matrix) {
            var tmp = matrix.multiply(I.translate(this.x, this.y, this.z));
            return new Point(tmp.m41, tmp.m42, tmp.m43);
        };
        // new WebKitCSSMatrix(), new WebKitCSSMatrix(string)
        // WebKitCSSMatrix#m41, WebKitCSSMatrix#m42, WebKitCSSMatrix#m43
        // WebKitCSSMatrix#multiply, WebKitCSSMatrix#translate, WebKitCSSMatrix#inverse

        function getTransformationMatrix(element) {
            var transformationMatrix = I;
            var x = element;

            while (x != undefined && x !== x.ownerDocument.documentElement) {
                var computedStyle = window.getComputedStyle(x, undefined);
                var transform = computedStyle.transform || "none";
                var c = transform === "none" ? I : new WebKitCSSMatrix(transform);
                transformationMatrix = c.multiply(transformationMatrix);
                x = x.parentNode;
            }

            var w = element.offsetWidth;
            var h = element.offsetHeight;
            var i = 4;
            var left = +Infinity;
            var top = +Infinity;
            while (--i >= 0) {
                var p = new Point(i === 0 || i === 1 ? 0 : w, i === 0 || i === 3 ? 0 : h, 0).transformBy(transformationMatrix);
                if (p.x < left) {
                    left = p.x;
                }
                if (p.y < top) {
                    top = p.y;
                }
            }
            var rect = element.getBoundingClientRect();
            transformationMatrix = I.translate(window.pageXOffset + rect.left - left, window.pageYOffset + rect.top - top, 0).multiply(transformationMatrix);

            return transformationMatrix;
        }

        window.convertPointFromPageToNode = function (element, pageX, pageY) {
            return new Point(pageX, pageY, 0).transformBy(getTransformationMatrix(element).inverse());
        };

        window.convertPointFromNodeToPage = function (element, offsetX, offsetY) {
            return new Point(offsetX, offsetY, 0).transformBy(getTransformationMatrix(element));
        };

    }());
}