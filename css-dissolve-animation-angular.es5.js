var DissolveAnimation = (function () {
    /**
     * @param {?} dataArray
     * @param {?} staticKlasses
     * @param {?=} interval
     * @param {?=} transitionDuration
     * @param {?=} fadeInOverride
     * @param {?=} fadeOutOverride
     * @param {?=} eventIdentifier
     * @param {?=} transitionDurationWasProvided
     */
    function DissolveAnimation(dataArray, staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDurationWasProvided) {
        if (interval === void 0) { interval = 8000; }
        if (transitionDurationWasProvided === void 0) { transitionDurationWasProvided = false; }
        var _this = this;
        this.i = 0;
        this.invisibleCSSLabel = 'da-invisible';
        this.visibleCSSLabel = 'da-visible';
        this.hiddenCSSLabel = 'da-hidden';
        this.shownCSSLabel = 'da-shown';
        this.fadeOutKlass = function () { return _this.klasses(_this.fadeOutCSSLabel); };
        this.fadeInKlass = function () { return _this.klasses(_this.fadeInCSSLabel); };
        this.invisibleKlass = function () { return _this.klasses(_this.invisibleCSSLabel); };
        this.visibleKlass = function () { return _this.klasses(_this.visibleCSSLabel); };
        this.hiddenKlass = function () { return _this.klasses(_this.hiddenCSSLabel); };
        this.shownKlass = function () { return _this.klasses(_this.shownCSSLabel); };
        this.promisefy = function (item, klass, delay) {
            var /** @type {?} */ eventName = "" + _this.eventIdentifier + _this.itemName(item) + "--" + klass;
            _this.emitEvent(eventName + "--WILL-ADD");
            item.klass = _this.klasses(klass);
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    _this.emitEvent(eventName + "--WILL-REMOVE");
                    resolve(item);
                }, delay);
            });
        };
        this.fadeOut = function (it) { return _this.promisefy(it, _this.fadeOutCSSLabel, _this.transitionDuration); };
        this.fadeIn = function (it) { return _this.promisefy(it, _this.fadeInCSSLabel, _this.transitionDuration); };
        this.invisible = function (it) { return _this.promisefy(it, _this.invisibleCSSLabel, _this.interval); };
        this.visible = function (it) { return _this.promisefy(it, _this.visibleCSSLabel, _this.interval); };
        this.hidden = function (it) { return _this.promisefy(it, _this.hiddenCSSLabel, _this.interval); };
        this.shown = function (it) { return _this.promisefy(it, _this.shownCSSLabel, _this.interval); };
        this.dataArray = dataArray;
        this.staticKlasses = staticKlasses;
        this.interval = interval;
        this.transitionDuration = transitionDuration;
        this.eventIdentifier = eventIdentifier === undefined ? '' : eventIdentifier + '--';
        if (transitionDurationWasProvided && (!fadeInOverride || !fadeOutOverride)) {
            throw 'ERROR: `fadeInOverride` and `fadeOutOverride` are required ' +
                'if you provide `transitionDuration`.';
        }
        else if (!transitionDurationWasProvided && (fadeInOverride || fadeOutOverride)) {
            throw 'ERROR: `fadeInOverride` and `fadeOutOverride` can only be ' +
                'provided if `transitionDuration` is also provided';
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
    /**
     * @param {?} label
     * @return {?}
     */
    DissolveAnimation.prototype.emitEvent = function (label) {
        var /** @type {?} */ evt = new Event(label);
        document.dispatchEvent(evt);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    DissolveAnimation.prototype.itemName = function (item) {
        return item.track === 1 ? 'itemA' : 'itemB';
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
     * @param {?=} __1
     */
    function CrossDissolve(dataArray, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.staticKlasses, staticKlasses = _c === void 0 ? (undefined) : _c, _d = _b.interval, interval = _d === void 0 ? (undefined) : _d, _e = _b.transitionDuration, transitionDuration = _e === void 0 ? (undefined) : _e, _f = _b.fadeInOverride, fadeInOverride = _f === void 0 ? (undefined) : _f, _g = _b.fadeOutOverride, fadeOutOverride = _g === void 0 ? (undefined) : _g, _h = _b.eventIdentifier, eventIdentifier = _h === void 0 ? (undefined) : _h;
        return _super.call(this, dataArray, staticKlasses, interval, transitionDuration ? transitionDuration : 3000, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDuration !== undefined) || this;
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
     * @param {?=} __1
     */
    function SequenceDissolve(dataArray, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.staticKlasses, staticKlasses = _c === void 0 ? (undefined) : _c, _d = _b.interval, interval = _d === void 0 ? (undefined) : _d, _e = _b.transitionDuration, transitionDuration = _e === void 0 ? (undefined) : _e, _f = _b.fadeInOverride, fadeInOverride = _f === void 0 ? (undefined) : _f, _g = _b.fadeOutOverride, fadeOutOverride = _g === void 0 ? (undefined) : _g, _h = _b.eventIdentifier, eventIdentifier = _h === void 0 ? (undefined) : _h;
        var _this = this;
        var transitionDurationWasProvided = transitionDuration !== undefined;
        // Make the transition duration slightly shorter
        // to avoid a flash when the transition ends
        var tdAdjusted = transitionDuration ? Math.floor(transitionDuration * .96) : 2900;
        _this = _super.call(this, dataArray, staticKlasses, interval, tdAdjusted, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDurationWasProvided) || this;
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

export { CrossDissolve, SequenceDissolve, DissolveAnimation as ɵa };
//# sourceMappingURL=css-dissolve-animation-angular.es5.js.map
