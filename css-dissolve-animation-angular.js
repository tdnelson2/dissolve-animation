class DissolveAnimation {
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
    constructor(dataArray, staticKlasses, interval = 8000, transitionDuration, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDurationWasProvided = false) {
        this.i = 0;
        this.invisibleCSSLabel = 'da-invisible';
        this.visibleCSSLabel = 'da-visible';
        this.hiddenCSSLabel = 'da-hidden';
        this.shownCSSLabel = 'da-shown';
        this.fadeOutKlass = () => this.klasses(this.fadeOutCSSLabel);
        this.fadeInKlass = () => this.klasses(this.fadeInCSSLabel);
        this.invisibleKlass = () => this.klasses(this.invisibleCSSLabel);
        this.visibleKlass = () => this.klasses(this.visibleCSSLabel);
        this.hiddenKlass = () => this.klasses(this.hiddenCSSLabel);
        this.shownKlass = () => this.klasses(this.shownCSSLabel);
        this.promisefy = (item, klass, delay) => {
            const /** @type {?} */ eventName = `${this.eventIdentifier}${this.itemName(item)}--${klass}`;
            this.emitEvent(`${eventName}--WILL-ADD`);
            item.klass = this.klasses(klass);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.emitEvent(`${eventName}--WILL-REMOVE`);
                    resolve(item);
                }, delay);
            });
        };
        this.fadeOut = (it) => this.promisefy(it, this.fadeOutCSSLabel, this.transitionDuration);
        this.fadeIn = (it) => this.promisefy(it, this.fadeInCSSLabel, this.transitionDuration);
        this.invisible = (it) => this.promisefy(it, this.invisibleCSSLabel, this.interval);
        this.visible = (it) => this.promisefy(it, this.visibleCSSLabel, this.interval);
        this.hidden = (it) => this.promisefy(it, this.hiddenCSSLabel, this.interval);
        this.shown = (it) => this.promisefy(it, this.shownCSSLabel, this.interval);
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
    ;
    /**
     * @param {?} klasses
     * @return {?}
     */
    klasses(klasses) {
        return this.staticKlasses === undefined ? klasses : `${klasses} ${this.staticKlasses}`;
    }
    /**
     * @return {?}
     */
    getABTracks() {
        let /** @type {?} */ a;
        let /** @type {?} */ b;
        if (this.itemA.state === 'show') {
            [a, b] = [this.itemA, this.itemB];
        }
        else {
            [a, b] = [this.itemB, this.itemA];
        }
        this.data = b.data;
        // switch the `'hide'`/`'show'` order so
        // next time `a` and `b` get assigned to
        // the opposit items
        [a.state, b.state] = ['hide', 'show'];
        return [a, b];
    }
    /**
     * @return {?}
     */
    next() {
        const /** @type {?} */ index = this.i;
        this.i = this.i === this.dataArray.length - 1 ? 0 : this.i + 1;
        return this.dataArray[index];
    }
    /**
     * @param {?} label
     * @return {?}
     */
    emitEvent(label) {
        const /** @type {?} */ evt = new Event(label);
        document.dispatchEvent(evt);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    itemName(item) {
        return item.track === 1 ? 'itemA' : 'itemB';
    }
}

class TransitionItem {
    /**
     * @param {?} track
     * @param {?} state
     * @param {?} klass
     * @param {?} data
     */
    constructor(track, state, klass, data) {
        this.track = track;
        this.state = state;
        this.klass = klass;
        this.data = data;
    }
}

class CrossDissolve extends DissolveAnimation {
    /**
     * @param {?} dataArray
     * @param {?=} __1
     */
    constructor(dataArray, { staticKlasses = (undefined), interval = (undefined), transitionDuration = (undefined), fadeInOverride = (undefined), fadeOutOverride = (undefined), eventIdentifier = (undefined) } = {}) {
        super(dataArray, staticKlasses, interval, transitionDuration ? transitionDuration : 3000, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDuration !== undefined);
    }
    ;
    /**
     * @return {?}
     */
    animate() {
        if (!this.itemA && !this.itemB) {
            this.itemA = new TransitionItem(1, 'show', this.visibleKlass(), this.next());
            this.itemB = new TransitionItem(2, 'hide', this.invisibleKlass(), this.next());
        }
        // `a` is the active track and `b` is the
        // track to which `a` dissolves.
        // `isOnTop` indicates whether `a` has a
        // higher z-index than `b`
        const [a, b] = this.getABTracks();
        const /** @type {?} */ isOnTop = a.track === 1;
        this.visible(a).then(() => {
            if (isOnTop)
                b.klass = this.visibleKlass();
            // If `a` has a higher z-index than `b`,
            // we can simply fade out to reveal `b`.
            // Otherwise if `a` has a lower z-index,
            // `b` needs to fade in.
            return isOnTop ? this.fadeOut(a) : this.fadeIn(b);
        }).then(() => {
            if (isOnTop)
                a.klass = this.invisibleKlass();
            a.data = this.next();
            this.animate();
        });
    }
}

class SequenceDissolve extends DissolveAnimation {
    /**
     * @param {?} dataArray
     * @param {?=} __1
     */
    constructor(dataArray, { staticKlasses = (undefined), interval = (undefined), transitionDuration = (undefined), fadeInOverride = (undefined), fadeOutOverride = (undefined), eventIdentifier = (undefined) } = {}) {
        const transitionDurationWasProvided = transitionDuration !== undefined;
        // Make the transition duration slightly shorter
        // to avoid a flash when the transition ends
        const tdAdjusted = transitionDuration ? Math.floor(transitionDuration * .96) : 2900;
        super(dataArray, staticKlasses, interval, tdAdjusted, fadeInOverride, fadeOutOverride, eventIdentifier, transitionDurationWasProvided);
    }
    ;
    /**
     * @return {?}
     */
    animate() {
        if (!this.itemA && !this.itemB) {
            this.itemA = new TransitionItem(1, 'show', this.hiddenKlass(), this.next());
            this.itemB = new TransitionItem(2, 'hide', this.hiddenKlass(), this.next());
        }
        const [a, b] = this.getABTracks();
        this.shown(a).then(() => {
            return this.fadeOut(a);
        }).then(() => {
            [a.klass, a.data] = [this.hiddenKlass(), this.next()];
            return this.fadeIn(b);
        }).then(() => {
            this.animate();
        });
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { CrossDissolve, SequenceDissolve, DissolveAnimation as ɵa };
//# sourceMappingURL=css-dissolve-animation-angular.js.map
