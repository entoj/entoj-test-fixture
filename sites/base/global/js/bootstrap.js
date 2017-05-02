/**
 * Global configs
 */
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.lazyClass = 'do-lazyload';
window.lazySizesConfig.loadingClass = 'is-lazyloading';
window.lazySizesConfig.loadedClass = 'is-lazyloaded';


/**
 * Requirements
 */
/*eslint-disable */
import debug from 'debug';
import { Application } from 'global/application';
import Lazysizes from 'lazysizes';
import Respimg from 'lazysizes/plugins/respimg/ls.respimg';
import jQuery from 'jquery';
window.$ = jQuery;
import MobileEvents from 'jQuery-Touch-Events';
import Velocity from 'velocity';
import svg4everybody from 'jonathantneal/svg4everybody';
/*eslint-enable */

/**
 * Configure logger
 */
const log = debug('global/application');
debug.enable('*');

/**
 * Add svg support
 */
svg4everybody();

/**
 * Start the application
 */
log('Starting app');
const app = new Application();
app.start();
