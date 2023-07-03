/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pubsub.js":
/*!***********************!*\
  !*** ./src/pubsub.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/list.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lists: () => (/* binding */ lists),
/* harmony export */   toDoList: () => (/* binding */ toDoList)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");


const toDoList = (() => {

    const Item = (name, description, listName, dueDate) => {
        let itemIndex = 0;
        let done = false;

        const toggleDone = () => {
            done = !done;
            console.log(name + ' Done!', done);
        }

        return {
            get itemContent() {
                return `${name} : ${description} `
            },
            set index(index) {
                itemIndex = index;
            },
            get index() {
                return itemIndex;
            },
            get done() {
                return done;
            },
            name,
            description,
            listName,
            dueDate,
            toggleDone,
            // changeValues
        }
    }

    const sendQueries = () => {
        const queries = [
            {
                name:'name',
                type:'input',
                required:true,
            },
            {
                name:'description',
                type:'area',
                required:true,
            },
            {
                name:'due',
                type:'date',
                required:false,
            },
            {
                name:'lists',
                type:'select',
                required:true,
            },
        ]
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('receiveQueries',queries);
    }
    
    const changeValues = (input) => {
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('changedItem', Item(input.name, input.description, input.lists, input.due));
    }

    const newItem = (input) => {
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('addToList', Item(input.name, input.description, input.lists, input.due));
    }
    const changeItemSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('changeValues',changeValues);
    const sendQueriesSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('sendItemQueries',sendQueries);
    const newItemSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('newItem',newItem);
})();

const lists = (() => {

    const projectList = {};

    const updateList = (list) => {
        if (document.getElementById(list.name) != undefined) {
            const deleteThis = document.getElementById(list.name);
            deleteThis.parentElement.removeChild(deleteThis);
        }
        const content = document.createElement('div');
        content.classList.add('list');
        content.id = list.name;
        const title = document.createElement('div');
        title.classList.add('project-title');
        title.textContent = list.name;
        content.appendChild(title);
        const horRule = document.createElement('hr');
        content.appendChild(horRule);
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&#xd7';
        closeButton.classList.add('close');
        content.appendChild(closeButton);
        closeButton.addEventListener('click', (e) => {_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('removeList',content.parentElement)});
        list.projectContents.forEach((item) => {
            const listContainer = document.createElement('button');
            listContainer.classList.add('list-container');
            content.appendChild(listContainer);
            const container = document.createElement('div');
            listContainer.appendChild(container);
            container.id = `item-${item.index}`;
            container.classList.add('todo-item');
            container.textContent = item.itemContent;
            listContainer.appendChild(container);
            if (item.done) {
                container.classList.add('done');
            };
            const dateContainer = document.createElement('div');
            dateContainer.classList.add('date-container');
            dateContainer.textContent = item.dueDate;
            listContainer.appendChild(dateContainer);
        })
        const button = document.createElement("button");
        button.textContent = "New Item";
        content.appendChild(button);
        button.addEventListener("click", () => {
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('makeModal',{list:list.name , action:'newItem'})
        });
        content.addEventListener('click',event => _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('listClick',event));
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updateScreen',content);
    }

    const Project = (name, index) => {
        const projectContents = [];
        const addEntry = (entry) => {
            entry.index = projectContents.length;
            projectContents.push(entry);
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updateList',{name:name, projectContents:projectContents});
        }
        const reorganiseList = () => {
            console.log('reorganising', projectContents);
            for (let i = 0 ; i < projectContents.length ; i++) {
                projectContents[i].index = i;
            }
            console.log('reorganised', projectContents);
        }
        const publishContents = () => {
            reorganiseList();
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updateList',{name:name, projectContents:projectContents});
        }
        const doneTask = (task) => {
            const project = projectContents[task];
            project.toggleDone();
        }
        const editTaskStart = (task) => {
            const editTaskEnd = (inputs) => {
                const changeItem = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('changedItem',(item) => {
                    if (item.listName != name) {
                        console.log('Changing list...');
                        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('addToList',item);
                        changeItem.remove();
                        projectContents.splice(task,1);
                        publishContents();
                        changeTaskSub.remove();
                        return;
                    }
                    item.index = task;
                    projectContents[task] = item;
                    publishContents();
                    changeItem.remove();
                    changeTaskSub.remove();
                });
                _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('changeValues',inputs);
            }
            const project = projectContents[task];
            const changeTaskSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('editTaskEnd',editTaskEnd)
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('makeModal',{list:name, action:'editTaskEnd', assigned:{
                name:project.name,
                description:project.description,
                due:project.dueDate,
                lists:project.listName,
            }});
        }
        return {
            name,
            index,
            addEntry,
            doneTask,
            publishContents,
            editTaskStart,
        }
    }

    const loadFirstProject = (projects) => {
        const firstProject = projects[Object.keys(projects)[0]];
        console.log(projects);
        console.log('First Project = ', firstProject);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('publishList',firstProject);
    }

    const sendList = () => {
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('receiveList',projectList);
    }

    const addItemToList = (input) => {
        if (!projectList.hasOwnProperty(input.listName)) {
            throw Error('No such list exists')
        }
        projectList[input.listName].addEntry(input);
    }

    const makeProject = () => {
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('makeModal',{action:'newProject'});
    }

    const sendQueries = () => {
        const queries = [
            {
                name: 'name',
                type: 'input',
                require: true,
            }
        ]
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('receiveQueries',queries);
    }

    const itemDone = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.parentElement.id;
        const project = projectList[list]
        project.doneTask(+itemIndex);
        project.publishContents();
    }

    const itemEdit = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.parentElement.id;
        const project = projectList[list];
        project.editTaskStart(+itemIndex);
        project.publishContents();
    }

    const newProject = (input) => {
        const entries = Object.entries(projectList);
        let exists = false;
        for (let i = 0 ; i < entries.length ; i++) {
            if (input.name === entries[i][0]) {
                _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('listExistError');
                console.warn('Existing Project', entries[i]);
                console.log('Aborting...')
                exists = true;
                return;
            }
        }
        console.log('Exists? :', exists);
        if (!exists) {
            const newEntry = Project(input.name,Object.keys(projectList).length);
            projectList[newEntry.name] = newEntry;
            console.table(projectList);
            console.log('New Project Made!', newEntry);
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('addProject', newEntry);
            _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updateProjectList', projectList);
        }
    }

    const itemEditSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('itemEdit', itemEdit);
    const makeProjectSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('makeProject',makeProject);
    const sendQueriesSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('sendProjectQueries', sendQueries);
    const itemDoneSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('itemDone',itemDone);
    const newProjectSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('newProject',newProject);
    const publishListSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('publishList', list => list.publishContents())
    const updateListSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('updateList',updateList);
    const sendListSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('sendList', sendList);
    const addEntrySubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('addToList', addItemToList);
    const getProjectsSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('firstProjectRequest',loadFirstProject);

})();


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSwrQ0FBTTtBQUNkOztBQUVBO0FBQ0EsUUFBUSwrQ0FBTTtBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsK0NBQU0sc0JBQXNCLG9CQUFvQjtBQUN4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSwrQ0FBTTtBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixxQkFBcUI7QUFDOUM7QUFDQSxnQkFBZ0IsK0NBQU07QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQ0FBTTtBQUNsQixZQUFZLCtDQUFNO0FBQ2xCO0FBQ0E7O0FBRUEsd0JBQXdCLCtDQUFNO0FBQzlCLDJCQUEyQiwrQ0FBTTtBQUNqQyxvQ0FBb0MsK0NBQU07QUFDMUMsd0JBQXdCLCtDQUFNO0FBQzlCLDBCQUEwQiwrQ0FBTTtBQUNoQywyQkFBMkIsK0NBQU07QUFDakMsbUNBQW1DLCtDQUFNO0FBQ3pDLGlDQUFpQywrQ0FBTTtBQUN2QyxpQ0FBaUMsK0NBQU07QUFDdkMsb0NBQW9DLCtDQUFNOztBQUUxQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kb2xpc3QvLi9zcmMvcHVic3ViLmpzIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kb2xpc3QvLi9zcmMvbGlzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY29uc3QgcHViU3ViID0oKCkgPT4ge1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGNvbnN0IGhPUCA9IHN1YnNjcmlwdGlvbnMuaGFzT3duUHJvcGVydHk7XG5cbiAgICBjb25zdCBwdWJsaXNoID0gKGV2ZW50LGRhdGEpID0+IHtcbiAgICAgICAgLy9pZiB0b3BpYyBkb2Vzbid0IGV4aXN0LCBkbyBub3RoaW5nXG4gICAgICAgIGlmICghaE9QLmNhbGwoc3Vic2NyaXB0aW9ucyxldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJzogTm8gc3VjaCBldmVudCwgb3Igbm8gc3Vic2NyaWJlcnMhJywgc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL2FjdGl2YXRlIHN1YnNjcmliZXJzXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0oZGF0YSAhPSB1bmRlZmluZWQgPyBkYXRhIDoge30pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1B1Ymxpc2hlZCAnICsgZXZlbnQgKyAnIHdpdGggJyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmUgPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIC8vIGVycm9yIGlmIG5vIGZ1bmN0aW9uXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbWlzc2luZyBmcm9tIHN1YnNjcmliZTogJyArIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlcnJvciBpZiBub3QgYSBmdW5jdGlvblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7YGBcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24gZnJvbSBzdWJzY3JpYmU6ICcgKyBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9tYWtlIGV2ZW50IGlmIG5vbmUgZXhpc3RzXG4gICAgICAgIGlmKCFoT1AuY2FsbChzdWJzY3JpcHRpb25zLGV2ZW50KSkge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvL3B1c2ggc3Vic2NyaWJlciB0byBldmVudFxuICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdGlvbnNbZXZlbnRdLnB1c2goY2FsbGJhY2spIC0gMTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ05ldyBzdWJzY3JpYmVyIHRvIGV2ZW50OiAnICsgZXZlbnQgLCBzdWJzY3JpcHRpb25zKTtcbiAgICAgICAgLy8gYWRkIG1ldGhvZCB0byByZW1vdmVcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0uc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cmVtb3ZlfTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7cHVibGlzaCwgc3Vic2NyaWJlLCBzdWJzY3JpcHRpb25zfTtcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcblxuY29uc3QgdG9Eb0xpc3QgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgSXRlbSA9IChuYW1lLCBkZXNjcmlwdGlvbiwgbGlzdE5hbWUsIGR1ZURhdGUpID0+IHtcbiAgICAgICAgbGV0IGl0ZW1JbmRleCA9IDA7XG4gICAgICAgIGxldCBkb25lID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgdG9nZ2xlRG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvbmUgPSAhZG9uZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUgKyAnIERvbmUhJywgZG9uZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0IGl0ZW1Db250ZW50KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHtuYW1lfSA6ICR7ZGVzY3JpcHRpb259IGBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgaW5kZXgoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgaW5kZXgoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1JbmRleDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgZG9uZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBsaXN0TmFtZSxcbiAgICAgICAgICAgIGR1ZURhdGUsXG4gICAgICAgICAgICB0b2dnbGVEb25lLFxuICAgICAgICAgICAgLy8gY2hhbmdlVmFsdWVzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzZW5kUXVlcmllcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcXVlcmllcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiduYW1lJyxcbiAgICAgICAgICAgICAgICB0eXBlOidpbnB1dCcsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6dHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTonZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgIHR5cGU6J2FyZWEnLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOnRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6J2R1ZScsXG4gICAgICAgICAgICAgICAgdHlwZTonZGF0ZScsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6ZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6J2xpc3RzJyxcbiAgICAgICAgICAgICAgICB0eXBlOidzZWxlY3QnLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOnRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdyZWNlaXZlUXVlcmllcycscXVlcmllcyk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNoYW5nZVZhbHVlcyA9IChpbnB1dCkgPT4ge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnY2hhbmdlZEl0ZW0nLCBJdGVtKGlucHV0Lm5hbWUsIGlucHV0LmRlc2NyaXB0aW9uLCBpbnB1dC5saXN0cywgaW5wdXQuZHVlKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3SXRlbSA9IChpbnB1dCkgPT4ge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnYWRkVG9MaXN0JywgSXRlbShpbnB1dC5uYW1lLCBpbnB1dC5kZXNjcmlwdGlvbiwgaW5wdXQubGlzdHMsIGlucHV0LmR1ZSkpO1xuICAgIH1cbiAgICBjb25zdCBjaGFuZ2VJdGVtU3ViID0gcHViU3ViLnN1YnNjcmliZSgnY2hhbmdlVmFsdWVzJyxjaGFuZ2VWYWx1ZXMpO1xuICAgIGNvbnN0IHNlbmRRdWVyaWVzU3Vic2NyaXB0aW9uID0gcHViU3ViLnN1YnNjcmliZSgnc2VuZEl0ZW1RdWVyaWVzJyxzZW5kUXVlcmllcyk7XG4gICAgY29uc3QgbmV3SXRlbVN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ25ld0l0ZW0nLG5ld0l0ZW0pO1xufSkoKTtcblxuY29uc3QgbGlzdHMgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgcHJvamVjdExpc3QgPSB7fTtcblxuICAgIGNvbnN0IHVwZGF0ZUxpc3QgPSAobGlzdCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGlzdC5uYW1lKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVRoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsaXN0Lm5hbWUpO1xuICAgICAgICAgICAgZGVsZXRlVGhpcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGRlbGV0ZVRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdsaXN0Jyk7XG4gICAgICAgIGNvbnRlbnQuaWQgPSBsaXN0Lm5hbWU7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QtdGl0bGUnKTtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBsaXN0Lm5hbWU7XG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICBjb25zdCBob3JSdWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaHInKTtcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChob3JSdWxlKTtcbiAgICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJyYjeGQ3JztcbiAgICAgICAgY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnY2xvc2UnKTtcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG4gICAgICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtwdWJTdWIucHVibGlzaCgncmVtb3ZlTGlzdCcsY29udGVudC5wYXJlbnRFbGVtZW50KX0pO1xuICAgICAgICBsaXN0LnByb2plY3RDb250ZW50cy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBsaXN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2xpc3QtY29udGFpbmVyJyk7XG4gICAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGxpc3RDb250YWluZXIpO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBjb250YWluZXIuaWQgPSBgaXRlbS0ke2l0ZW0uaW5kZXh9YDtcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b2RvLWl0ZW0nKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci50ZXh0Q29udGVudCA9IGl0ZW0uaXRlbUNvbnRlbnQ7XG4gICAgICAgICAgICBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBpZiAoaXRlbS5kb25lKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBkYXRlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkYXRlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhdGUtY29udGFpbmVyJyk7XG4gICAgICAgICAgICBkYXRlQ29udGFpbmVyLnRleHRDb250ZW50ID0gaXRlbS5kdWVEYXRlO1xuICAgICAgICAgICAgbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChkYXRlQ29udGFpbmVyKTtcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJOZXcgSXRlbVwiO1xuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ21ha2VNb2RhbCcse2xpc3Q6bGlzdC5uYW1lICwgYWN0aW9uOiduZXdJdGVtJ30pXG4gICAgICAgIH0pO1xuICAgICAgICBjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxldmVudCA9PiBwdWJTdWIucHVibGlzaCgnbGlzdENsaWNrJyxldmVudCkpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndXBkYXRlU2NyZWVuJyxjb250ZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBQcm9qZWN0ID0gKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2plY3RDb250ZW50cyA9IFtdO1xuICAgICAgICBjb25zdCBhZGRFbnRyeSA9IChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgZW50cnkuaW5kZXggPSBwcm9qZWN0Q29udGVudHMubGVuZ3RoO1xuICAgICAgICAgICAgcHJvamVjdENvbnRlbnRzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3VwZGF0ZUxpc3QnLHtuYW1lOm5hbWUsIHByb2plY3RDb250ZW50czpwcm9qZWN0Q29udGVudHN9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW9yZ2FuaXNlTGlzdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZW9yZ2FuaXNpbmcnLCBwcm9qZWN0Q29udGVudHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAgOyBpIDwgcHJvamVjdENvbnRlbnRzLmxlbmd0aCA7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb2plY3RDb250ZW50c1tpXS5pbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVvcmdhbmlzZWQnLCBwcm9qZWN0Q29udGVudHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hDb250ZW50cyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlb3JnYW5pc2VMaXN0KCk7XG4gICAgICAgICAgICBwdWJTdWIucHVibGlzaCgndXBkYXRlTGlzdCcse25hbWU6bmFtZSwgcHJvamVjdENvbnRlbnRzOnByb2plY3RDb250ZW50c30pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvbmVUYXNrID0gKHRhc2spID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0Q29udGVudHNbdGFza107XG4gICAgICAgICAgICBwcm9qZWN0LnRvZ2dsZURvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlZGl0VGFza1N0YXJ0ID0gKHRhc2spID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRUYXNrRW5kID0gKGlucHV0cykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZUl0ZW0gPSBwdWJTdWIuc3Vic2NyaWJlKCdjaGFuZ2VkSXRlbScsKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ubGlzdE5hbWUgIT0gbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NoYW5naW5nIGxpc3QuLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhZGRUb0xpc3QnLGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlSXRlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RDb250ZW50cy5zcGxpY2UodGFzaywxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hDb250ZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlVGFza1N1Yi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gdGFzaztcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdENvbnRlbnRzW3Rhc2tdID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaENvbnRlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUl0ZW0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVRhc2tTdWIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2NoYW5nZVZhbHVlcycsaW5wdXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0Q29udGVudHNbdGFza107XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VUYXNrU3ViID0gcHViU3ViLnN1YnNjcmliZSgnZWRpdFRhc2tFbmQnLGVkaXRUYXNrRW5kKVxuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ21ha2VNb2RhbCcse2xpc3Q6bmFtZSwgYWN0aW9uOidlZGl0VGFza0VuZCcsIGFzc2lnbmVkOntcbiAgICAgICAgICAgICAgICBuYW1lOnByb2plY3QubmFtZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpwcm9qZWN0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIGR1ZTpwcm9qZWN0LmR1ZURhdGUsXG4gICAgICAgICAgICAgICAgbGlzdHM6cHJvamVjdC5saXN0TmFtZSxcbiAgICAgICAgICAgIH19KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgYWRkRW50cnksXG4gICAgICAgICAgICBkb25lVGFzayxcbiAgICAgICAgICAgIHB1Ymxpc2hDb250ZW50cyxcbiAgICAgICAgICAgIGVkaXRUYXNrU3RhcnQsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsb2FkRmlyc3RQcm9qZWN0ID0gKHByb2plY3RzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpcnN0UHJvamVjdCA9IHByb2plY3RzW09iamVjdC5rZXlzKHByb2plY3RzKVswXV07XG4gICAgICAgIGNvbnNvbGUubG9nKHByb2plY3RzKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZpcnN0IFByb2plY3QgPSAnLCBmaXJzdFByb2plY3QpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgncHVibGlzaExpc3QnLGZpcnN0UHJvamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VuZExpc3QgPSAoKSA9PiB7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdyZWNlaXZlTGlzdCcscHJvamVjdExpc3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZEl0ZW1Ub0xpc3QgPSAoaW5wdXQpID0+IHtcbiAgICAgICAgaWYgKCFwcm9qZWN0TGlzdC5oYXNPd25Qcm9wZXJ0eShpbnB1dC5saXN0TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdObyBzdWNoIGxpc3QgZXhpc3RzJylcbiAgICAgICAgfVxuICAgICAgICBwcm9qZWN0TGlzdFtpbnB1dC5saXN0TmFtZV0uYWRkRW50cnkoaW5wdXQpO1xuICAgIH1cblxuICAgIGNvbnN0IG1ha2VQcm9qZWN0ID0gKCkgPT4ge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnbWFrZU1vZGFsJyx7YWN0aW9uOiduZXdQcm9qZWN0J30pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRRdWVyaWVzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBxdWVyaWVzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgICAgIHJlcXVpcmU6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3JlY2VpdmVRdWVyaWVzJyxxdWVyaWVzKTtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtRG9uZSA9IChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW1JbmRleCA9IGl0ZW0uaWQuc3Vic3RyaW5nKDUpO1xuICAgICAgICBjb25zdCBsaXN0ID0gaXRlbS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuaWQ7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0TGlzdFtsaXN0XVxuICAgICAgICBwcm9qZWN0LmRvbmVUYXNrKCtpdGVtSW5kZXgpO1xuICAgICAgICBwcm9qZWN0LnB1Ymxpc2hDb250ZW50cygpO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1FZGl0ID0gKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgaXRlbUluZGV4ID0gaXRlbS5pZC5zdWJzdHJpbmcoNSk7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpdGVtLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5pZDtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RMaXN0W2xpc3RdO1xuICAgICAgICBwcm9qZWN0LmVkaXRUYXNrU3RhcnQoK2l0ZW1JbmRleCk7XG4gICAgICAgIHByb2plY3QucHVibGlzaENvbnRlbnRzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UHJvamVjdCA9IChpbnB1dCkgPT4ge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMocHJvamVjdExpc3QpO1xuICAgICAgICBsZXQgZXhpc3RzID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IGVudHJpZXMubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQubmFtZSA9PT0gZW50cmllc1tpXVswXSkge1xuICAgICAgICAgICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdsaXN0RXhpc3RFcnJvcicpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRXhpc3RpbmcgUHJvamVjdCcsIGVudHJpZXNbaV0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBYm9ydGluZy4uLicpXG4gICAgICAgICAgICAgICAgZXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ0V4aXN0cz8gOicsIGV4aXN0cyk7XG4gICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdFbnRyeSA9IFByb2plY3QoaW5wdXQubmFtZSxPYmplY3Qua2V5cyhwcm9qZWN0TGlzdCkubGVuZ3RoKTtcbiAgICAgICAgICAgIHByb2plY3RMaXN0W25ld0VudHJ5Lm5hbWVdID0gbmV3RW50cnk7XG4gICAgICAgICAgICBjb25zb2xlLnRhYmxlKHByb2plY3RMaXN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZXcgUHJvamVjdCBNYWRlIScsIG5ld0VudHJ5KTtcbiAgICAgICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhZGRQcm9qZWN0JywgbmV3RW50cnkpO1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3VwZGF0ZVByb2plY3RMaXN0JywgcHJvamVjdExpc3QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbUVkaXRTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdpdGVtRWRpdCcsIGl0ZW1FZGl0KTtcbiAgICBjb25zdCBtYWtlUHJvamVjdFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ21ha2VQcm9qZWN0JyxtYWtlUHJvamVjdCk7XG4gICAgY29uc3Qgc2VuZFF1ZXJpZXNTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKCdzZW5kUHJvamVjdFF1ZXJpZXMnLCBzZW5kUXVlcmllcyk7XG4gICAgY29uc3QgaXRlbURvbmVTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdpdGVtRG9uZScsaXRlbURvbmUpO1xuICAgIGNvbnN0IG5ld1Byb2plY3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCduZXdQcm9qZWN0JyxuZXdQcm9qZWN0KTtcbiAgICBjb25zdCBwdWJsaXNoTGlzdFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ3B1Ymxpc2hMaXN0JywgbGlzdCA9PiBsaXN0LnB1Ymxpc2hDb250ZW50cygpKVxuICAgIGNvbnN0IHVwZGF0ZUxpc3RTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKCd1cGRhdGVMaXN0Jyx1cGRhdGVMaXN0KTtcbiAgICBjb25zdCBzZW5kTGlzdFN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ3NlbmRMaXN0Jywgc2VuZExpc3QpO1xuICAgIGNvbnN0IGFkZEVudHJ5U3Vic2NyaXB0aW9uID0gcHViU3ViLnN1YnNjcmliZSgnYWRkVG9MaXN0JywgYWRkSXRlbVRvTGlzdCk7XG4gICAgY29uc3QgZ2V0UHJvamVjdHNTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKCdmaXJzdFByb2plY3RSZXF1ZXN0Jyxsb2FkRmlyc3RQcm9qZWN0KTtcblxufSkoKTtcblxuZXhwb3J0IHtcbiAgICB0b0RvTGlzdCxcbiAgICBsaXN0c1xufTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=