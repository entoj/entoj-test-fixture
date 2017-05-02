
/**
 * Requirements
 */
import { Component as BaseComponent } from 'global/component';

/**
 * @memberOf base.module.m-teaser
 */
export class Component extends BaseComponent {

    /* Constants ------------------------------------------------------------------------------- */
    /* Constructor ----------------------------------------------------------------------------- */

    /**
     * @param {Application} application
     * @param {DOMElement} $element
     */
    constructor(application, $element) {
        super(application, $element);

        // Selectors
        Object.assign(this.selectors, {
        });

        // Handler bindings
        Object.assign(this.bindings, {
        });
    }


    /**
     * @inheritDocs
     */
    static get className() {
        return 'base.module.m-teaser/Component';
    }


    /* Lifecycle ------------------------------------------------------------------------------- */
    /* Eventhandler ---------------------------------------------------------------------------- */
    /* Protected ------------------------------------------------------------------------------- */
    /* Public ---------------------------------------------------------------------------------- */
}
