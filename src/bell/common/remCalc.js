export default class RemCalc {
    // html根元素
    docEl
    // 更新rem定时器
    tid
    // 初始rem，我们不太关心初始值，刷新时会更新
    rem = 1;

    designResolutionWidth = 1920;
    designResolutionHeight = 1080;
    designPx = 40;

    constructor() {
        this.docEl = window.document.documentElement;

        let _this = this;
        //窗口更新动态改变font-size
        window.addEventListener("resize", this.dbcRefresh.bind(this), false);
        //页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
        window.addEventListener("pageshow", function (e) {
            if (e.persisted) { _this.dbcRefresh(); }
        }, false)
    }

    //函数节流，避免频繁更新
    dbcRefresh() {
        clearTimeout(this.tid);
        this.tid = setTimeout(this.refreshRem.bind(this), 100);
    }

    refreshRem() {
        /** 这段代码本是网上抄的，据说是阿里的。`this.docEl.getBoundingClientRect()`
         * 无法获取正确的高度，大概是因为这时候没有填充元素。因此采用`this.docEl.clientWidth`
         * 之前用这个函数获取宽度是正确的，但我们需要某些情况下使用高度适配
         */
        // 获取当前窗口的宽度
        const width = this.docEl.clientWidth;
        // 1920设计稿，设font-size=40px，这样，1rem=40px，40倍换算方便。
        // 实际上，设置得更小并不一定可以，浏览器有最小字体，譬如10px以下，会以10px计算
        this.rem = width * this.designPx / this.designResolutionWidth;
        // 针对宽高比过小的手机（很多全面屏手机），我们以高度为准计算。16 / 9 = 1.77，简单设置阈值为1.8
        const height = this.docEl.clientHeight;
        if (width / height > 1.8) {
            this.rem = height * this.designPx / this.designResolutionHeight;
        }
        this.docEl.style.fontSize = this.rem + "px";
        //误差、兼容性处理
        var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
        if (actualSize !== this.rem && actualSize > 0 && Math.abs(actualSize - this.rem) > 1) {
            const remScaled = this.rem * this.rem / actualSize;
            this.docEl.style.fontSize = remScaled + "px";
        }
    }

    isPad() {
        //是否是ipad
        return navigator.userAgent.match(/iPad/i) != null;
    }

    isWideScreen() {
        const width = this.docEl.clientWidth;
        const height = this.docEl.clientHeight;
        return width / height > 1.8;
    }

    rem2px(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) { val += "px" }
        return val;
    }

    px2rem(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) { val += "rem" }
        return val;
    }
    getScreenWith() {
        const width = this.docEl.clientWidth;
        return width;
    }
    getScreenHeight() {
        const height = this.docEl.clientHeight;
        return height;
    }
}
