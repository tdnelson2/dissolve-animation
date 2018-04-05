(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.cssDissolveAnimationAngular = global.cssDissolveAnimationAngular || {})));
}(this, (function (exports) { 'use strict';

var DissolveAnimation = (function () {
    /**
     * @param {?} dataArray
     * @param {?} staticKlasses
     * @param {?=} interval
     * @param {?=} transitionDuration
     * @param {?=} fadeInOverride
     * @param {?=} fadeOutOverride
     * @param {?=} transitionDurationWasProvided
     */
    function DissolveAnimation(dataArray, staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride, transitionDurationWasProvided) {
        if (interval === void 0) { interval = 8000; }
        if (transitionDurationWasProvided === void 0) { transitionDurationWasProvided = false; }
        var _this = this;
        this.i = 0;
        this.fadeOutKlass = function () { return _this.klasses(_this.fadeOutCSSLabel); };
        this.fadeInKlass = function () { return _this.klasses(_this.fadeInCSSLabel); };
        this.invisibleKlass = function () { return _this.klasses('da-invisible'); };
        this.visibleKlass = function () { return _this.klasses('da-visible'); };
        this.hiddenKlass = function () { return _this.klasses('da-hidden'); };
        this.shownKlass = function () { return _this.klasses('da-shown'); };
        this.promisefy = function (item, klass, delay) {
            item.klass = klass;
            return new Promise(function (r, j) { return setTimeout(r, delay, item); });
        };
        this.fadeOut = function (it) { return _this.promisefy(it, _this.fadeOutKlass(), _this.transitionDuration); };
        this.fadeIn = function (it) { return _this.promisefy(it, _this.fadeInKlass(), _this.transitionDuration); };
        this.invisible = function (it) { return _this.promisefy(it, _this.invisibleKlass(), _this.interval); };
        this.visible = function (it) { return _this.promisefy(it, _this.visibleKlass(), _this.interval); };
        this.hidden = function (it) { return _this.promisefy(it, _this.hiddenKlass(), _this.interval); };
        this.shown = function (it) { return _this.promisefy(it, _this.shownKlass(), _this.interval); };
        this.dataArray = dataArray;
        this.staticKlasses = staticKlasses;
        this.interval = interval;
        this.transitionDuration = transitionDuration;
        if (transitionDurationWasProvided && (!fadeInOverride || !fadeOutOverride)) {
            throw 'ERROR: parameter 5 (fade in CSS class name) ' +
                'and 6 (fade out CSS class name) are required ' +
                'if you provide a 3rd parameter (transition duration).';
        }
        else if (transitionDurationWasProvided && (fadeInOverride && fadeOutOverride)) {
            this.fadeInCSSLabel = fadeInOverride;
            this.fadeOutCSSLabel = fadeOutOverride;
        }
        else {
            this.fadeInCSSLabel = 'da-fade-in';
            this.fadeOutCSSLabel = 'da-fade-out';
        }
    }
    
    /**
     * @param {?} klasses
     * @return {?}
     */
    DissolveAnimation.prototype.klasses = function (klasses) {
        return this.staticKlasses === undefined ? klasses : klasses + " " + this.staticKlasses;
    };
    /**
     * @return {?}
     */
    DissolveAnimation.prototype.getABTracks = function () {
        var /** @type {?} */ a;
        var /** @type {?} */ b;
        if (this.itemA.state === 'show') {
            _a = [this.itemA, this.itemB], a = _a[0], b = _a[1];
        }
        else {
            _b = [this.itemB, this.itemA], a = _b[0], b = _b[1];
        }
        this.data = b.data;
        // switch the `'hide'`/`'show'` order so
        // next time `a` and `b` get assigned to
        // the opposit items
        _c = ['hide', 'show'], a.state = _c[0], b.state = _c[1];
        return [a, b];
        var _a, _b, _c;
    };
    /**
     * @return {?}
     */
    DissolveAnimation.prototype.next = function () {
        var /** @type {?} */ index = this.i;
        this.i = this.i === this.dataArray.length - 1 ? 0 : this.i + 1;
        return this.dataArray[index];
    };
    return DissolveAnimation;
}());

var TransitionItem = (function () {
    /**
     * @param {?} track
     * @param {?} state
     * @param {?} klass
     * @param {?} data
     */
    function TransitionItem(track, state, klass, data) {
        this.track = track;
        this.state = state;
        this.klass = klass;
        this.data = data;
    }
    return TransitionItem;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CrossDissolve = (function (_super) {
    __extends(CrossDissolve, _super);
    /**
     * @param {?} dataArray
     * @param {?=} staticKlasses
     * @param {?=} interval
     * @param {?=} transitionDuration
     * @param {?=} fadeInOverride
     * @param {?=} fadeOutOverride
     */
    function CrossDissolve(dataArray, staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride) {
        if (staticKlasses === void 0) { staticKlasses = undefined; }
        if (interval === void 0) { interval = undefined; }
        if (transitionDuration === void 0) { transitionDuration = undefined; }
        if (fadeInOverride === void 0) { fadeInOverride = undefined; }
        if (fadeOutOverride === void 0) { fadeOutOverride = undefined; }
        return _super.call(this, dataArray, staticKlasses, interval, transitionDuration ? transitionDuration : 3000, fadeInOverride, fadeOutOverride, transitionDuration !== undefined) || this;
    }
    
    /**
     * @return {?}
     */
    CrossDissolve.prototype.animate = function () {
        var _this = this;
        if (!this.itemA && !this.itemB) {
            this.itemA = new TransitionItem(1, 'show', this.visibleKlass(), this.next());
            this.itemB = new TransitionItem(2, 'hide', this.invisibleKlass(), this.next());
        }
        // `a` is the active track and `b` is the
        // track to which `a` dissolves.
        // `isOnTop` indicates whether `a` has a
        // higher z-index than `b`
        var _a = this.getABTracks(), a = _a[0], b = _a[1];
        var /** @type {?} */ isOnTop = a.track === 1;
        this.visible(a).then(function () {
            if (isOnTop)
                b.klass = _this.visibleKlass();
            // If `a` has a higher z-index than `b`,
            // we can simply fade out to reveal `b`.
            // Otherwise if `a` has a lower z-index,
            // `b` needs to fade in.
            return isOnTop ? _this.fadeOut(a) : _this.fadeIn(b);
        }).then(function () {
            if (isOnTop)
                a.klass = _this.invisibleKlass();
            a.data = _this.next();
            _this.animate();
        });
    };
    return CrossDissolve;
}(DissolveAnimation));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SequenceDissolve = (function (_super) {
    __extends$1(SequenceDissolve, _super);
    /**
     * @param {?} dataArray
     * @param {?=} staticKlasses
     * @param {?=} interval
     * @param {?=} transitionDuration
     * @param {?=} fadeInOverride
     * @param {?=} fadeOutOverride
     */
    function SequenceDissolve(dataArray, staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride) {
        if (staticKlasses === void 0) { staticKlasses = undefined; }
        if (interval === void 0) { interval = undefined; }
        if (transitionDuration === void 0) { transitionDuration = undefined; }
        if (fadeInOverride === void 0) { fadeInOverride = undefined; }
        if (fadeOutOverride === void 0) { fadeOutOverride = undefined; }
        var _this = this;
        var transitionDurationWasProvided = transitionDuration !== undefined;
        // // Make the transition duration slightly shorter
        // // to avoid a flash when the transition ends
        transitionDuration = transitionDuration ? Math.floor(transitionDuration * .96) : 2900;
        _this = _super.call(this, dataArray, staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride, transitionDurationWasProvided) || this;
        return _this;
    }
    
    /**
     * @return {?}
     */
    SequenceDissolve.prototype.animate = function () {
        var _this = this;
        if (!this.itemA && !this.itemB) {
            this.itemA = new TransitionItem(1, 'show', this.hiddenKlass(), this.next());
            this.itemB = new TransitionItem(2, 'hide', this.hiddenKlass(), this.next());
        }
        var _a = this.getABTracks(), a = _a[0], b = _a[1];
        this.shown(a).then(function () {
            return _this.fadeOut(a);
        }).then(function () {
            _a = [_this.hiddenKlass(), _this.next()], a.klass = _a[0], a.data = _a[1];
            return _this.fadeIn(b);
            var _a;
        }).then(function () {
            _this.animate();
        });
    };
    return SequenceDissolve;
}(DissolveAnimation));

/**
 * Generated bundle index. Do not edit.
 */

exports.CrossDissolve = CrossDissolve;
exports.SequenceDissolve = SequenceDissolve;
exports.ɵa = DissolveAnimation;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=css-dissolve-animation-angular.umd.js.map
