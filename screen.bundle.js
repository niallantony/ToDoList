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
/*!***********************!*\
  !*** ./src/screen.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   screenController: () => (/* binding */ screenController),
/* harmony export */   sideBar: () => (/* binding */ sideBar)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");



const screenController = (() => {
  const updateScreen = (content) => {
    const container = document.getElementById("content");
    let contentDiv;
    if  (document.getElementById(`content-${content.id}`)) {
      contentDiv = document.getElementById(`content-${content.id}`)
    } else {
      contentDiv = document.createElement('div');
      contentDiv.id = `content-${content.id}`;
      container.appendChild(contentDiv);
    };
    contentDiv.appendChild(content);
  };

  const removeList = (list) => {
    list.innerHTML = '';
    list.parentElement.removeChild(list);
  }
  

  const initialiseScreen = () => {
    const body = document.querySelector("body");
    const container = document.createElement("div");
    container.id = "container";
    body.appendChild(container);
    const content = document.createElement('div');
    content.id = 'content';
    container.appendChild(content);
    const modal = document.createElement("dialog");
    modal.classList.add("dialog-modal");
    modal.id = 'form-modal'
    container.appendChild(modal);
  };

  const listClick = (event) => {
    const clickedItem = event.target.closest('.list-container');
    if (!clickedItem) return;
    const clickedList = clickedItem.querySelector('.todo-item');
    console.log(clickedItem, clickedList);
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('itemMenu',clickedList);
  }

  const itemMenu = (item) => {
    const container = document.getElementById('container');
    const menuPan = document.createElement('dialog');
    menuPan.classList.add('menu');
    container.appendChild(menuPan);
    const doneButton = document.createElement('button');
    doneButton.id = 'menu-done';
    doneButton.textContent = 'done';
    doneButton.addEventListener('click',(event) => {
      event.stopPropagation();
      menuPan.close();
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('itemDone',item);
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
    });
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.id = 'menu-edit';    
    editButton.addEventListener('click',() => {
      menuPan.close();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('itemEdit',item)}
      );
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'cancel';
    cancelButton.id = 'menu-cancel';    
    cancelButton.addEventListener('click',(event) => {
      event.stopPropagation();
      menuPan.close();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
    });
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.id = 'menu-delete';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      menuPan.close();
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('itemDelete',item);
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
    })
    menuPan.appendChild(deleteButton);
    menuPan.appendChild(doneButton);
    menuPan.appendChild(editButton);
    menuPan.appendChild(cancelButton);
    menuPan.showModal();
  }

  const listExistError = () => {
    console.log('Error found...');
    const container = document.getElementById('container');
    const dialog = document.createElement('dialog');
    const errorMessage = document.createElement('div');
    const confirmButton = document.createElement('button');
    container.appendChild(dialog);
    dialog.appendChild(errorMessage);
    dialog.appendChild(confirmButton);
    dialog.classList.add('error-message');
    dialog.show();
    errorMessage.textContent =  'list already exists!';
    confirmButton.textContent = 'ok';
    confirmButton.addEventListener('click', () => {
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('makeProject');
      dialog.close();
      dialog.innerHTML = '';
      dialog.parentElement.removeChild(dialog);
    });
  }
    
  
  const listExistSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('listExistError',listExistError);
  const removeListSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('removeList',removeList);
  const itemMenuSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('itemMenu', itemMenu);
  const listClickSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('listClick', listClick);
  const updateSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("updateScreen", updateScreen);
  const initialiseSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('initialise',initialiseScreen);
})();

const inputModal = (() => {
  const createSelect = (projects) => {
    const selectBox = document.createElement("select");
    selectBox.setAttribute("name", "listName");
    selectBox.id = "select-lists";
    for (const list of Object.keys(projects)) {
      const newOption = document.createElement("option");
      newOption.value = projects[list].name;
      newOption.textContent = projects[list].name;
      selectBox.appendChild(newOption);
    };
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('receiveSelect', selectBox);
  };

  const makeModal = (forList) => {
    const modal = document.getElementById('form-modal');
    const getQueriesSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(
      "receiveQueries",
      makeInputs
    );
    const getProjectSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(
      "receiveList",
      createSelect
    );
    const newForm = document.createElement("form");
    newForm.classList.add("input-form");
    newForm.id = "modal-form";
    modal.appendChild(newForm);
    switch (forList.action) {
      case 'newItem' :
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("sendItemQueries");
        break;
      case 'editTaskEnd' :
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("sendItemQueries");
        break;
      case 'newProject' :
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('sendProjectQueries');
        break;
      default: break;
    }
    if (newForm.querySelector('select')) { 
      const selections = newForm.querySelector('select').children;
      for (let i = 0 ; i < selections.length ; i++) {
        if (selections[i].value === forList.list) selections[i].selected = true;
      }
    }
    if (forList.hasOwnProperty('assigned')) {
      const keys = Object.keys(forList.assigned);
      keys.forEach((key) => {
        const formElement = document.getElementById(`input-${key}`);
        if (!formElement) return;
        formElement.value = forList.assigned[key];
      })
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    newForm.appendChild(buttonContainer);
    const submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit');
    submitButton.textContent = 'confirm';
    submitButton.setAttribute('type','submit');
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('modal-cancel');
    cancelButton.textContent = 'cancel'
    cancelButton.addEventListener('click',() => {
      getProjectSubscription.remove();
      getQueriesSubscription.remove();
      modal.innerHTML = '';
      modal.close();
    });
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(cancelButton);
    newForm.addEventListener("submit",(e) => {
        const formData = {};
        Array.from(newForm.elements).forEach((input) => {
            e.preventDefault();
            formData[input.name] = input.value;
            modal.close();
            modal.innerHTML = '';
            getProjectSubscription.remove();
            getQueriesSubscription.remove();
        });
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish(forList.action,formData);
    });
    modal.showModal();
  };

  const makeInputs = (queries) => {
    const newForm = document.getElementById("modal-form");
    queries.forEach((section) => {
      switch (section.type) {
        case "input": {
          const newInput = document.createElement("input");
          newInput.id = `input-${section.name}`;
          newInput.required = section.required;
          newInput.setAttribute("type", "text");
          newInput.setAttribute("name", section.name);
          const newLabel = document.createElement("label");
          newLabel.setAttribute("for", `input-${section.name}`);
          newLabel.textContent = section.name;
          newInput.classList.add("text-input");
          newForm.appendChild(newLabel);
          newForm.appendChild(newInput);
          break;
        }
        case "area": {
          const newInput = document.createElement("textarea");
          newInput.id = `input-${section.name}`;
          newInput.required = section.required;
          newInput.setAttribute("name", section.name);
          const newLabel = document.createElement("label");
          newLabel.setAttribute("for", `input-${section.name}`);
          newLabel.setAttribute("rows", `4`);
          newLabel.textContent = section.name;
          newInput.classList.add("text-input");
          newForm.appendChild(newLabel);
          newForm.appendChild(newInput);
          break;
        }
        case 'date': {
          const newInput = document.createElement("input");
          newInput.id = `input-${section.name}`;
          newInput.required = section.required;
          newInput.setAttribute("type", "date");
          newInput.setAttribute("name", section.name);
          const newLabel = document.createElement("label");
          newLabel.setAttribute("for", `input-${section.name}`);
          newLabel.textContent = section.name;
          newInput.classList.add("date-input");
          newForm.appendChild(newLabel);
          newForm.appendChild(newInput);
          break;
        }
        case "select": {
          const newLabel = document.createElement("label");
          newLabel.setAttribute("for", `input-${section.name}`);
          newLabel.textContent = section.name;
          newForm.appendChild(newLabel);
          const selectSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('receiveSelect',(selectBox) => {
            newForm.appendChild(selectBox);
          })
          _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('sendList');
          selectSub.remove();
          break;
        }
        default:
          break;
      }
    })
  };
  const makeModalSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('makeModal', makeModal);
})();

const sideBar = (() => {

  const sideBarButton = () => {
    const body = document.getElementById('container');
    const header = document.createElement('div');
    const content = document.getElementById('content');
    header.classList.add('header');
    header.id = 'header';
    body.insertBefore(header, content);
    const title = document.createElement("button");
    title.textContent = "Projects";
    title.classList.add("sidebar-title");
    header.appendChild(title);
    const sidebar = initialiseSideBar();  
    console.log('Sidebar: ' , sidebar);
    title.addEventListener('click', () => sidebar.style.display = 'grid');
     
  }

  const hideSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = 'none';
  }

  const initialiseSideBar = () => {
    const body = document.getElementById("container");
    const sidebar = document.createElement("dialog");
    sidebar.id = "sidebar";
    sidebar.classList.add('menu');
    const sidebarContent = document.createElement('div');
    sidebarContent.classList.add('project-list');
    sidebar.appendChild(sidebarContent);
    makeSideBarSub.remove();
    const newButton = document.createElement('button');
    newButton.classList.add('new-button');
    newButton.textContent = 'new project';
    sidebar.appendChild(newButton);
    const closeButton = document.createElement('button');
    closeButton.addEventListener('click', hideSidebar);
    closeButton.textContent = 'close'
    sidebar.appendChild(closeButton);
    newButton.addEventListener('click',() => {_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('makeProject')});
    body.appendChild(sidebar);
    sidebar.style.display = 'none';
    return sidebar;
  };

  const removeProject = (project) => {
    const projectElement = document.getElementById(`list-${project.name.replace(/\s/g,'')}`);
    projectElement.parentElement.removeChild(projectElement);
  }

  const projectMenu = (project) => {
    const container = document.getElementById('container');
    const menuPan = document.createElement('dialog');
    menuPan.classList.add('menu');
    container.appendChild(menuPan);
    const showButton = document.createElement('button');
    showButton.id = 'menu-show';
    showButton.textContent = 'show';
    showButton.addEventListener('click', () => {
      menuPan.close();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('publishList',project);
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('hideBar');
    });
    const deleteButton = document.createElement('button');
    deleteButton.id = 'menu-delete';
    deleteButton.textContent = 'delete';
    deleteButton.addEventListener('click', () => {
      menuPan.close();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
      deleteConfirm(project);
    });
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'cancel';
    cancelButton.id = 'menu-cancel';    
    cancelButton.addEventListener('click',(event) => {
      event.stopPropagation();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
      menuPan.close();
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('hideBar');
    });    
    menuPan.appendChild(showButton);
    menuPan.appendChild(deleteButton);
    menuPan.appendChild(cancelButton);
    menuPan.showModal();
  }

  const deleteConfirm = (project) => {
    const container = document.getElementById('container');
    const dialog = document.createElement('dialog');
    const confirmMessage = document.createElement('div');
    const buttonContainer = document.createElement('div');
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');
    dialog.classList.add('menu');
    container.appendChild(dialog);
    dialog.appendChild(confirmMessage);
    dialog.appendChild(buttonContainer);
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    dialog.classList.add('confirm-message');
    dialog.show();
    confirmMessage.textContent =  'delete project?';
    confirmButton.textContent = 'ok';
    cancelButton.textContent = 'cancel';
    cancelButton.addEventListener('click', () => {
      dialog.close();
      dialog.innerHTML = '';
      dialog.parentElement.removeChild(dialog);
    });
    confirmButton.addEventListener('click', () => {
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('deleteList',project);
      dialog.close();
      dialog.innerHTML = '';
      dialog.parentElement.removeChild(dialog);
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('hideBar');
    })
    console.log(project);

  }

  const addToSideBar = (project) => {
    const sidebar = document.querySelector('.project-list');
    const projectButton = document.createElement("button");
    projectButton.classList.add("project-button");
    projectButton.id = `list-${project.name.replace(/\s/g,'')}`;
    projectButton.textContent = project.name;
    sidebar.appendChild(projectButton);
    projectButton.addEventListener('click',() => {
      projectMenu(project);
    })
    console.log("Added project: ",project.name);
  };
  const hideSideBarSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('hideBar', hideSidebar);
  const removeProjectSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('deleteList', removeProject);
  const makeSideBarSub = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('makeSideBar', sideBarButton);
  const addSideBarSubscription = _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("addProject", addToSideBar);
})();



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLCtDQUFNO0FBQ1osTUFBTSwrQ0FBTTtBQUNaLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLCtDQUFNO0FBQ1osS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxNQUFNLCtDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwrQkFBK0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlCQUF5QiwrQ0FBTTtBQUMvQiwyQkFBMkIsK0NBQU07QUFDakMseUJBQXlCLCtDQUFNO0FBQy9CLGlDQUFpQywrQ0FBTTtBQUN2QyxDQUFDOztBQUVvQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG9saXN0Ly4vc3JjL3B1YnN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG9saXN0Ly4vc3JjL3NjcmVlbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY29uc3QgcHViU3ViID0oKCkgPT4ge1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGNvbnN0IGhPUCA9IHN1YnNjcmlwdGlvbnMuaGFzT3duUHJvcGVydHk7XG5cbiAgICBjb25zdCBwdWJsaXNoID0gKGV2ZW50LGRhdGEpID0+IHtcbiAgICAgICAgLy9pZiB0b3BpYyBkb2Vzbid0IGV4aXN0LCBkbyBub3RoaW5nXG4gICAgICAgIGlmICghaE9QLmNhbGwoc3Vic2NyaXB0aW9ucyxldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJzogTm8gc3VjaCBldmVudCwgb3Igbm8gc3Vic2NyaWJlcnMhJywgc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL2FjdGl2YXRlIHN1YnNjcmliZXJzXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0oZGF0YSAhPSB1bmRlZmluZWQgPyBkYXRhIDoge30pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1B1Ymxpc2hlZCAnICsgZXZlbnQgKyAnIHdpdGggJyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmUgPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIC8vIGVycm9yIGlmIG5vIGZ1bmN0aW9uXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbWlzc2luZyBmcm9tIHN1YnNjcmliZTogJyArIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlcnJvciBpZiBub3QgYSBmdW5jdGlvblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7YGBcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24gZnJvbSBzdWJzY3JpYmU6ICcgKyBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9tYWtlIGV2ZW50IGlmIG5vbmUgZXhpc3RzXG4gICAgICAgIGlmKCFoT1AuY2FsbChzdWJzY3JpcHRpb25zLGV2ZW50KSkge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvL3B1c2ggc3Vic2NyaWJlciB0byBldmVudFxuICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdGlvbnNbZXZlbnRdLnB1c2goY2FsbGJhY2spIC0gMTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ05ldyBzdWJzY3JpYmVyIHRvIGV2ZW50OiAnICsgZXZlbnQgLCBzdWJzY3JpcHRpb25zKTtcbiAgICAgICAgLy8gYWRkIG1ldGhvZCB0byByZW1vdmVcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0uc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cmVtb3ZlfTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7cHVibGlzaCwgc3Vic2NyaWJlLCBzdWJzY3JpcHRpb25zfTtcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXG5pbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCBzY3JlZW5Db250cm9sbGVyID0gKCgpID0+IHtcbiAgY29uc3QgdXBkYXRlU2NyZWVuID0gKGNvbnRlbnQpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIik7XG4gICAgbGV0IGNvbnRlbnREaXY7XG4gICAgaWYgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29udGVudC0ke2NvbnRlbnQuaWR9YCkpIHtcbiAgICAgIGNvbnRlbnREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29udGVudC0ke2NvbnRlbnQuaWR9YClcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGVudERpdi5pZCA9IGBjb250ZW50LSR7Y29udGVudC5pZH1gO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuICAgIH07XG4gICAgY29udGVudERpdi5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVMaXN0ID0gKGxpc3QpID0+IHtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGxpc3QucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgfVxuICBcblxuICBjb25zdCBpbml0aWFsaXNlU2NyZWVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5pZCA9IFwiY29udGFpbmVyXCI7XG4gICAgYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250ZW50LmlkID0gJ2NvbnRlbnQnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XG4gICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcImRpYWxvZy1tb2RhbFwiKTtcbiAgICBtb2RhbC5pZCA9ICdmb3JtLW1vZGFsJ1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgbGlzdENsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2xpY2tlZEl0ZW0gPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmxpc3QtY29udGFpbmVyJyk7XG4gICAgaWYgKCFjbGlja2VkSXRlbSkgcmV0dXJuO1xuICAgIGNvbnN0IGNsaWNrZWRMaXN0ID0gY2xpY2tlZEl0ZW0ucXVlcnlTZWxlY3RvcignLnRvZG8taXRlbScpO1xuICAgIGNvbnNvbGUubG9nKGNsaWNrZWRJdGVtLCBjbGlja2VkTGlzdCk7XG4gICAgcHViU3ViLnB1Ymxpc2goJ2l0ZW1NZW51JyxjbGlja2VkTGlzdCk7XG4gIH1cblxuICBjb25zdCBpdGVtTWVudSA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IG1lbnVQYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgICBtZW51UGFuLmNsYXNzTGlzdC5hZGQoJ21lbnUnKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobWVudVBhbik7XG4gICAgY29uc3QgZG9uZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRvbmVCdXR0b24uaWQgPSAnbWVudS1kb25lJztcbiAgICBkb25lQnV0dG9uLnRleHRDb250ZW50ID0gJ2RvbmUnO1xuICAgIGRvbmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaXRlbURvbmUnLGl0ZW0pO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICB9KTtcbiAgICBjb25zdCBlZGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZWRpdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdlZGl0JztcbiAgICBlZGl0QnV0dG9uLmlkID0gJ21lbnUtZWRpdCc7ICAgIFxuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpID0+IHtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaXRlbUVkaXQnLGl0ZW0pfVxuICAgICAgKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWxCdXR0b24udGV4dENvbnRlbnQgPSAnY2FuY2VsJztcbiAgICBjYW5jZWxCdXR0b24uaWQgPSAnbWVudS1jYW5jZWwnOyAgICBcbiAgICBjYW5jZWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBtZW51UGFuLmlubmVySFRNTCA9ICcnO1xuICAgICAgbWVudVBhbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG1lbnVQYW4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRlbGV0ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdkZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi5pZCA9ICdtZW51LWRlbGV0ZSc7XG4gICAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdpdGVtRGVsZXRlJyxpdGVtKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgfSlcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGRlbGV0ZUJ1dHRvbik7XG4gICAgbWVudVBhbi5hcHBlbmRDaGlsZChkb25lQnV0dG9uKTtcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGVkaXRCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoY2FuY2VsQnV0dG9uKTtcbiAgICBtZW51UGFuLnNob3dNb2RhbCgpO1xuICB9XG5cbiAgY29uc3QgbGlzdEV4aXN0RXJyb3IgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGZvdW5kLi4uJyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoZXJyb3JNZXNzYWdlKTtcbiAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY29uZmlybUJ1dHRvbik7XG4gICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLW1lc3NhZ2UnKTtcbiAgICBkaWFsb2cuc2hvdygpO1xuICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9ICAnbGlzdCBhbHJlYWR5IGV4aXN0cyEnO1xuICAgIGNvbmZpcm1CdXR0b24udGV4dENvbnRlbnQgPSAnb2snO1xuICAgIGNvbmZpcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBwdWJTdWIucHVibGlzaCgnbWFrZVByb2plY3QnKTtcbiAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgZGlhbG9nLmlubmVySFRNTCA9ICcnO1xuICAgICAgZGlhbG9nLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZGlhbG9nKTtcbiAgICB9KTtcbiAgfVxuICAgIFxuICBcbiAgY29uc3QgbGlzdEV4aXN0U3ViID0gcHViU3ViLnN1YnNjcmliZSgnbGlzdEV4aXN0RXJyb3InLGxpc3RFeGlzdEVycm9yKTtcbiAgY29uc3QgcmVtb3ZlTGlzdFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ3JlbW92ZUxpc3QnLHJlbW92ZUxpc3QpO1xuICBjb25zdCBpdGVtTWVudVN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2l0ZW1NZW51JywgaXRlbU1lbnUpO1xuICBjb25zdCBsaXN0Q2xpY2tTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdsaXN0Q2xpY2snLCBsaXN0Q2xpY2spO1xuICBjb25zdCB1cGRhdGVTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKFwidXBkYXRlU2NyZWVuXCIsIHVwZGF0ZVNjcmVlbik7XG4gIGNvbnN0IGluaXRpYWxpc2VTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdpbml0aWFsaXNlJyxpbml0aWFsaXNlU2NyZWVuKTtcbn0pKCk7XG5cbmNvbnN0IGlucHV0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBjcmVhdGVTZWxlY3QgPSAocHJvamVjdHMpID0+IHtcbiAgICBjb25zdCBzZWxlY3RCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuICAgIHNlbGVjdEJveC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwibGlzdE5hbWVcIik7XG4gICAgc2VsZWN0Qm94LmlkID0gXCJzZWxlY3QtbGlzdHNcIjtcbiAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgT2JqZWN0LmtleXMocHJvamVjdHMpKSB7XG4gICAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgbmV3T3B0aW9uLnZhbHVlID0gcHJvamVjdHNbbGlzdF0ubmFtZTtcbiAgICAgIG5ld09wdGlvbi50ZXh0Q29udGVudCA9IHByb2plY3RzW2xpc3RdLm5hbWU7XG4gICAgICBzZWxlY3RCb3guYXBwZW5kQ2hpbGQobmV3T3B0aW9uKTtcbiAgICB9O1xuICAgIHB1YlN1Yi5wdWJsaXNoKCdyZWNlaXZlU2VsZWN0Jywgc2VsZWN0Qm94KTtcbiAgfTtcblxuICBjb25zdCBtYWtlTW9kYWwgPSAoZm9yTGlzdCkgPT4ge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tbW9kYWwnKTtcbiAgICBjb25zdCBnZXRRdWVyaWVzU3Vic2NyaXB0aW9uID0gcHViU3ViLnN1YnNjcmliZShcbiAgICAgIFwicmVjZWl2ZVF1ZXJpZXNcIixcbiAgICAgIG1ha2VJbnB1dHNcbiAgICApO1xuICAgIGNvbnN0IGdldFByb2plY3RTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKFxuICAgICAgXCJyZWNlaXZlTGlzdFwiLFxuICAgICAgY3JlYXRlU2VsZWN0XG4gICAgKTtcbiAgICBjb25zdCBuZXdGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgbmV3Rm9ybS5jbGFzc0xpc3QuYWRkKFwiaW5wdXQtZm9ybVwiKTtcbiAgICBuZXdGb3JtLmlkID0gXCJtb2RhbC1mb3JtXCI7XG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobmV3Rm9ybSk7XG4gICAgc3dpdGNoIChmb3JMaXN0LmFjdGlvbikge1xuICAgICAgY2FzZSAnbmV3SXRlbScgOlxuICAgICAgICBwdWJTdWIucHVibGlzaChcInNlbmRJdGVtUXVlcmllc1wiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlZGl0VGFza0VuZCcgOlxuICAgICAgICBwdWJTdWIucHVibGlzaChcInNlbmRJdGVtUXVlcmllc1wiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICduZXdQcm9qZWN0JyA6XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdzZW5kUHJvamVjdFF1ZXJpZXMnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG4gICAgaWYgKG5ld0Zvcm0ucXVlcnlTZWxlY3Rvcignc2VsZWN0JykpIHsgXG4gICAgICBjb25zdCBzZWxlY3Rpb25zID0gbmV3Rm9ybS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKS5jaGlsZHJlbjtcbiAgICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IHNlbGVjdGlvbnMubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgIGlmIChzZWxlY3Rpb25zW2ldLnZhbHVlID09PSBmb3JMaXN0Lmxpc3QpIHNlbGVjdGlvbnNbaV0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm9yTGlzdC5oYXNPd25Qcm9wZXJ0eSgnYXNzaWduZWQnKSkge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGZvckxpc3QuYXNzaWduZWQpO1xuICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaW5wdXQtJHtrZXl9YCk7XG4gICAgICAgIGlmICghZm9ybUVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgZm9ybUVsZW1lbnQudmFsdWUgPSBmb3JMaXN0LmFzc2lnbmVkW2tleV07XG4gICAgICB9KVxuICAgIH1cbiAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uLWNvbnRhaW5lcicpO1xuICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKTtcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnbW9kYWwtc3VibWl0Jyk7XG4gICAgc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gJ2NvbmZpcm0nO1xuICAgIHN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdzdWJtaXQnKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWxCdXR0b24uY2xhc3NMaXN0LmFkZCgnbW9kYWwtY2FuY2VsJyk7XG4gICAgY2FuY2VsQnV0dG9uLnRleHRDb250ZW50ID0gJ2NhbmNlbCdcbiAgICBjYW5jZWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpID0+IHtcbiAgICAgIGdldFByb2plY3RTdWJzY3JpcHRpb24ucmVtb3ZlKCk7XG4gICAgICBnZXRRdWVyaWVzU3Vic2NyaXB0aW9uLnJlbW92ZSgpO1xuICAgICAgbW9kYWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBtb2RhbC5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdWJtaXRCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW5jZWxCdXR0b24pO1xuICAgIG5ld0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0ge307XG4gICAgICAgIEFycmF5LmZyb20obmV3Rm9ybS5lbGVtZW50cykuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGZvcm1EYXRhW2lucHV0Lm5hbWVdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgbW9kYWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBnZXRQcm9qZWN0U3Vic2NyaXB0aW9uLnJlbW92ZSgpO1xuICAgICAgICAgICAgZ2V0UXVlcmllc1N1YnNjcmlwdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKGZvckxpc3QuYWN0aW9uLGZvcm1EYXRhKTtcbiAgICB9KTtcbiAgICBtb2RhbC5zaG93TW9kYWwoKTtcbiAgfTtcblxuICBjb25zdCBtYWtlSW5wdXRzID0gKHF1ZXJpZXMpID0+IHtcbiAgICBjb25zdCBuZXdGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbC1mb3JtXCIpO1xuICAgIHF1ZXJpZXMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xuICAgICAgc3dpdGNoIChzZWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcImlucHV0XCI6IHtcbiAgICAgICAgICBjb25zdCBuZXdJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICBuZXdJbnB1dC5pZCA9IGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gO1xuICAgICAgICAgIG5ld0lucHV0LnJlcXVpcmVkID0gc2VjdGlvbi5yZXF1aXJlZDtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIHNlY3Rpb24ubmFtZSk7XG4gICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgbmV3TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gKTtcbiAgICAgICAgICBuZXdMYWJlbC50ZXh0Q29udGVudCA9IHNlY3Rpb24ubmFtZTtcbiAgICAgICAgICBuZXdJbnB1dC5jbGFzc0xpc3QuYWRkKFwidGV4dC1pbnB1dFwiKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0xhYmVsKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0lucHV0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiYXJlYVwiOiB7XG4gICAgICAgICAgY29uc3QgbmV3SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgICAgbmV3SW5wdXQuaWQgPSBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YDtcbiAgICAgICAgICBuZXdJbnB1dC5yZXF1aXJlZCA9IHNlY3Rpb24ucmVxdWlyZWQ7XG4gICAgICAgICAgbmV3SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBzZWN0aW9uLm5hbWUpO1xuICAgICAgICAgIGNvbnN0IG5ld0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YCk7XG4gICAgICAgICAgbmV3TGFiZWwuc2V0QXR0cmlidXRlKFwicm93c1wiLCBgNGApO1xuICAgICAgICAgIG5ld0xhYmVsLnRleHRDb250ZW50ID0gc2VjdGlvbi5uYW1lO1xuICAgICAgICAgIG5ld0lucHV0LmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWlucHV0XCIpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3TGFiZWwpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3SW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2RhdGUnOiB7XG4gICAgICAgICAgY29uc3QgbmV3SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgbmV3SW5wdXQuaWQgPSBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YDtcbiAgICAgICAgICBuZXdJbnB1dC5yZXF1aXJlZCA9IHNlY3Rpb24ucmVxdWlyZWQ7XG4gICAgICAgICAgbmV3SW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImRhdGVcIik7XG4gICAgICAgICAgbmV3SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBzZWN0aW9uLm5hbWUpO1xuICAgICAgICAgIGNvbnN0IG5ld0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YCk7XG4gICAgICAgICAgbmV3TGFiZWwudGV4dENvbnRlbnQgPSBzZWN0aW9uLm5hbWU7XG4gICAgICAgICAgbmV3SW5wdXQuY2xhc3NMaXN0LmFkZChcImRhdGUtaW5wdXRcIik7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdMYWJlbCk7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdJbnB1dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcInNlbGVjdFwiOiB7XG4gICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgbmV3TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gKTtcbiAgICAgICAgICBuZXdMYWJlbC50ZXh0Q29udGVudCA9IHNlY3Rpb24ubmFtZTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0xhYmVsKTtcbiAgICAgICAgICBjb25zdCBzZWxlY3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdyZWNlaXZlU2VsZWN0Jywoc2VsZWN0Qm94KSA9PiB7XG4gICAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKHNlbGVjdEJveCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICBwdWJTdWIucHVibGlzaCgnc2VuZExpc3QnKTtcbiAgICAgICAgICBzZWxlY3RTdWIucmVtb3ZlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KVxuICB9O1xuICBjb25zdCBtYWtlTW9kYWxTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdtYWtlTW9kYWwnLCBtYWtlTW9kYWwpO1xufSkoKTtcblxuY29uc3Qgc2lkZUJhciA9ICgoKSA9PiB7XG5cbiAgY29uc3Qgc2lkZUJhckJ1dHRvbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXInKTtcbiAgICBoZWFkZXIuaWQgPSAnaGVhZGVyJztcbiAgICBib2R5Lmluc2VydEJlZm9yZShoZWFkZXIsIGNvbnRlbnQpO1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiUHJvamVjdHNcIjtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2lkZWJhci10aXRsZVwiKTtcbiAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgIGNvbnN0IHNpZGViYXIgPSBpbml0aWFsaXNlU2lkZUJhcigpOyAgXG4gICAgY29uc29sZS5sb2coJ1NpZGViYXI6ICcgLCBzaWRlYmFyKTtcbiAgICB0aXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNpZGViYXIuc3R5bGUuZGlzcGxheSA9ICdncmlkJyk7XG4gICAgIFxuICB9XG5cbiAgY29uc3QgaGlkZVNpZGViYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyJyk7XG4gICAgc2lkZWJhci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgY29uc3QgaW5pdGlhbGlzZVNpZGVCYXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuICAgIGNvbnN0IHNpZGViYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xuICAgIHNpZGViYXIuaWQgPSBcInNpZGViYXJcIjtcbiAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoJ21lbnUnKTtcbiAgICBjb25zdCBzaWRlYmFyQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNpZGViYXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QtbGlzdCcpO1xuICAgIHNpZGViYXIuYXBwZW5kQ2hpbGQoc2lkZWJhckNvbnRlbnQpO1xuICAgIG1ha2VTaWRlQmFyU3ViLnJlbW92ZSgpO1xuICAgIGNvbnN0IG5ld0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld0J1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXctYnV0dG9uJyk7XG4gICAgbmV3QnV0dG9uLnRleHRDb250ZW50ID0gJ25ldyBwcm9qZWN0JztcbiAgICBzaWRlYmFyLmFwcGVuZENoaWxkKG5ld0J1dHRvbik7XG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVTaWRlYmFyKTtcbiAgICBjbG9zZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdjbG9zZSdcbiAgICBzaWRlYmFyLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcbiAgICBuZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpID0+IHtwdWJTdWIucHVibGlzaCgnbWFrZVByb2plY3QnKX0pO1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQoc2lkZWJhcik7XG4gICAgc2lkZWJhci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHJldHVybiBzaWRlYmFyO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZVByb2plY3QgPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGxpc3QtJHtwcm9qZWN0Lm5hbWUucmVwbGFjZSgvXFxzL2csJycpfWApO1xuICAgIHByb2plY3RFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJvamVjdEVsZW1lbnQpO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdE1lbnUgPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBtZW51UGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgbWVudVBhbi5jbGFzc0xpc3QuYWRkKCdtZW51Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1lbnVQYW4pO1xuICAgIGNvbnN0IHNob3dCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzaG93QnV0dG9uLmlkID0gJ21lbnUtc2hvdyc7XG4gICAgc2hvd0J1dHRvbi50ZXh0Q29udGVudCA9ICdzaG93JztcbiAgICBzaG93QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwdWJsaXNoTGlzdCcscHJvamVjdCk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaGlkZUJhcicpO1xuICAgIH0pO1xuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRlbGV0ZUJ1dHRvbi5pZCA9ICdtZW51LWRlbGV0ZSc7XG4gICAgZGVsZXRlQnV0dG9uLnRleHRDb250ZW50ID0gJ2RlbGV0ZSc7XG4gICAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICAgIGRlbGV0ZUNvbmZpcm0ocHJvamVjdCk7XG4gICAgfSk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsQnV0dG9uLnRleHRDb250ZW50ID0gJ2NhbmNlbCc7XG4gICAgY2FuY2VsQnV0dG9uLmlkID0gJ21lbnUtY2FuY2VsJzsgICAgXG4gICAgY2FuY2VsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdoaWRlQmFyJyk7XG4gICAgfSk7ICAgIFxuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoc2hvd0J1dHRvbik7XG4gICAgbWVudVBhbi5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoY2FuY2VsQnV0dG9uKTtcbiAgICBtZW51UGFuLnNob3dNb2RhbCgpO1xuICB9XG5cbiAgY29uc3QgZGVsZXRlQ29uZmlybSA9IChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIGNvbnN0IGNvbmZpcm1NZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdtZW51Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpYWxvZyk7XG4gICAgZGlhbG9nLmFwcGVuZENoaWxkKGNvbmZpcm1NZXNzYWdlKTtcbiAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKTtcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoY29uZmlybUJ1dHRvbik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGNhbmNlbEJ1dHRvbik7XG4gICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2NvbmZpcm0tbWVzc2FnZScpO1xuICAgIGRpYWxvZy5zaG93KCk7XG4gICAgY29uZmlybU1lc3NhZ2UudGV4dENvbnRlbnQgPSAgJ2RlbGV0ZSBwcm9qZWN0Pyc7XG4gICAgY29uZmlybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdvayc7XG4gICAgY2FuY2VsQnV0dG9uLnRleHRDb250ZW50ID0gJ2NhbmNlbCc7XG4gICAgY2FuY2VsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICBkaWFsb2cuaW5uZXJIVE1MID0gJyc7XG4gICAgICBkaWFsb2cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChkaWFsb2cpO1xuICAgIH0pO1xuICAgIGNvbmZpcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBwdWJTdWIucHVibGlzaCgnZGVsZXRlTGlzdCcscHJvamVjdCk7XG4gICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIGRpYWxvZy5pbm5lckhUTUwgPSAnJztcbiAgICAgIGRpYWxvZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGRpYWxvZyk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaGlkZUJhcicpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2cocHJvamVjdCk7XG5cbiAgfVxuXG4gIGNvbnN0IGFkZFRvU2lkZUJhciA9IChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0LWxpc3QnKTtcbiAgICBjb25zdCBwcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJwcm9qZWN0LWJ1dHRvblwiKTtcbiAgICBwcm9qZWN0QnV0dG9uLmlkID0gYGxpc3QtJHtwcm9qZWN0Lm5hbWUucmVwbGFjZSgvXFxzL2csJycpfWA7XG4gICAgcHJvamVjdEJ1dHRvbi50ZXh0Q29udGVudCA9IHByb2plY3QubmFtZTtcbiAgICBzaWRlYmFyLmFwcGVuZENoaWxkKHByb2plY3RCdXR0b24pO1xuICAgIHByb2plY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpID0+IHtcbiAgICAgIHByb2plY3RNZW51KHByb2plY3QpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCJBZGRlZCBwcm9qZWN0OiBcIixwcm9qZWN0Lm5hbWUpO1xuICB9O1xuICBjb25zdCBoaWRlU2lkZUJhclN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2hpZGVCYXInLCBoaWRlU2lkZWJhcik7XG4gIGNvbnN0IHJlbW92ZVByb2plY3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdkZWxldGVMaXN0JywgcmVtb3ZlUHJvamVjdCk7XG4gIGNvbnN0IG1ha2VTaWRlQmFyU3ViID0gcHViU3ViLnN1YnNjcmliZSgnbWFrZVNpZGVCYXInLCBzaWRlQmFyQnV0dG9uKTtcbiAgY29uc3QgYWRkU2lkZUJhclN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoXCJhZGRQcm9qZWN0XCIsIGFkZFRvU2lkZUJhcik7XG59KSgpO1xuXG5leHBvcnQgeyBzY3JlZW5Db250cm9sbGVyLCBzaWRlQmFyIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=