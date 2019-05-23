export default function (Blockly) {
    Blockly.DialogDiv = function () {
        // empty
    };

    Blockly.DialogDiv.maskDiv_ = null;
    Blockly.DialogDiv.dialogDiv_ = null;
    Blockly.DialogDiv.onHide_ = null;
    // 是否cancelable
    Blockly.DialogDiv.cancelable_ = true;

    // 内容事件： 我们需要捕获，因为dialogDiv_有事件会dismiss dialog
    Blockly.DialogDiv.contentWrapper_ = null;

    // android下我们监听软键盘弹出/消失
    Blockly.DialogDiv.androidSoftKeyboardShowListener_ = null;
    Blockly.DialogDiv.androidSoftKeyboardHideListener_ = null;

    Blockly.DialogDiv.createDom = function () {
        var rootDom = document.body;
        // mask
        if (!Blockly.DialogDiv.maskDiv_) {
            Blockly.DialogDiv.maskDiv_ = document.createElement('div');
            rootDom.appendChild(Blockly.DialogDiv.maskDiv_);

            Blockly.DialogDiv.maskDiv_.style.position = 'absolute';
            Blockly.DialogDiv.maskDiv_.style.width = '100%';
            Blockly.DialogDiv.maskDiv_.style.height = '100%';
            Blockly.DialogDiv.maskDiv_.style['background-color'] = 'black';
            Blockly.DialogDiv.maskDiv_.style.opacity = 0.5;
            Blockly.DialogDiv.maskDiv_.style.display = 'none';
            Blockly.DialogDiv.maskDiv_.style['z-index'] = 99999 + 1;
            Blockly.DialogDiv.maskDiv_.style.top = '0px';
            Blockly.DialogDiv.maskDiv_.style.left = '0px';
        }
        // container
        if (!Blockly.DialogDiv.dialogDiv_) {
            Blockly.DialogDiv.dialogDiv_ = document.createElement('div');
            rootDom.appendChild(Blockly.DialogDiv.dialogDiv_);

            Blockly.DialogDiv.dialogDiv_.style.position = 'absolute';
            Blockly.DialogDiv.dialogDiv_.style.width = '100%';
            Blockly.DialogDiv.dialogDiv_.style.height = '100%';
            Blockly.DialogDiv.dialogDiv_.style.display = 'none';
            Blockly.DialogDiv.dialogDiv_.style['z-index'] = 99999 + 1;
            Blockly.DialogDiv.dialogDiv_.style.top = '0px';
            Blockly.DialogDiv.dialogDiv_.style.left = '0px';

            // 点击mask部分弹窗消失
            Blockly.bindEvent_(Blockly.DialogDiv.dialogDiv_, 'mouseup', null,
                function (e) {
                    if (Blockly.DialogDiv.cancelable_) Blockly.DialogDiv.hide();
                });
        }
    };

    Blockly.DialogDiv.show = function (contentDom, opt_onHide, opt_notCancelable) {
        if (!Blockly.DialogDiv.maskDiv_ ||
            !Blockly.DialogDiv.dialogDiv_) {
            Blockly.DialogDiv.createDom();
        }

        // 防止重复show
        Blockly.DialogDiv.hide();

        // 将content注入到container
        Blockly.DialogDiv.dialogDiv_.appendChild(contentDom);

        Blockly.DialogDiv.contentWrapper_ = Blockly.bindEvent_(contentDom,
            'mouseup', null, function (e) {
                e.stopPropagation();
            }
        );

        // 显示它
        if (Blockly.DialogDiv.dialogDiv_.style.display === 'block') return;
        Blockly.DialogDiv.maskDiv_.style.display = 'block';
        Blockly.DialogDiv.dialogDiv_.style.display = 'block';
        Blockly.DialogDiv.onHide_ = opt_onHide || function () {
        };
        Blockly.DialogDiv.cancelable_ = !opt_notCancelable;

        if (!!window.cordova && window.cordova.platformId === 'android') {
            if (Blockly.DialogDiv.dialogDiv_) {
                Blockly.utils.addClass(Blockly.DialogDiv.dialogDiv_,
                    'neuronDialogPromptTransition');
            }
            Blockly.DialogDiv.androidSoftKeyboardShowListener_ = function (e) {
                var keyboardHeight = e.keyboardHeight;
                var screenHeight = window.innerHeight;
                var y0 = screenHeight / 2;
                var y1 = (screenHeight - keyboardHeight) / 2;

                if (Blockly.DialogDiv.dialogDiv_) {
                    Blockly.DialogDiv.dialogDiv_.style.top = (y1 - y0) + 'px';
                }
            };
            Blockly.DialogDiv.androidSoftKeyboardHideListener_ = function () {
                if (Blockly.DialogDiv.dialogDiv_) {
                    Blockly.DialogDiv.dialogDiv_.style.top = '0px';
                }
            };
            window.addEventListener('native.keyboardshow',
                Blockly.DialogDiv.androidSoftKeyboardShowListener_);
            window.addEventListener('native.keyboardhide',
                Blockly.DialogDiv.androidSoftKeyboardHideListener_);
        }
    };

    Blockly.DialogDiv.hide = function () {
        if (Blockly.DialogDiv.dialogDiv_) {
            Blockly.utils.removeClass(Blockly.DialogDiv.dialogDiv_,
                'neuronDialogPromptTransition');
        }
        if (Blockly.DialogDiv.androidSoftKeyboardShowListener_) {
            window.removeEventListener('native.keyboardshow',
                Blockly.DialogDiv.androidSoftKeyboardShowListener_);
            Blockly.DialogDiv.androidSoftKeyboardShowListener_ = null;
        }
        if (Blockly.DialogDiv.androidSoftKeyboardHideListener_) {
            // fix known issue: android soft-keyboard dismiss delay some milliseconds
            // if we should call the onHide manually ensure the state is right
            // WE DO NOT ALLOW THE DIALOG DIV ALWAYS AT THE TOP OF SCREEN! :(
            Blockly.DialogDiv.androidSoftKeyboardHideListener_();

            window.removeEventListener('native.keyboardhide',
                Blockly.DialogDiv.androidSoftKeyboardHideListener_);
            Blockly.DialogDiv.androidSoftKeyboardHideListener_ = null;
        }
        if (!Blockly.DialogDiv.dialogDiv_ || !Blockly.DialogDiv.maskDiv_) return;
        if (Blockly.DialogDiv.dialogDiv_.style.display === 'none') return;

        Blockly.DialogDiv.maskDiv_.style.display = 'none';
        Blockly.DialogDiv.dialogDiv_.style.display = 'none';

        Blockly.DialogDiv.clearContent();

        if (Blockly.DialogDiv.onHide_) Blockly.DialogDiv.onHide_();
        Blockly.DialogDiv.onHide_ = null;

        if (Blockly.DialogDiv.contentWrapper_) Blockly.unbindEvent_(Blockly.DialogDiv.contentWrapper_);
        Blockly.DialogDiv.contentWrapper_ = null;

        Blockly.DialogDiv.cancelable_ = true;
    };

    Blockly.DialogDiv.clearContent = function () {
        if (!Blockly.DialogDiv.dialogDiv_) return;

        while (Blockly.DialogDiv.dialogDiv_.hasChildNodes()) {
            Blockly.DialogDiv.dialogDiv_.removeChild(Blockly.DialogDiv.dialogDiv_.lastChild);
        }
    };
};