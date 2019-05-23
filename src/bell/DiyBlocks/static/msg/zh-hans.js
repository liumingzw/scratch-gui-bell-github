'use strict';

goog.require('Blockly.Msg');

// ======================= bell-motion ==========================
Blockly.Msg.BELL_MOTION_MOTOR_POWER_CONCURRENCE = "驱动球 %1, %2 旋转, 功率 %3, 持续 %4 秒, %5%6";
Blockly.Msg.BELL_MOTION_MOTOR_POWER = "驱动球 %1, %2 旋转, 功率 %3, 持续 %4 秒 %5";
Blockly.Msg.BELL_MOTION_MOTOR_ROTATE_CONCURRENCE = "驱动球 %1, %2 旋转, 速度 %3, 持续 %4 秒, %5%6";
Blockly.Msg.BELL_MOTION_MOTOR_ROTATE = "驱动球 %1, %2 旋转, 速度 %3, 持续 %4 秒 %5";
Blockly.Msg.BELL_MOTION_STOP = "驱动球 %1, 停止旋转";
Blockly.Msg.BELL_MOTION_WAIST_JOINT_DEG_CONCURRENCE = "旋转关节球 %1, 摇摆到 %2 ° %3 %4";
Blockly.Msg.BELL_MOTION_ARM_JOINT_DEG_CONCURRENCE = "摇摆关节球 %1, 摇摆到 %2 ° %3 %4";
Blockly.Msg.BELL_MOTION_GET_WAIST_DEG = "获取旋转关节球 %1 的角度";
Blockly.Msg.BELL_MOTION_GET_ARM_DEG = "获取摇摆关节球 %1 的角度";

// ======================= bell-light & sound ==========================
Blockly.Msg.BELL_LIGHT_COLOR_MODE = "设置 %1 灯光颜色为 %2 , 模式为 %3%4";
Blockly.Msg.BELL_LIGHT_COLOR_MODE_CONCURRENCE = "设置 %1 灯光颜色为 %2 , 模式为 %3, 持续%4 %5%6";
Blockly.Msg.BELL_LIGHT_COLOR_RGB = "设置 %1 灯光颜色为 R%2 G%3 B%4, 模式为 %5%6";
Blockly.Msg.BELL_LIGHT_COLOR_RGB_CONCURRENCE = "设置 %1 灯光颜色为 R%2 G%3 B%4, 模式为 %5 持续%6秒, %7%8";
Blockly.Msg.BELL_LIGHT_CLOSED = "%1 灯光关闭%2";
Blockly.Msg.BELL_LIGHT_PLAY_BUZZER = "播放蜂鸣器, 音调%1, 音阶%2%3";
Blockly.Msg.BELL_LIGHT_PLAY_BUZZER_CONCURRENCE = "播放蜂鸣器, 音调%1, 音阶%2, 持续%3秒, %4%5";
Blockly.Msg.BELL_LIGHT_CLOSED_BUZZER = "停止蜂鸣%1";

// ======================= bell-event ==========================
Blockly.Msg.BELL_EVENT_GET_MSG = "当接收到广播 %1";
Blockly.Msg.BELL_EVENT_SEND_MSG = "发送广播 %1";
Blockly.Msg.BELL_EVENT_TOUCH_PRESS = "当触碰球 %1 的状态为 %2";
Blockly.Msg.BELL_EVENT_INFRARED_CM = "当红外传感器 %1 %2 距离 %3";
Blockly.Msg.BELL_EVENT_GYRO_CM = "当陀螺仪的 %1 %2 %3";
Blockly.Msg.BELL_EVENT_COLOR_TYPE = "当颜色传感器 %1 %2 %3";

// ======================= bell-detect ==========================
Blockly.Msg.BELL_DETECT_GET_COLOR_VALUE =  "获取颜色传感器 %1 的值";
Blockly.Msg.BELL_DETECT_GET_INFRARED_VALUE =  "获取红外传感器 %1 的值";
Blockly.Msg.BELL_DETECT_GET_GYRO_VALUE =  "获取陀螺仪 %1 的值";
Blockly.Msg.BELL_DETECT_TOUCH_PRESS_STATE =  "触碰球 %1 的状态为 %2";
Blockly.Msg.BELL_DETECT_COLOR_EQUAL_VALUE =  "颜色传感器 %1 %2 %3";
Blockly.Msg.BELL_DETECT_INFRARED_EQUAL_CM =  "红外传感器 %1 %2 %3 cm";
Blockly.Msg.BELL_DETECT_GYRO_ANGLE_VALUE =  "陀螺仪的 %1 %2 %3";

// ======================= drop-down options ==========================
Blockly.Msg.BELL_ANGLE_OPTIONS_ONE = '俯仰角度';
Blockly.Msg.BELL_ANGLE_OPTIONS_TWO = '翻滚角度';
Blockly.Msg.BELL_ANGLE_OPTIONS_THREE = '旋转角度';
Blockly.Msg.BELL_TOUCH_PRESS = '按下';
Blockly.Msg.BELL_TOUCH_NO_PRESS = '没按下';
Blockly.Msg.BELL_OPTIONS_HIGH = '高';
Blockly.Msg.BELL_OPTIONS_MIDDLE = '中';
Blockly.Msg.BELL_OPTIONS_LOW = '低';
Blockly.Msg.BELL_OPTIONS_CW = '顺时针';
Blockly.Msg.BELL_OPTIONS_CCW = '逆时针';
Blockly.Msg.BELL_MAIN_BALL = '主控球';
Blockly.Msg.BELL_DRIVE_BALL = '驱动球';
Blockly.Msg.BELL_BALL_BREATHE_MODE = '呼吸';
Blockly.Msg.BELL_BALL_SHADOW_MODE = '渐变';

// ======================= common txt ==========================
Blockly.Msg.BELL_BLOCKING_TYPES = '执行完当前语句块再执行下一个语句块';
Blockly.Msg.BELL_NON_BLOCKING_TYPES = '当前语句块与下一个语句块同时执行';
