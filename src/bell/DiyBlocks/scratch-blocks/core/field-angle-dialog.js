import inherits from './inherits';
var mobile = require('is-mobile');
export default function (Blockly) {
    Blockly.FieldAngleDialog = function (defaultValue, steeringGearType) {

        //定义量角器对话框相关属性
        this.angleDialogRound = 5; //每次移动刻度
        this.angleDialogPanelWidth = 350;
        this.angleDialogPanelHeight = 250;
        this.angleDialogOutRadius = 140;
        this.offsetY = -10;
        this.minAngle = 15; //最小角度

        this.steeringGearType = steeringGearType || 'waistJoint';

        //初始化preAngles
        this.preAngles = {};
        for (var i = 0; i < 16; i++) {
            this.preAngles[i] = 0;
        }

        Blockly.FieldAngleDialog.superClass_.constructor.call(this, defaultValue);
        // this.sourceBlock_ = sourceBlock;
        this.setText(defaultValue);
        this.innerData_ = defaultValue;
    }

    inherits(Blockly.FieldAngleDialog, Blockly.FieldTextInput);

    Blockly.FieldAngleDialog.fromJson = function (element) {
        return new Blockly.FieldAngleDialog(element.defaultValue,
            /* 分两种： 旋转关节球 waistJoint    摇摆关节球 armJoint */
            element.steeringGearType);
    };

    // props
    Blockly.FieldAngleDialog.prototype.pointer = null;
    Blockly.FieldAngleDialog.prototype.onTouch = false;
    Blockly.FieldAngleDialog.prototype.label = 0;
    //这个属性是为了获取当前语句块的其他field，做实时调整角度发送到BLE
    Blockly.FieldAngleDialog.prototype.sourceBlock_ = null;
    Blockly.FieldAngleDialog.prototype.lastTime = null;
    //上一次的角度值，为了关闭时候还原
    Blockly.FieldAngleDialog.prototype.preAngles = null;
    Blockly.FieldAngleDialog.prototype.steeringGearType = null;

    Blockly.FieldAngleDialog.prototype.showEditor_ = function () {
        this.getAnglesFromBLE();
        var dom = document.createElement('div');
        dom.setAttribute("class", "bell-angle-dialog")

        var degreeScale = this.angleDialogRound; //刻度量程
        var panelWidth = this.angleDialogPanelWidth;
        var panelHeight = this.angleDialogPanelHeight;
        var outRadius = this.angleDialogOutRadius;
        var offsetY = this.offsetY;
        var minAngle = this.minAngle; //最小角度

        this.lastTime = new Date().getTime(); //上次点击的时间

        var rad = minAngle / 180 * Math.PI;
        var maginX = (panelWidth - 2 * outRadius * Math.cos(rad)) / 2;
        var outlinePath = 'm' + (panelWidth / 2) + ',' + ((panelHeight + outRadius) / 2 + offsetY) +
            ' l -' + outRadius * Math.cos(rad) + ', -' + outRadius * Math.sin(rad) +
            ' a' + outRadius + ',' + outRadius + ' 0 0 1 ' + (panelWidth - 2 * maginX) + ',0 z';

        //指针路径 'm180,180l-10,-20l10,-100l10,100l-10,20z'
        var pointerPath = 'm' + (panelWidth / 2) + ',' +
            ((panelHeight + outRadius) / 2 + offsetY) +
            ' l-10,-20' + ' l10,-' + Number(outRadius - 20) +
            ' l10,' + Number(outRadius - 20) + ' l-10,20 z';
        //console.log(pointerPath);
        var container = document.createElement('div');
        container.className = 'bell-angle-dialog-top-container';

        var svg = Blockly.utils.createSvgElement('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:html': 'http://www.w3.org/1999/xhtml',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'version': '1.1',
            'width': panelWidth + 'px',
            'height': panelHeight + 'px',
            'style': 'z-index:1000;position:absolute;left:0px;top:0px;',
        }, container);

        //外边框
        var outHalfCircle = Blockly.utils.createSvgElement('path', {
            //'transform': 'translate(60,60)',
            'd': outlinePath,
            'stroke-width': "1",
            'stroke': "rgba(0,0,0,0.5)",
            'fill': "#fff",
            'opacity': '0.5',
        }, svg);

        //绘制刻度
        for (var angle = degreeScale + minAngle; angle < (180 - minAngle); angle += degreeScale) {
            Blockly.utils.createSvgElement('line', {
                'x1': panelWidth / 2 - outRadius,
                'y1': panelHeight / 2 + outRadius / 2 + offsetY,
                'x2': panelWidth / 2 - outRadius + (angle % 45 == 0 ? 10 : 5),
                'y2': panelHeight / 2 + outRadius / 2 + offsetY,
                'class': 'blocklyAngleMarks',
                'stroke': "rgba(0,0,0,0.5)",
                'transform': 'rotate(' + angle + ',' + panelWidth / 2 + ',' +
                    Number(panelHeight / 2 + outRadius / 2 + offsetY) + ')'
            }, svg);
        }

        //绘制指针
        this.pointer = Blockly.utils.createSvgElement('path', {
            'd': pointerPath,
            'stroke-width': "0.1",
            'stroke': "#000",
            'fill': "#76cff0",
            'opacity': '0.8',
            transform: 'rotate(' + 0 + ',' + panelWidth / 2 +
                ',' + Number(panelHeight / 2 + outRadius / 2 + offsetY) + ')'
        }, svg);

        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.zIndex = '1001';
        div.style.top = Number(panelHeight / 2 + outRadius / 2 + offsetY - 10) + 'px';
        div.style.left = Number(panelWidth / 2 - 25) + 'px';

        //根据平台判断内联css样式
        var inputStyle = 'border-radius:10px;width:50px;text-align:center;background:#76cff0;';
        // if (goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPHONE) {
        if (mobile()) {
            inputStyle = 'border-radius:10px;width:50px;text-align:center;background:#76cff0;opacity:1;border:none;';
        }

        //显示刻度input
        this.label = document.createElement('input');
        this.label.style = inputStyle;
        this.label.setAttribute('type', 'text');
        this.label.setAttribute('disabled', 'disabled');
        this.label.value = this.innerData_;

        //标度
        var text1 = document.createElement('div');
        text1.style.position = 'absolute';
        text1.style.zIndex = '1001';
        text1.style.top = Number(panelHeight / 2 + outRadius / 2 + offsetY - 15) + 'px';
        text1.style.left = Number(panelWidth / 9 - 5) + 'px';
        text1.innerText = '-75';

        var text2 = document.createElement('div');
        text2.style.position = 'absolute';
        text2.style.zIndex = '1001';
        text2.style.top = Number(panelHeight / 2 + outRadius / 2 + offsetY - 15) + 'px';
        text2.style.right = Number(panelWidth / 9) + 'px';
        text2.innerText = '75';

        div.appendChild(this.label);
        container.appendChild(svg);
        container.appendChild(div);
        container.appendChild(text1);
        container.appendChild(text2);
        dom.appendChild(container);

        var high = 9999; //Blockly.__DEV__ ? 9999 : Cmd.Priority.HIGH;
        var low = 1; //Blockly.__DEV__ ? 1 : Cmd.Priority.LOW;
        //var that = this;
        Blockly.bindEvent_(outHalfCircle, 'mousemove', this, function (e) {
            if (this.onTouch) this.changeAngle(e, low, 500);
        });
        Blockly.bindEvent_(outHalfCircle, 'mousedown', this, function (e) {
            this.onTouch = true;
            this.changeAngle(e, high);
        });
        Blockly.bindEvent_(this.pointer, 'mousedown', this, function (e) {
            this.onTouch = true;
        });
        Blockly.bindEvent_(this.pointer, 'mousemove', this, function (e) {
            if (this.onTouch) this.changeAngle(e, low, 500);
        });
        Blockly.bindEvent_(svg, 'mouseup', this, function (e) {
            this.onTouch = false;
            this.changeAngle(e, high);
        });
        Blockly.bindEvent_(outHalfCircle, 'mouseout', this, function (e) {
            // this.onTouch = false;
        });
        this.reloadUI(); //需调用，改变UI
        // 确认按钮
        var saveBtn = document.createElement('div');
        saveBtn.className = 'bell-field-dialog-btn';
        dom.appendChild(saveBtn);
        Blockly.bindEvent_(saveBtn, 'mousedown', null, (e) => {
            // 删除语句块时， 如果结果是int 会提示不是node类型， 需要将结果转换为string
            this.setText(this.innerData_);
            Blockly.DialogDiv.hide(); // hide
        });

        var me = this;
        Blockly.DialogDiv.show(dom, function () {
            Blockly.unbindEvent_(saveBtn);
            me.innerData_ = me.text_;
            me.resetAngles();
        });
    }

    //改变角度响应函数
    Blockly.FieldAngleDialog.prototype.changeAngle = function (e, priority) {
        var degreeScale = this.angleDialogRound; //刻度量程
        var panelWidth = this.angleDialogPanelWidth;
        var panelHeight = this.angleDialogPanelHeight;
        var outRadius = this.angleDialogOutRadius;
        var offsetY = this.offsetY;
        var minAngle = this.minAngle; //最小角度

        // 这里拿到的时候整个dialog container的left坐标
        var x = Number(document.querySelector('.bell-angle-dialog').offsetLeft); // 用了transform: translate(-50%, -50%) 所以不能加上 panelWidth / 2
        var y = Number(document.querySelector('.bell-angle-dialog').offsetTop) + outRadius / 2 + offsetY;

        var deltaX = e.clientX - x;
        var deltaY = e.clientY - y;

        var deg = Math.atan((-deltaX / deltaY)) * 180 / Math.PI;
        //console.log(deltaX, deltaY, deg);
        if (isNaN(deg)) {
            return;
        }

        if (deltaY > 0 && deltaX > 0) {
            deg += 180;
        }
        if (deltaY > 0 && deltaX < 0) {
            deg -= 180;
        }
        //按刻度移动
        deg = Math.round(deg / degreeScale) * degreeScale;
        if (deg > (90 - minAngle)) deg = (90 - minAngle);
        if (deg < (-90 + minAngle)) deg = (-90 + minAngle);
        //console.log('deg:', deg);
        this.innerData_ = deg;
        this.reloadUI();
        this.toBLE(deg + 90, priority);
    }

    Blockly.FieldAngleDialog.prototype.reloadUI = function () {
        var panelWidth = this.angleDialogPanelWidth;
        var panelHeight = this.angleDialogPanelHeight;
        var outRadius = this.angleDialogOutRadius;
        var offsetY = this.offsetY;

        this.pointer.setAttribute('transform', 'rotate(' + this.innerData_ + ',' + panelWidth / 2 + ',' +
            Number(panelHeight / 2 + outRadius / 2 + offsetY) + ')');
        this.label.value = this.innerData_ + '°';
    }

    /**
     * 改变值时候发送数据到蓝牙
     * @param 角度
     * @param 优先级
     * @param 采样率
     */
    Blockly.FieldAngleDialog.prototype.toBLE = function (deg, priority) {
        // priority = priority || Blockly.__DEV__ ? 9999 : Cmd.Priority.HIGH;
        priority = priority || 9999; //Blockly.__DEV__ ? priority : Cmd.Priority.HIGH;
        // var fieldList = this.sourceBlock_.inputList[0].fieldRow; //获取这个语句块上面的field
        var balls = [];
        // for (var i = 0; i < fieldList.length; i++) {
        //     // 把所有选中的关节球找出来
        //     if (fieldList[i].name == 'Ball') balls = JSON.parse(fieldList[i].getValue())[0];
        // }
        balls = this.sourceBlock_.inputList[0].fieldRow[1].getValue().split(',');

        for (var i = 0; i < balls.length; i++) {
            if (Blockly.__DEV__) {
                console.log('ball:', balls[i], 'deg:', deg);
            } else {
                switch (this.steeringGearType) {
                    case 'waistJoint':
                        if (priority === 9999) {
                            // BellBleMotion.waistMotionHighPriority(balls[i], deg);
                        } else {
                            // BellBleMotion.waistMotionLowPriority(balls[i], deg);
                        }
                        break;
                    case 'armJoint':
                        if (priority === 9999) {
                            // BellBleMotion.armMotionHighPriority(balls[i], deg);
                        } else {
                            // BellBleMotion.armMotionLowPriority(balls[i], deg);
                        }
                        break;
                }
            }
        }
    }

    /**
     * 读取角度，用于关闭对话框时候还原
     */
    Blockly.FieldAngleDialog.prototype.getAnglesFromBLE = function () {
        // if (Blockly.__DEV__) {
        console.log(this.preAngles);
        //     return;
        // }
        if (!window.BellBleFeedback) return;
        var that = this;
        switch (this.steeringGearType) {
            case 'waistJoint':
                BellBleFeedback.getWaistAngles(function (arr) {
                    console.log('hjoint:', arr);
                    that.preAngles = arr;
                });
                break;
            case 'armJoint':
                BellBleFeedback.getArmAngles(function (arr) {
                    console.log('vjoint:', arr);
                    that.preAngles = arr;
                });
                break;
        }
    };

    /**
     * 还原之前读取的角度
     */
    Blockly.FieldAngleDialog.prototype.resetAngles = function () {
        // if (Blockly.__DEV__) {
        console.log("reset", this.preAngles);
        //   return;
        // }  
        if (!window.BellBleFeedback) return;
        switch (this.steeringGearType) {
            case 'waistJoint':
                BellBleFeedback.setWaistAngles(this.preAngles);
                break;
            case 'armJoint':
                BellBleFeedback.setArmAngles(this.preAngles);
                break;
        }
    };


    Blockly.FieldAngleDialog.prototype.dispose = function () {
        this.pointer = null;
        this.onTouch = null;
        this.label = null;
        this.sourceBlock_ = null;
        this.lastTime = null;
        this.preAngles = null;
        // Blockly.FieldAngleDialog.prototype.dispose.call(this);
    };


    Blockly.Field.register('field_angleDialog', Blockly.FieldAngleDialog);
}