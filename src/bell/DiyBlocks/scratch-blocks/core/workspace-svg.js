export default function (Blockly) {
    /**
     * Look up the gesture that is tracking this touch stream on this workspace.
     * May create a new gesture.
     * @param {!Event} e Mouse event or touch event.
     * @return {Blockly.TouchGesture} The gesture that is tracking this touch
     *     stream, or null if no valid gesture exists.
     * @package
     */
    Blockly.WorkspaceSvg.prototype.getGesture = function (e) {
        var isStart = (e.type == 'mousedown' || e.type == 'touchstart' ||
            e.type == 'pointerdown');

        var gesture = this.currentGesture_;
        if (gesture) {
            if (isStart && gesture.hasStarted()) {
                console.warn('tried to start the same gesture twice');
                // That's funny.  We must have missed a mouse up.
                // Cancel it, rather than try to retrieve all of the state we need.
                gesture.cancel();
                return null;
            }
            return gesture;
        }

        // No gesture existed on this workspace, but this looks like the start of a
        // new gesture.
        if (isStart) {
            this.currentGesture_ = new Blockly.TouchGesture(e, this);
            return this.currentGesture_;
        }
        // No gesture existed and this event couldn't be the start of a new gesture.
        return null;
    };

    /**
     * Bind an event to a function call.  When calling the function, verifies that
     * it belongs to the touch stream that is currently being processed, and splits
     * multitouch events into multiple events as needed.
     * @param {!EventTarget} node Node upon which to listen.
     * @param {string} name Event name to listen to (e.g. 'mousedown').
     * @param {Object} thisObject The value of 'this' in the function.
     * @param {!Function} func Function to call when event is triggered.
     * @param {boolean=} opt_noCaptureIdentifier True if triggering on this event
     *     should not block execution of other event handlers on this touch or other
     *     simultaneous touches.
     * @param {boolean=} opt_noPreventDefault True if triggering on this event
     *     should prevent the default handler.  False by default.  If
     *     opt_noPreventDefault is provided, opt_noCaptureIdentifier must also be
     *     provided.
     * @return {!Array.<!Array>} Opaque data that can be passed to unbindEvent_.
     */
    Blockly.bindEventWithChecks_ = function (node, name, thisObject, func,
        opt_noCaptureIdentifier, opt_noPreventDefault) {
        var handled = false;
        var wrapFunc = function (e) {
            var captureIdentifier = !opt_noCaptureIdentifier;
            // Handle each touch point separately.  If the event was a mouse event, this
            // will hand back an array with one element, which we're fine handling.
            var events = Blockly.Touch.splitEventByTouches(e);
            for (var i = 0, event; event = events[i]; i++) {
                if (captureIdentifier && !Blockly.Touch.shouldHandleEvent(event)) {
                    continue;
                }
                Blockly.Touch.setClientFromTouch(event);
                if (thisObject) {
                    func.call(thisObject, event);
                } else {
                    func(event);
                }
                handled = true;
            }
        };

        var bindData = [];
        if (global.PointerEvent && (name in Blockly.Touch.TOUCH_MAP)) {
            for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
                node.addEventListener(type, wrapFunc, false);
                bindData.push([node, type, wrapFunc]);
            }
        } else {
            node.addEventListener(name, wrapFunc, false);
            bindData.push([node, name, wrapFunc]);

            // Add equivalent touch event.
            if (name in Blockly.Touch.TOUCH_MAP) {
                var touchWrapFunc = function (e) {
                    wrapFunc(e);
                    // Calling preventDefault stops the browser from scrolling/zooming the
                    // page.
                    var preventDef = !opt_noPreventDefault;
                    if (handled && preventDef) {
                        e.preventDefault();
                    }
                };
                for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
                    node.addEventListener(type, touchWrapFunc, false);
                    bindData.push([node, type, touchWrapFunc]);
                }
            }
        }
        return bindData;
    };


    /**
     * Bind an event to a function call.  Handles multitouch events by using the
     * coordinates of the first changed touch, and doesn't do any safety checks for
     * simultaneous event processing.
     * @deprecated in favor of bindEventWithChecks_, but preserved for external
     * users.
     * @param {!EventTarget} node Node upon which to listen.
     * @param {string} name Event name to listen to (e.g. 'mousedown').
     * @param {Object} thisObject The value of 'this' in the function.
     * @param {!Function} func Function to call when event is triggered.
     * @return {!Array.<!Array>} Opaque data that can be passed to unbindEvent_.
     */
    Blockly.bindEvent_ = function (node, name, thisObject, func) {
        var wrapFunc = function (e) {
            if (thisObject) {
                func.call(thisObject, e);
            } else {
                func(e);
            }
        };

        var bindData = [];
        var window = global['window'];
        if (window && window.PointerEvent && (name in Blockly.Touch.TOUCH_MAP)) {
            for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
                node.addEventListener(type, wrapFunc, false);
                bindData.push([node, type, wrapFunc]);
            }
        } else {
            node.addEventListener(name, wrapFunc, false);
            bindData.push([node, name, wrapFunc]);

            // Add equivalent touch event.
            if (name in Blockly.Touch.TOUCH_MAP) {
                var touchWrapFunc = function (e) {
                    // Punt on multitouch events.
                    if (e.changedTouches && e.changedTouches.length == 1) {
                        // Map the touch event's properties to the event.
                        var touchPoint = e.changedTouches[0];
                        e.clientX = touchPoint.clientX;
                        e.clientY = touchPoint.clientY;
                    }
                    wrapFunc(e);

                    // Stop the browser from scrolling/zooming the page.
                    e.preventDefault();
                };
                for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
                    node.addEventListener(type, touchWrapFunc, false);
                    bindData.push([node, type, touchWrapFunc]);
                }
            }
        }
        return bindData;
    };

    /**
     * Unbind one or more events event from a function call.
     * @param {!Array.<!Array>} bindData Opaque data from bindEvent_.
     *     This list is emptied during the course of calling this function.
     * @return {!Function} The function call.
     */
    Blockly.unbindEvent_ = function (bindData) {
        while (bindData.length) {
            var bindDatum = bindData.pop();
            var node = bindDatum[0];
            var name = bindDatum[1];
            var func = bindDatum[2];
            node.removeEventListener(name, func, false);
        }
        return func;
    };

}