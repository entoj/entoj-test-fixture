
/**
 * Requirements
 */
import debug from 'debug';


/**
 * @memberOf base.global
 */
export class Base {
    /**
     *
     */
    constructor() {
        if (!Base.instanceId) {
            Base.instanceId = 1;
        }
        this.instanceId = 'instance-' + (Base.instanceId++);
        this.log = debug(this.className + '[' + this.instanceId + ']');
        this.signals = {};
    }


    /**
     * @property {String}
     */
    static get className() {
        return 'base.global/Base';
    }


    /**
     * @property {String}
     */
    get className() {
        return this.constructor.className;
    }
}
