
export default function (Blockly) {
    Blockly.Dialogs = {};

    // 弹窗生成器
    // 参数:
    // @param module String @see Blockly.FieldModuleDialog enum
    // @param ballList Array 所有已选球列表，单选模式下只有一个item
    // @param multiMode Boolean 是否多选模式
    // @param focusSeq Integer 当前焦点位置，这里值为1-15
    // @param onChange(newBallList) Function 点击ok button之后的回调，回传新选中的newBallList
    Blockly.Dialogs.generateModuleDialog = function (module, ballList, multiMode, focusSeq,
        onChange) {
        switch (module) {
            case Blockly.FieldModuleDialog.MODULE_MOTOR:
                return Blockly.Dialogs.generateModuleMotorDialog(ballList, multiMode, focusSeq, onChange);
            case Blockly.FieldModuleDialog.MODULE_WAIST_JOINT:
                return Blockly.Dialogs.generateModuleWaistJointDialog(ballList, multiMode, focusSeq, onChange);
            case Blockly.FieldModuleDialog.MODULE_ARM_JOINT:
                return Blockly.Dialogs.generateModuleArmJointDialog(ballList, multiMode, focusSeq, onChange);
            case Blockly.FieldModuleDialog.MODULE_TOUCH:
                return Blockly.Dialogs.generateModuleTouchDialog(ballList, multiMode, focusSeq, onChange);
            case Blockly.FieldModuleDialog.MODULE_COLOR:
                return Blockly.Dialogs.generateModuleColorDialog(ballList, multiMode, focusSeq, onChange);
            case Blockly.FieldModuleDialog.MODULE_INFRARED:
                return Blockly.Dialogs.generateModuleInfraredDialog(ballList, multiMode, focusSeq, onChange);
            default:
                throw 'Unknown module: ' + this.module_;
        }
    };

    // 选中球球的动画
    Blockly.Dialogs.addDashedCircleSvg_ = function (parent, isYellow) {
        var yellow = '#ffd14f';
        var blue = '#76cff0';
        var color = isYellow ? yellow : blue;

        var svg = Blockly.utils.createSvgElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '100%',
            height: '100%',
            viewBox: '0 0 100 100',
            style: `stroke: ${color}; animation: spin 10s linear infinite;` /* spin in the dialogs.css */
        }, parent);
        svg.style.position = 'absolute';
        svg.style.top = '0px';
        svg.style.left = '0px';

        var degrees = [
            '-88deg',
            '2deg',
            '92deg',
            '182deg'
        ]
        for (var i = 0; i < degrees.length; i++) {
            Blockly.utils.createSvgElement('circle', {
                cx: '50',
                cy: '50',
                r: '41',
                fill: 'none',
                style: `stroke-width: 8; stroke-dasharray: 255; stroke-dashoffset: 205;transform: rotate(${degrees[i]});transform-origin: center center;`
            }, svg);
        }
        return svg;
    };

    // 公共部分
    /**
     * 弹框top图片
     * arg0 imgUrl 图片路径
     */
    Blockly.Dialogs.generateTopPane = function (imgUrl) {
        var topPane = document.createElement('div');
        topPane.style.width = '100%';
        topPane.style.height = '30%';
        topPane.style.boxSizing = 'border-box';
        topPane.style.padding = Math.min(window.innerWidth, window.innerHeight) / 40 + 'px';
        var img = document.createElement('img');
        img.setAttribute('src', require('../../static/images/'+imgUrl));
        img.style.height = '100%';
        topPane.appendChild(img);
        return topPane;
    }
    // 生成15个ball
    Blockly.Dialogs.generateBottomPane = function (ballList, multiMode, focusSeq, onChange) {
        ballList = JSON.parse(JSON.stringify(ballList)); // simple deep clone
        ballList = ballList.sort(function (a, b) {
            return a - b;
        }); // ASC
        focusSeq = focusSeq || '1';
        var focusIndex = ballList.indexOf(focusSeq);
        if (focusIndex < 0) throw 'Invalid focus index: ' + focusSeq;
        var eventWrappers = [];

        // 记住传入的值
        var originBallList = ballList.slice(); // shadow clone
        var originFocusSeq = focusSeq;

        var windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        var bottomPane = document.createElement('div');
        bottomPane.style.width = '100%';
        bottomPane.style.height = '70%';
        bottomPane.style.boxSizing = 'border-box';
        bottomPane.style.padding = Math.min(windowSize.width, windowSize.height) / 40 + 'px';
        var gridPane = document.createElement('div');
        gridPane.style.backgroundColor = '#f4fcff';
        gridPane.style.width = '100%';
        gridPane.style.height = '100%';
        gridPane.style.borderRadius = Math.min(windowSize.width, windowSize.height) / 50 + 'px';
        gridPane.style.display = 'grid';
        gridPane.style['grid-template-columns'] = '1fr 1fr 1fr 1fr 1fr';
        gridPane.style['grid-tempalte-rows'] = '1fr 1fr 1fr';
        bottomPane.appendChild(gridPane);
        // 15选项
        for (var i = 0; i < 15; i++) {
            /* 结构:
            <div id="gridItem">
              <div id="container">
                <div id="dot">1</div>
                <svg id="dashedSpinner"/>
              </div>
            </div>
            */
            var gridItem = document.createElement('div');
            gridItem.style.position = 'relative';
            gridPane.appendChild(gridItem);

            var container = document.createElement('div');
            container.style.width = '3rem';
            container.style.height = '3rem';
            container.style.position = 'absolute';
            container.style.left = '50%';
            container.style.top = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            gridItem.appendChild(container);

            var dot = document.createElement('div');
            dot.style.width = '2rem';
            dot.style.height = '2rem';
            dot.style.borderRadius = '1rem';
            dot.style.backgroundColor = ballList.indexOf(i + 1 + '') > -1 ? '#76cff0' : '#dadada';
            dot.textContent = i + 1;
            dot.style.color = 'white';
            dot.style.textAlign = 'center';
            dot.style.lineHeight = '2rem';
            dot.style.position = 'absolute';
            dot.style.left = '50%';
            dot.style.top = '50%';
            dot.style.transform = 'translate(-50%, -50%)';
            container.appendChild(dot);

            var spinner = Blockly.Dialogs.addDashedCircleSvg_(container);
            spinner.style.visibility = focusSeq == i + 1 ? 'visible' : 'hidden';
        }
        var okButton = document.createElement('img');
        okButton.style.position = 'absolute';
        okButton.style.width = '5rem';
        okButton.style.left = '50%';
        okButton.style.bottom = '0px';
        okButton.style.transform = 'translate(-50%, 50%)';
        okButton.setAttribute('src', require('../../static/images/dialogs/ok.png'));

        eventWrappers.push(
            Blockly.bindEvent_(gridPane, 'mouseup', null, function (e) {
                var target = e.target;
                if (target === gridPane) return;
                if (target.parentNode === gridPane) return;

                function indexOf(el, childNodes) {
                    var children = childNodes,
                        i = 0;
                    for (; i < children.length; i++) {
                        if (children[i] == el) {
                            return i;
                        }
                    }
                    return -1;
                }

                // 当多选时，取消某一个选中，焦点自动跳到之前选中的某一个item
                function nextAuto(index /*当前取消选中的index*/) {
                    var next = -1;
                    for (var i = index - 1; i >= 1; i--) {
                        if (ballList.indexOf(i + '') > -1) {
                            return i;
                        }
                    }
                    for (var i = index + 1; i <= 15; i++) {
                        if (ballList.indexOf(i + '') > -1) {
                            return i;
                        }
                    }
                    return next;
                }

                // 当点击spinner svg或者dot元素时
                if (target.parentNode.parentNode &&
                    target.parentNode.parentNode.parentNode === gridPane) {
                    var itemIndex = indexOf(target.parentNode.parentNode, gridPane.childNodes);
                    var dot = target.parentNode.childNodes[0];
                    var spinner = target.parentNode.childNodes[1];
                    if (itemIndex > -1) {
                        // 当前item已经在ballList
                        if (ballList.indexOf(itemIndex + 1 + '') > -1) {
                            if (!multiMode) {
                                // 单选情况，不支持取消选中
                            } else {
                                // 焦点已经在了则先取消，否则先移动焦点
                                if (focusSeq == itemIndex + 1) {
                                    // 至少保证一项选中
                                    if (ballList.length > 1) {
                                        dot.style.backgroundColor = '#dadada';
                                        spinner.style.visibility = 'hidden';
                                        Blockly.utils.arrayRemove(ballList, itemIndex + 1 + '');
                                        // 自动找到下一个焦点
                                        var nextAutoIndex = nextAuto(itemIndex + 1); // 1-15
                                        if (nextAutoIndex > 0) {
                                            var nextItem = gridPane.childNodes[nextAutoIndex - 1];
                                            var nextDot = nextItem.childNodes[0].childNodes[0];
                                            var nextSpinner = nextItem.childNodes[0].childNodes[1];
                                            nextDot.style.backgroundColor = '#76cff0';
                                            nextSpinner.style.visibility = 'visible';
                                            focusSeq = nextAutoIndex + '';
                                        }
                                    }
                                } else {
                                    var prevItem = gridPane.childNodes[focusSeq - 1];
                                    var prevDot = prevItem.childNodes[0].childNodes[0];
                                    var prevSpinner = prevItem.childNodes[0].childNodes[1];
                                    prevSpinner.style.visibility = 'hidden';

                                    focusSeq = itemIndex + 1 + '';
                                    spinner.style.visibility = 'visible';
                                }
                            }
                        } else { // 当前item还未加入ballList
                            var prevItem = gridPane.childNodes[focusSeq - 1];
                            var prevDot = prevItem.childNodes[0].childNodes[0];
                            var prevSpinner = prevItem.childNodes[0].childNodes[1];
                            if (!multiMode) {
                                // 单选逻辑:
                                // 1. 将之前item选中去掉
                                prevDot.style.backgroundColor = '#dadada';
                                prevSpinner.style.visibility = 'hidden';
                                Blockly.utils.arrayRemove(ballList, focusSeq);
                                // 2. 添加新的item
                                ballList.push(itemIndex + 1 + '');
                                // 3. 更新焦点
                                dot.style.backgroundColor = '#76cff0';
                                spinner.style.visibility = 'visible';
                                focusSeq = itemIndex + 1 + '';
                            } else {
                                // 多选逻辑
                                // 加入ballList, 并获取焦点
                                ballList.push(itemIndex + 1 + '');
                                dot.style.backgroundColor = '#76cff0';
                                spinner.style.visibility = 'visible';
                                focusSeq = itemIndex + 1 + '';

                                prevSpinner.style.visibility = 'hidden';
                            }
                        }
                    }
                    ballList = ballList.sort(function (a, b) {
                        return a - b;
                    });
                }
            })
        );

        eventWrappers.push(
            Blockly.bindEvent_(okButton, 'mouseup', null, function (e) {
                Blockly.DialogDiv.hide();
                if (!Blockly.utils.arrayEqualsIgnoreOrder(ballList, originBallList)) {
                    onChange(ballList);
                }
            })
        );

        return {
            bottomPane,
            okButton,
            eventWrappers
        };
    }
    /**
     * 白色背景
     * arg0 ~ arr1 width, height
     */
    Blockly.Dialogs.generateBackGroundColor = function (width, height) {
        var dom = document.createElement('div');
        dom.style.width = width + 'px';
        dom.style.height = height + 'px';
        dom.style.backgroundColor = 'white';
        dom.style.position = 'absolute';
        dom.style.left = (window.innerWidth - width) / 2 + 'px';
        dom.style.top = (window.innerHeight - height) / 2 + 'px';
        dom.style.borderRadius = Math.min(window.innerWidth, window.innerHeight) / 50 + 'px';
        dom.style.padding = Math.min(window.innerWidth, window.innerHeight) / 40 + 'px';
        return dom;
    }
    /**
     * 遍历卡片式弹框
     * arg0 ~ arg3 width, height, arrs, current
     */
    Blockly.Dialogs.generateForEachItems = function (width, height, arrs, current) {
        // 列表
        var listBox = document.createElement('div');
        listBox.style.width = width + 'px';
        listBox.style.height = height + 'px';
        listBox.style.display = 'flex';
        listBox.style.justifyContent = 'space-between';

        for (var i = 0; i < arrs.length; i++) {
            var listItem = document.createElement('div');
            listItem.style.padding = Math.min(window.innerWidth, window.innerHeight) / 20 + 'px';
            listItem.style.width = '48%';
            listItem.style.height = height + 'px';
            listItem.style.border = '2px solid #f2fdff';
            listItem.style.borderRadius = Math.min(window.innerWidth, window.innerHeight) / 50 + 'px';
            listItem.style.backgroundColor = '#f2fdff';
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.justifyContent = 'center';
            listItem.style.flexDirection = 'column';
            listItem.style.boxSizing = 'border-box';

            var itemImg = document.createElement('img');
            itemImg.setAttribute("src", require('../../static/images/' + arrs[i].imgUrl));
            itemImg.style.width = '60px';
            itemImg.style.height = '60px';

            var itemTxt = document.createElement('div');
            itemTxt.style.marginTop = '2rem';
            itemTxt.innerHTML = arrs[i].txt;

            listItem.appendChild(itemImg);
            listItem.appendChild(itemTxt);
            listBox.appendChild(listItem);
        }
        (current == null) ? null : listBox.childNodes[current].style.border = '2px solid #f60';
        return listBox;
    }

    // 驱动球
    Blockly.Dialogs.generateModuleMotorDialog = function (ballList, multiMode, focusSeq, onChange) {
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;
        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        var topPane = Blockly.Dialogs.generateTopPane('dialogs/module_motor.png');
        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 水平（旋转）关节球
    Blockly.Dialogs.generateModuleWaistJointDialog = function (ballList, multiMode, focusSeq, onChange) {
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;

        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);

        var topPane = Blockly.Dialogs.generateTopPane('dialogs/joint/hjoint_ball.png');
        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 摇摆关节球
    Blockly.Dialogs.generateModuleArmJointDialog = function (ballList, multiMode, focusSeq, onChange) {
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;

        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        var topPane = Blockly.Dialogs.generateTopPane('dialogs/joint/joint_ball.png');
        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 触碰传感器
    Blockly.Dialogs.generateModuleTouchDialog = function (ballList, multiMode, focusSeq, onChange) {
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;
        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        // anim
        var topPane = document.createElement('div');
        topPane.className = 'bell-ballList-indicateBallContainer';

        var wallStyle = 'width: 400px;margin-left: 80px;margin-top: 40px;';
        var wall = document.createElement('img');
        wall.style = wallStyle;
        wall.setAttribute('src', require('../../static/images/dialogs/sensor/wall_near.png'));

        var ballStyle = 'width: 60px;position: absolute;top: 140px;left: 280px;';
        var ball = document.createElement('img');
        ball.style = ballStyle;
        ball.setAttribute('src', require('../../static/images/dialogs/sensor/touch.png'));

        var handStyle = 'width: 80px;position: absolute;top: 80px;left: 280px;animation: 1s bell-ballList-hand-top infinite alternate;';
        var hand = document.createElement('img');
        hand.style = handStyle;
        hand.setAttribute('src', require('../../static/images/dialogs/sensor/hand_top.png'));

        topPane.appendChild(wall);
        topPane.appendChild(ball);
        topPane.appendChild(hand);

        //disabled
        // show dialog 开启定时器 发送数据
        // hide dialog 销毁定时器
        var indicatorLabel = document.createElement('label');
        indicatorLabel.className = 'bell-ballList-indicatorLabel disabled';
        indicatorLabel.style.top = '80px';

        var indicatorLabelTitle = document.createElement('span');
        indicatorLabelTitle.className = 'title'

        var indicatorLabelSubtitle = document.createElement('span');
        indicatorLabelSubtitle.className = 'subtitle';
        indicatorLabelSubtitle.innerHTML = 'Touch';

        indicatorLabel.appendChild(indicatorLabelTitle);
        indicatorLabel.appendChild(indicatorLabelSubtitle);
        topPane.appendChild(indicatorLabel);

        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 颜色传感器
    Blockly.Dialogs.generateModuleColorDialog = function (ballList, multiMode, focusSeq, onChange) {
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;

        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        // anim
        var topPane = document.createElement('div');
        topPane.className = 'bell-ballList-indicateBallContainer';

        var colorStyle = 'width:400px;height:60px;margin-left:80px;margin-top:40px;';
        var colorDiv = document.createElement('div');
        colorDiv.style = colorStyle;

        var ballStyle = 'width: 60px;position: absolute;top: 70px;left: 150px;';
        var ball = document.createElement('img');
        ball.style = ballStyle;
        ball.setAttribute('src', require('../../static/images/dialogs/sensor/color_ball.png'));

        colorDiv.appendChild(ball);

        var waves = [];
        for (var i = 0; i < 3; i++) {
            var waveStyle = 'height: 80px;position: absolute;top: 60px;left:' + (220 + 10 * i) + 'px;' +
                'animation: 1s ' + 'bell-ballList-wave' + (i + 1) + ' infinite;';
            var createImg = document.createElement('img');
            createImg.style = waveStyle;
            createImg.style.left = (220 + 10 * i) + 'px;';

            createImg.setAttribute('src', require('../../static/images/dialogs/color/wave' + (i + 1) + '.png'));
            waves[i] = createImg;

            colorDiv.appendChild(waves[i]);
        }
        topPane.appendChild(colorDiv);

        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 红外传感器
    Blockly.Dialogs.generateModuleInfraredDialog = function (ballList, multiMode, focusSeq, onChange) {
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.5;

        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        // anim
        var topPane = document.createElement('div');
        topPane.className = 'bell-ballList-indicateBallContainer';


        var wallStyle = 'width: 400px;margin-left: 80px;margin-top: 40px;';
        var wall = document.createElement('img');
        wall.style = wallStyle;
        wall.setAttribute('src', require('../../static/images/dialogs/sensor/wall_far.png'));

        var ballStyle = 'width: 60px;position: absolute;top: 90px;left: 160px;';
        var ball = document.createElement('img');
        ball.style = ballStyle;
        ball.setAttribute('src', require('../../static/images/dialogs/sensor/infrared.png'));

        var handStyle = 'height: 80px;position: absolute;top: 80px;left: 400px;animation: 1s bell-ballList-hand-left infinite alternate;';
        var hand = document.createElement('img');
        hand.style = handStyle;
        hand.setAttribute('src', require('../../static/images/dialogs/sensor/hand_right.png'));

        var lineStyle = 'display: inline-block;width: 160px;height: 2px;background: gray;top: 120px;left: 230px;position: absolute;animation: 1s bell-ballList-line-width infinite alternate;';
        var line = document.createElement('div');
        line.style = lineStyle;

        topPane.appendChild(wall);
        topPane.appendChild(ball);
        topPane.appendChild(line);
        topPane.appendChild(hand);

        //disabled
        // show dialog 开启定时器 发送数据
        // hide dialog 销毁定时器
        var indicatorLabel = document.createElement('label');
        indicatorLabel.className = 'bell-ballList-indicatorLabel disabled';
        indicatorLabel.style.top = '80px';

        var indicatorLabelTitle = document.createElement('span');
        indicatorLabelTitle.className = 'title'

        var indicatorLabelSubtitle = document.createElement('span');
        indicatorLabelSubtitle.className = 'subtitle';
        indicatorLabelSubtitle.innerHTML = 'Touch';

        indicatorLabel.appendChild(indicatorLabelTitle);
        indicatorLabel.appendChild(indicatorLabelSubtitle);
        topPane.appendChild(indicatorLabel);

        var bottomPane = Blockly.Dialogs.generateBottomPane(ballList, multiMode, focusSeq, onChange);

        dom.appendChild(topPane);
        dom.appendChild(bottomPane.bottomPane);
        dom.appendChild(bottomPane.okButton);

        return {
            dom: dom,
            eventWrappers: bottomPane.eventWrappers,
        };
    };
    // 阻塞非阻塞
    Blockly.Dialogs.generateModuleBlockDialog = function (src, onChange) {
        var eventWrappers = [];
        // 当前状态
        var current = (src.split("/images/")[1] == 'blk_ic_blocked.png') ? 0 : 1;
        // TODO:
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.35;
        var dateArrs = [
            {
                'imgUrl': 'blk_ic_blocked.png',
                'txt': Blockly.Msg.BELL_BLOCKING_TYPES,
            },
            {
                'imgUrl': 'blk_ic_nonblocked.png',
                'txt': Blockly.Msg.BELL_NON_BLOCKING_TYPES,
            },
        ];

        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        // 列表
        var listBox = Blockly.Dialogs.generateForEachItems(WIDTH, HEIGHT, dateArrs, current);
        dom.appendChild(listBox);

        eventWrappers.push(
            Blockly.bindEvent_(listBox, 'mouseup', null, function (e) {
                Blockly.DialogDiv.hide();
                if (e.target === listBox) {
                    return;
                } else {
                    if (e.target === listBox.childNodes[0] || e.target === listBox.childNodes[0].firstElementChild) {
                        onChange(require('../../static/images/blk_ic_blocked.png'));
                    } else {
                        onChange(require('../../static/images/blk_ic_nonblocked.png'));
                    }
                }
            })
        );

        return {
            dom: dom,
            eventWrappers: eventWrappers
        }
    };
    // [顺时针, 逆时针]
    Blockly.Dialogs.generateModuleClockwiseDialog = function (defaultValue, onChange) {
        var eventWrappers = [];
        var WIDTH = window.innerWidth * 0.5;
        var HEIGHT = window.innerHeight * 0.15;
        var dateArrs = [
            {
                'imgUrl': 'blk_ic_blocked.png',
                'txt': Blockly.Msg.BELL_OPTIONS_CW,
            },
            {
                'imgUrl': 'blk_ic_nonblocked.png',
                'txt': Blockly.Msg.BELL_OPTIONS_CCW,
            },
        ];
        // 背景
        var dom = Blockly.Dialogs.generateBackGroundColor(WIDTH, HEIGHT);
        // 列表
        var listBox = Blockly.Dialogs.generateForEachItems(WIDTH, HEIGHT, dateArrs, null);
        dom.appendChild(listBox);

        eventWrappers.push(
            Blockly.bindEvent_(listBox, 'mouseup', null, function (e) {
                Blockly.DialogDiv.hide();
                if (e.target === listBox) {
                    return;
                } else {
                    if (e.target === listBox.childNodes[0] || e.target === listBox.childNodes[0].firstElementChild) {
                        onChange("0");
                    } else {
                        onChange("1");
                    }
                }
            })
        );

        return {
            dom: dom,
            eventWrappers: eventWrappers
        }
    };
}