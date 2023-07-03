/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/pubsub.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


const pubSub =(() => {

    const subscriptions = {};
    const hOP = subscriptions.hasOwnProperty;

    const publish = (event,data) => {
        //if topic doesn't exist, do nothing
        if (!hOP.call(subscriptions,event)) {
            console.log(event + ': No such event, or no subscribers!', subscriptions);
            return;
        }

        //activate subscribers
        subscriptions[event].forEach((item) => {
            item(data != undefined ? data : {});
            // console.log('Published ' + event + ' with ' + JSON.stringify(data));
        })
    }

    const subscribe = (event, callback) => {
        // error if no function
        if (!callback) {
            throw new Error('callback is missing from subscribe: ' + event);
        }
        // error if not a function
        if (typeof callback !== 'function') {``
            throw new Error('callback is not a function from subscribe: ' + event);
        }
        //make event if none exists
        if(!hOP.call(subscriptions,event)) {
            subscriptions[event] = [];
        }
        //push subscriber to event
        const index = subscriptions[event].push(callback) - 1;
        // console.log('New subscriber to event: ' + event , subscriptions);
        // add method to remove
        const remove = () => {
            subscriptions[event].splice(index,1);
        }
        return {remove};
    }


    return {publish, subscribe, subscriptions};
})()

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pubSub);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3ViLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDSkE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7OztBQUdBLFlBQVk7QUFDWixDQUFDOztBQUVELGlFQUFlLE1BQU0sRSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kb2xpc3QvLi9zcmMvcHVic3ViLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXG5cbmNvbnN0IHB1YlN1YiA9KCgpID0+IHtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICBjb25zdCBoT1AgPSBzdWJzY3JpcHRpb25zLmhhc093blByb3BlcnR5O1xuXG4gICAgY29uc3QgcHVibGlzaCA9IChldmVudCxkYXRhKSA9PiB7XG4gICAgICAgIC8vaWYgdG9waWMgZG9lc24ndCBleGlzdCwgZG8gbm90aGluZ1xuICAgICAgICBpZiAoIWhPUC5jYWxsKHN1YnNjcmlwdGlvbnMsZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCArICc6IE5vIHN1Y2ggZXZlbnQsIG9yIG5vIHN1YnNjcmliZXJzIScsIHN1YnNjcmlwdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hY3RpdmF0ZSBzdWJzY3JpYmVyc1xuICAgICAgICBzdWJzY3JpcHRpb25zW2V2ZW50XS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtKGRhdGEgIT0gdW5kZWZpbmVkID8gZGF0YSA6IHt9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdQdWJsaXNoZWQgJyArIGV2ZW50ICsgJyB3aXRoICcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaWJlID0gKGV2ZW50LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAvLyBlcnJvciBpZiBubyBmdW5jdGlvblxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrIGlzIG1pc3NpbmcgZnJvbSBzdWJzY3JpYmU6ICcgKyBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXJyb3IgaWYgbm90IGEgZnVuY3Rpb25cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge2BgXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uIGZyb20gc3Vic2NyaWJlOiAnICsgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vbWFrZSBldmVudCBpZiBub25lIGV4aXN0c1xuICAgICAgICBpZighaE9QLmNhbGwoc3Vic2NyaXB0aW9ucyxldmVudCkpIHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy9wdXNoIHN1YnNjcmliZXIgdG8gZXZlbnRcbiAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRpb25zW2V2ZW50XS5wdXNoKGNhbGxiYWNrKSAtIDE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdOZXcgc3Vic2NyaWJlciB0byBldmVudDogJyArIGV2ZW50ICwgc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgIC8vIGFkZCBtZXRob2QgdG8gcmVtb3ZlXG4gICAgICAgIGNvbnN0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3JlbW92ZX07XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge3B1Ymxpc2gsIHN1YnNjcmliZSwgc3Vic2NyaXB0aW9uc307XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=