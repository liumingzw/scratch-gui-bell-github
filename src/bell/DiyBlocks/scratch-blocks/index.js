
// 以下 bell.ai 添加
// NOTE: 三个文件添加 added by zhoujf@bell.ai
//       使得scratch-blocks支持移动端手势放大缩小
// 1.添加TouchGesture
// 2.替换workspacesvg中使用的Gesture -> TouchGesture
// 3.用blockly中的Blockly.bindEvent_,Blockly.bindEventWithChecks_,Blockly.unbindEvent_
//   替换掉scratch-blocks中的
import bellTouch from './core/touch';
import bellTouchGesture from './core/touch-gesture';
import bellWorkSpaceSvg from './core/workspace-svg';
//diy blockly
import blocksBellDetect from './blocks/bell-detect';
import blocksBellEvent from './blocks/bell-event';
import blocksBellMotion from './blocks/bell-motion';
import blocksbellSoundLight from './blocks/bell-sound-light';
//blocks tree
// NOTE: 添加一个机会修改defaultToolbox
// import blocksDefaultToolBox from './blocks/default-toolbox';
//diy dialog
// NOTE: 解决scratch中多行语句块的需求问题
  // 改动点：
  // 1. 我们在自定义中申明一个变量shouldCreateMultiRow标识我们是多行语句块
  // 2. 在需要换行的地方添加一个input_dummy作为换行标识
  // 3. 修改compute逻辑添加判断标识和DUMMY_INPUT换行
  // 4. 修改renderDrawRight_修正高度计算issue
import coreBlocklyRenderSvgVertical from './core/blockly-render-svg-vertical';
// NOTE: 可变(多行)block在原生blockly中使用mutator实现,而我们不需要显示显示mutator
  // 但我们需要在某些地方(例如一个dialog中)，添加mutator功能
  // (mutationToDom, domToMutation, decompose, compose)
import coreDialogDiv from './core/dialog-div';
import coreDialogs from './core/dialogs';
import coreUtils from './core/utils';
import coreAngleDialog from './core/field-angle-dialog';
import coreClockWiseDialog from './core/field-clockwise-dialog';
import coreColourDialog from './core/field-colour-dialog';
import coreDistanceDialog from './core/field-distance-dialog';
import coreImageDialog from './core/field-image-dialog';
import coreMoudleDialog from './core/field-module-dialog';
import coreNumberDialog from './core/field-number-dialog';
import coreSpeedDialog from './core/field-speed-dialog';

import en from '../static/msg/en';

export default (Blockly) => {

  Blockly.sayHello = function () {
    console.log('Hello from scratch-blocks customizing!');
  };
  // 支持移动端手势
  bellTouch(Blockly);
  bellTouchGesture(Blockly);
  bellWorkSpaceSvg(Blockly);
  // 自定义弹框
  coreBlocklyRenderSvgVertical(Blockly);
  coreDialogDiv(Blockly);
  coreDialogs(Blockly);
  coreUtils(Blockly);
  coreAngleDialog(Blockly);
  coreClockWiseDialog(Blockly);
  coreColourDialog(Blockly);
  coreDistanceDialog(Blockly);
  coreImageDialog(Blockly);
  coreMoudleDialog(Blockly);
  coreNumberDialog(Blockly);
  coreSpeedDialog(Blockly);
  //Mabot 语句块
  blocksBellDetect(Blockly);
  blocksBellEvent(Blockly);
  blocksBellMotion(Blockly);
  blocksbellSoundLight(Blockly);

  //blocks tree
  // blocksDefaultToolBox(Blockly);
  // messages
  en(Blockly);

  global.ScratchBlocks = Blockly;
};
