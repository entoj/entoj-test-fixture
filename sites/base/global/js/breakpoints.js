/**
 * Requirements
 */
import { Base } from 'global/base';


/**
 * This file was generated via 'entoj scaffold breakpoint'
 *
 * @memberOf base.global
 */
export class Breakpoints extends Base {
    /* Constants ------------------------------------------------------------------------- */


    /**
     * @property {String}
     */
    static get APPLICATION() {
        return 'application';
    }


    /**
     * @property {String}
     */
    static get DESKTOP() {
        return 'desktop';
    }


    /**
     * @property {String}
     */
    static get TABLET() {
        return 'tablet';
    }

    /**
     * @property {String}
     */
    static get MINITABLET() {
        return 'mini-tablet';
    }

    /**
     * @property {String}
     */
    static get PHABLET() {
        return 'phablet';
    }

    /**
     * @property {String}
     */
    static get MOBILE() {
        return 'mobile';
    }


    /* Constructor ----------------------------------------------------------------------- */

    /**
     */
    constructor() {
        super();
        this.current = Breakpoints.DESKTOP;
        this.breakpoints = [];
        this.breakpoints.push({ name: 'application', mediaQuery: '(min-width: 1280px)' });
        this.breakpoints.push({ name: 'desktop', mediaQuery: '(min-width: 1025px) and (max-width: 1279px)' });
        this.breakpoints.push({ name: 'tablet', mediaQuery: '(min-width: 1024px) and (max-width: 1024px)' });
        this.breakpoints.push({ name: 'mini-tablet', mediaQuery: '(min-width: 768px) and (max-width: 1023px)' });
        this.breakpoints.push({ name: 'phablet', mediaQuery: '(min-width: 376px) and (max-width: 767px)' });
        this.breakpoints.push({ name: 'mobile', mediaQuery: '(max-width: 375px)' });

    }


    /**
     * Resolves to the name of the current breakpoint
     */
    determine() {
        let bp = Breakpoints.DESKTOP;
        for (const breakpoint of this.breakpoints) {
            if (window.matchMedia(breakpoint.mediaQuery).matches) {
                bp = breakpoint.name;
            }
        }
        const changed = this.current !== bp;
        this.current = bp;
        return Promise.resolve(changed);
    }
}
