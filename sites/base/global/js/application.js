
/**
 * Requirements
 */
import { Base } from 'global/base';
import { Component } from 'global/component';
import { Viewport } from 'global/viewport';
import { Signal } from 'signals';
import $ from 'jquery';
import FastClick from 'fastclick';


/**
 * @memberOf base.global
 */
export class Application extends Base {

    /**
     *
     */
    constructor() {
        super();

        this.viewport = new Viewport();

        // Signals
        this.signals.setupCompleted = new Signal();
        this.signals.requestFlyoutClose = new Signal();
        this.signals.requestFlyoutOpen = new Signal();
        this.signals.requestNavigationOpenHighlight = new Signal();
        this.signals.requestHeaderShim = new Signal();
        this.signals.requestFilterSearchResults = new Signal();
        this.signals.searchResultsLoaded = new Signal();
        this.signals.hideLogo = new Signal();
        this.signals.showLogo = new Signal();
    }


    /**
     * @property {String}
     */
    static get className() {
        return 'base.global/Application';
    }


    /* Protected ------------------------------------------------------------------------- */

    /**
     * Enable fastclick library
     */
    enableFastclick() {
        FastClick(document.body);
    }


    /**
     * Setup the application
     */
    setup() {
        // Initialize all instances
        const application = this;
        const instances = [];
        $('[data-entity]').each(function() {
            instances.push(Component.getInstance(application, $(this)));
        });

        // Wait for all instances
        Promise.all(instances)
            .then(() => {
                this.log('dispatching setupCompleted');
                this.signals.setupCompleted.dispatch();
            });

        this.enableFastclick();
    }


    /* Public ---------------------------------------------------------------------------- */


    /**
     * Starts the application
     */
    start() {
        const scope = this;

        // Initialize instances
        const promise = this.viewport.setup()
            .then(this.setup.bind(this))
            .catch(function(error) {
                scope.log('Error', (error.stack) ? error.stack : error);
            });

        return promise;
    }
}
