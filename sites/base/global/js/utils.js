
/**
 * Taken from https://davidwalsh.name/function-debounce
 *
 * @param  {Function} func
 * @param  {Number} wait
 * @param  {Boolean} immediate
 * @return {void}
 */
export function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if(callNow) {
            func.apply(context, args);
        }
    }
}


/**
 * @return {void}
 */
export function errorHandler(label, error) {
    /* eslint no-console:0 */
    console.log(label + ' Error');
    console.dir(error);
}


/**
 * Check for ios browsers
 * @return  {Boolean} is ios browser
 */
export function isMobileSafari() {
    return navigator.userAgent.match(/(iPod|iPhone|iPad)/);
}
