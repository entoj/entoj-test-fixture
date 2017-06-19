/**
 * Requirements
 */
import { Base } from 'global/base';
import { State } from 'global/css';
import { Signal } from 'signals';
import { debounce } from 'global/utils';
import { Breakpoints } from 'global/breakpoints';
import { isMobileSafari } from 'global/utils';
import $ from 'jquery';
import Waypoints from 'waypoints';
import { KeyCode } from 'global/keycode';

/**
 * @memberOf base.global
 */
export class Viewport extends Base {

    /* Constructor ----------------------------------------------------------------------- */

    /**
     * @constructor
     */
    constructor() {
        super();

        this.waypoint = typeof Waypoints === 'function' ? Waypoints : Waypoints.Waypoint;

        this.$body = $(document.body);
        this.$bodyHtml = $('body,html');
        this.$window = $(window);
        this.lastScrollYBeforeBodyFix = 0;
        this.bodyHeight = 0;
        this.lastViewportHeight = null;
        this.scrollY = 0;
        this.isScrolling = false;
        this.keyboardFocus = false;
        this.breakpoints = new Breakpoints();

        // Signals
        this.signals.changed = new Signal();
        this.signals.breakpointChanged = new Signal();
        this.signals.contentHeightChanged = new Signal();
    }


    /**
     * @property {String}
     */
    static get className() {
        return 'base.global/Viewport';
    }

    /* Protected ------------------------------------------------------------------------------- */

    /**
     * Handle viewport resize and dispatch events
     * @return {void}
     */
    handleResize() {
        const scope = this;
        this.breakpoints.determine()
            .then(function(changed) {
                scope.log('Dispatching viewportChanged');
                scope.signals.changed.dispatch();
                if (changed) {
                    scope.log('Dispatching breakpointChanged', scope.breakpoint);
                    scope.signals.breakpointChanged.dispatch(scope.breakpoint);
                }

                scope.handleIOSNavigation();
            });
    }


    /**
     * Handle flags keydown for scucceeding focus event
     * @return {void}
     */
    handleFocusTrigger(e) {
        this.keyboardFocus = (e.type === 'keydown' && e.keyCode === KeyCode.TAB);
    }

    /**
     * Sets keyboard focus class if focus is initiated by key event
     * @return {void}
     */
    handleElementFocusIn(e) {
        if (this.keyboardFocus) {
            $(e.target).addClass(State.KEYBOARD_FOCUS);
        }
    }

    /**
     * Removes keyboard focus class on focus out
     * @return {void}
     */
    handleElementFocusOut(e) {
        $(e.target).removeClass(State.KEYBOARD_FOCUS);
    }


    /**
     * Sets body classes to detect hidden state of IOS browser bar
     * @return {void}
     */
    handleIOSNavigation() {
        if(isMobileSafari()) {
            this.$body.removeClass(State.IOS_NAV_DOWN).removeClass(State.IOS_NAV_UP);

            if(this.lastViewportHeight !== null && window.innerHeight > this.lastViewportHeight) {
                this.$body.addClass(State.IOS_NAV_DOWN);
            } else if(window.innerHeight < this.lastViewportHeight) {
                this.$body.addClass(State.IOS_NAV_UP);
            }
        }

        this.lastViewportHeight = window.innerHeight;
    }


    /**
     * Mark viewport for iOS because of navbar hide behaviour
     * @return {void}
     */
    checkForIosViewport() {
        if(isMobileSafari()) {
            this.$body.addClass(State.IOS);
        }
    }


    /* Public ---------------------------------------------------------------------------- */

    /**
     * Setup class and bind events
     * @return {void}
     */
    setup() {

        // bind scroll and resize handler
        this.$window.scroll(this.handleScroll.bind(this));
        this.$window.on('resize', debounce(this.handleResize.bind(this), 100));
        this.$body.on('keydown', this.handleFocusTrigger.bind(this));
        this.$body.on('mousedown', this.handleFocusTrigger.bind(this));
        this.$body.on('focusin', this.handleElementFocusIn.bind(this));
        this.$body.on('focusout', this.handleElementFocusOut.bind(this));

        this.checkForIosViewport();
        this.handleResize();

        return Promise.resolve();
    }


    /**
    * Enable scrolling, release site height to content height if fixed before
    * @return {void}
    */
    enableScrolling() {
        if(this.$body.hasClass(State.FIXED)) {
            this.$body.removeClass(State.FIXED);
            this.$body.css('marginTop', '');

            // restore scroll position before viewport fix
            this.$window.scrollTop(this.lastScrollYBeforeBodyFix);
        }
    }


    /**
     * Disables scrolling and use negative body margin to prevent visual scroll top
     * @return {void}
     */
    disableScrolling() {
        this.lastScrollYBeforeBodyFix = this.$window.scrollTop();
        this.$body.addClass(State.FIXED);

        //compensate scroll top on fixed body
        this.$body.css('marginTop', -this.lastScrollYBeforeBodyFix);
    }


    /**
     * Handles scrolling and sets CSS classes to body according to scroll state.
     * @return {void}
     */
    handleScroll(e) {
        if(this.isScrolling) {
            e.preventDefault();
        }

        if(window.scrollY != this.scrollY) {
            const diff = Math.abs(window.scrollY - this.scrollY),
                  minDiff = 2;

            if(diff > minDiff) {
                if(window.scrollY > this.scrollY) {
                    this.$body.removeClass(State.SCROLLUP).addClass(State.SCROLLDOWN);
                } else {
                    this.$body.addClass(State.SCROLLUP).removeClass(State.SCROLLDOWN);
                }


                this.checkContentHeight();
            }

            const atBottom = this.$window.scrollTop() + this.$window.height() >= $(document).height(),
                atTop = this.$window.scrollTop() <= 0;

            if(atTop || atBottom) {
                this.$body.addClass(atTop ? State.TOP : State.BOTTOM);
            } else {
                this.$body.removeClass(State.TOP + ' ' + State.BOTTOM);
            }

            this.scrollY = window.scrollY;
        }
    }


    /**
     * Check if height of viewport content changed and dispatch signal
     * @return {void}
     */
    checkContentHeight() {
        const currentHeight = this.$body.height();

        if(currentHeight != this.bodyHeight) {
            this.bodyHeight = currentHeight;
            this.signals.contentHeightChanged.dispatch();
        }
    }


    /**
     * Scroll viewport to element and take fixed navigation into account.
     * @return {void}
     */
    scrollTo($to, speed, offset, callback) {
        if(this.isScrolling === false && $to && $to.length){
            this.isScrolling = true;

            const scope = this;

            speed = (typeof speed === 'undefined')? 'slow': speed;
            let position = $to.offset().top - this.getTopOffset();

            if(typeof offset === 'number') {
                position += offset;
            }

            this.$bodyHtml.animate({ scrollTop: position}, speed)
            .promise()
            .done(function(){
                scope.isScrolling = false;
                if(typeof callback === 'function'){
                    callback();
                }
            });
        }
    }


    /**
     * Get the viewport top offset due to position fixed navigation
     * @return {Number}
     */
    getTopOffset() {
        const $viewport = $('.u-viewport'),
            top = $viewport.css('margin-top'),
            defaultTop = 0;

        return (typeof top === 'undefined')? defaultTop: parseFloat(top.replace('px', ''));
    }


    /**
     * Get get the current breakpoint
     * @return {String}
     */
    get breakpoint() {
        return this.breakpoints.current;
    }
}
