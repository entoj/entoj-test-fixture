
/**
 * Requirements
 */
import { Base } from 'base/global/js/base';
import { State } from 'base/global/js/css';
import { errorHandler } from 'base/global/js/utils';
import $ from 'jquery';
import { Signal } from 'signals';
import debug from 'debug';


/**
 * @type {debug}
 */
const log = debug('global/Component');

/**
 * @memberOf base.global
 */
export class Component extends Base {
    /* Constants ------------------------------------------------------------------------- */

    /**
     * @property {String}
     */
    static get LOADING() {
        return 'LOADING';
    }


    /**
     * @property {String}
     */
    static get LOADED() {
        return 'LOADED';
    }


    /**
     * @property {String}
     */
    static get ACTIVATED() {
        return 'ACTIVATED';
    }


    /**
     * @property {String}
     */
    static get DEACTIVATED() {
        return 'DEACTIVATED';
    }


    /* Constructor ----------------------------------------------------------------------- */

    /**
     * @param {Application} application
     * @param {DOMElement} $element
     */
    constructor(application, $element) {
        super();
        this.application = application;
        this.$root = $($element);
        this.$elements = { root: $($element) };
        this.elements = { root: this };
        this.bindings = [];
        this.selectors = {};
        this.components = {};
        this.signals.stateChanged = new Signal();
        this._state = Component.LOADING;
    }


    /* Protected ------------------------------------------------------------------------- */

    /**
     * Updates all configured bindings
     */
    updateBindings(remove) {
        this.log('updateBindings: remove=', remove);

        for (const handlerName in this.bindings) {
            const config = this.bindings[handlerName].split(':');
            const events = config.length > 1 ? config[0] : 'click';
            const selector = config.length == 1 ? config[0] : config[1];
            const delegate = config.length == 3 ? config[2] : null;

            let $element;

            if (selector.charAt(0) == '$') {
                $element = this.$elements[selector.substr(1)];
            } else {
                $element = $(selector);
            }

            if ($element) {
                if (remove === true) {
                    $element.off(events);
                } else {
                    if(delegate) {
                        $element.on(events, delegate, this[handlerName].bind(this));
                    } else {
                        $element.on(events, this[handlerName].bind(this));
                    }
                }
            }
        }
    }


    /**
     * Get all instances that are configured
     */
    getInstances() {
        this.log('getInstances');

        const tasks = [];
        for (const componentName in this.components) {
            tasks.push((() => {
                this.log('Root', this.$root);
                const componentSelector = this.components[componentName];
                const componentElements = this.$root.find(componentSelector);

                if (!componentElements.length) {
                    this.log('getInstances - no elements found for ' + componentSelector);
                    return Promise.resolve(false);
                }

                const promise = Component.getInstance(this.application, componentElements)
                    .then(function(instance) {
                        this.log('getInstances - adding instance ' + componentName);
                        this.elements[componentName] = instance;
                    })
                    .catch(errorHandler.bind(this, this.className + '::initialize'));
                return promise;
            })());
        }

        const promise = Promise.all(tasks)
            .catch(errorHandler.bind(this, this.className + '::initialize'));
        return promise;
    }


    /**
     * Prepares component for activation
     */
    prepare() {
        this.log('prepare');
        return Promise.resolve(true);
    }


    /* Public ---------------------------------------------------------------------------- */

    /**
     * @property {String}
     */
    get state() {
        return this._state;
    }


    /**
     * @property {String}
     */
    set state(value) {
        if (this._state === value) {
            return;
        }
        this._state = value;

        switch(this._state) {
            case Component.LOADING:
                this.$root
                    .removeClass(State.LOADED)
                    .addClass(State.LOADING);
                break;

            case Component.LOADED:
                this.$root
                    .removeClass(State.LOADING)
                    .addClass(State.LOADED);
                break;

            case Component.ACTIVATED:
                this.$root
                    .removeClass(State.INACTIVE)
                    .addClass(State.ACTIVE);
                break;

            case Component.DEACTIVATED:
                this.$root
                    .removeClass(State.ACTIVE)
                    .addClass(State.INACTIVE);
                break;
        }

        if(this.signals.stateChanged) {
            this.log('Dispatch stateChanged', this._state);
            this.signals.stateChanged.dispatch(this, this._state);
        }
    }


    /**
     * Adds all configured bindings
     */
    activate() {
        this.log('activate');

        if(this.state === Component.LOADING || this.state === Component.ACTIVATED) {
            return Promise.resolve(false);
        }

        // Add listeners
        this.updateBindings();

        // Set to activated
        this.state = Component.ACTIVATED;
        this.$root.removeClass(State.INACTIVE).addClass(State.ACTIVE);

        return Promise.resolve(true);
    }


    /**
     * Removes any running tasks and listeners
     */
    deactivate() {
        this.log('deactivate');

        if (this.state === Component.DEACTIVATED) {
            return Promise.resolve(false);
        }

        // Remove listeners
        this.updateBindings(true);

        // Set to deactivated
        this.state = Component.DEACTIVATED;

        return Promise.resolve(true);
    }


    /**
     * Bootstraps the component.
     * This will prepare and then activate the componet.
     */
    initialize() {
        // Handle multiple initialize calls
        if (this.state !== Component.LOADING) {
            this.log('initialize skipped because state is not LOADING');
            return Promise.resolve(false);
        }

        // Go
        const promise = new Promise((resolve, reject) => {
            this.log('initialize', this.$root);

            // Prepare $elements
            for (const selectorName in this.selectors) {
                if (selectorName && selectorName.substr(0, 1) === '$') {
                    this.$elements[selectorName.substr(1)] = this.$root.find(this.selectors[selectorName]);
                }
            }

            // Prepare and then activate
            this.getInstances()
                .then(this.prepare.bind(this))
                .then(() => {
                    this.state = Component.LOADED;
                })
                .then(this.activate.bind(this))
                .then(resolve.bind(this, this))
                .catch(errorHandler.bind(this, this.className + '::initialize'));
        });
        return promise;
    }


    /* Statics --------------------------------------------------------------------------- */

    /**
     * Get the Compontent instance for a dom node
     */
    static getInstance(application, $element) {
        log('getInstance', $element);

        // See if already instanciated
        if ($element.get(0).__component__) {
            return Promise.resolve($element.get(0).__component__);
        }

        // Get entity id
        const entityId = $element.data('entity');
        if (!entityId) {
            return Promise.resolve(false);
        }

        // Get parts
        const entity = entityId.split(/-/g);
        const moduleDir =  entity[0] + '-' + entity[1];

        // Get site & category
        const site = 'base';
        let category = 'global';
        switch(entity[0].toLowerCase()) {
            case 'e':
                category = 'elements';
                break;

            case 'm':
                category = 'modules';
                break;

            case 'g':
                category = 'module-groups';
                break;
        }

        const js = site + '/' + category + '/' + moduleDir + '/js/' + entityId;

        // Load js module & create instance
        const promise = System.import(js)
            .then(function(module) {
                // No $element?
                if (!$element || !$element.get(0)) {
                    return Promise.resolve(false);
                }

                // Already instanciated?
                if ($element.get(0).__component__) {
                    return Promise.resolve($element.get(0).__component__);
                }

                // Get a fresh instance
                const component = new module.Component(application, $element);
                $element.data('component', component);
                $element.get(0).__component__ = component;
                return $element.get(0).__component__.initialize();
            })
            .catch(errorHandler.bind(this, Component.className + '::getInstance'));
        return promise;
    }
}
