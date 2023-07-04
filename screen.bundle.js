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
    const footer = document.createElement('div');
    footer.classList.add('footer');
    footer.innerHTML = "<a href='https://www.github.com/niallantony'> made by Niall Antonny </a>"
    body.appendChild(footer);
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
    const newTitle = document.createElement('div');
    newTitle.textContent = 'To-Dos'
    newTitle.classList.add('title')
    const title = document.createElement("button");
    title.textContent = "Projects";
    title.classList.add("sidebar-title");
    header.appendChild(title);
    header.appendChild(newTitle)
    const sidebar = initialiseSideBar();  
    console.log('Sidebar: ' , sidebar);
    title.addEventListener('click', () => sidebar.style.display = 'flex');
     
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
    const newContainer = document.createElement('div');
    newContainer.classList.add('button-container');
    sidebar.appendChild(newContainer);
    newContainer.appendChild(newButton);
    const closeButton = document.createElement('button');
    closeButton.addEventListener('click', hideSidebar);
    closeButton.textContent = 'close'
    newContainer.appendChild(closeButton);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQsK0JBQStCO0FBQzFGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLE1BQU0sK0NBQU07QUFDWixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwrQkFBK0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlCQUF5QiwrQ0FBTTtBQUMvQiwyQkFBMkIsK0NBQU07QUFDakMseUJBQXlCLCtDQUFNO0FBQy9CLGlDQUFpQywrQ0FBTTtBQUN2QyxDQUFDOztBQUVvQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG9saXN0Ly4vc3JjL3B1YnN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG9saXN0Ly4vc3JjL3NjcmVlbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY29uc3QgcHViU3ViID0oKCkgPT4ge1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGNvbnN0IGhPUCA9IHN1YnNjcmlwdGlvbnMuaGFzT3duUHJvcGVydHk7XG5cbiAgICBjb25zdCBwdWJsaXNoID0gKGV2ZW50LGRhdGEpID0+IHtcbiAgICAgICAgLy9pZiB0b3BpYyBkb2Vzbid0IGV4aXN0LCBkbyBub3RoaW5nXG4gICAgICAgIGlmICghaE9QLmNhbGwoc3Vic2NyaXB0aW9ucyxldmVudCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJzogTm8gc3VjaCBldmVudCwgb3Igbm8gc3Vic2NyaWJlcnMhJywgc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL2FjdGl2YXRlIHN1YnNjcmliZXJzXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0oZGF0YSAhPSB1bmRlZmluZWQgPyBkYXRhIDoge30pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1B1Ymxpc2hlZCAnICsgZXZlbnQgKyAnIHdpdGggJyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmUgPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIC8vIGVycm9yIGlmIG5vIGZ1bmN0aW9uXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbWlzc2luZyBmcm9tIHN1YnNjcmliZTogJyArIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlcnJvciBpZiBub3QgYSBmdW5jdGlvblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7YGBcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24gZnJvbSBzdWJzY3JpYmU6ICcgKyBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9tYWtlIGV2ZW50IGlmIG5vbmUgZXhpc3RzXG4gICAgICAgIGlmKCFoT1AuY2FsbChzdWJzY3JpcHRpb25zLGV2ZW50KSkge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvL3B1c2ggc3Vic2NyaWJlciB0byBldmVudFxuICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdGlvbnNbZXZlbnRdLnB1c2goY2FsbGJhY2spIC0gMTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ05ldyBzdWJzY3JpYmVyIHRvIGV2ZW50OiAnICsgZXZlbnQgLCBzdWJzY3JpcHRpb25zKTtcbiAgICAgICAgLy8gYWRkIG1ldGhvZCB0byByZW1vdmVcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uc1tldmVudF0uc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cmVtb3ZlfTtcbiAgICB9XG5cblxuICAgIHJldHVybiB7cHVibGlzaCwgc3Vic2NyaWJlLCBzdWJzY3JpcHRpb25zfTtcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgcHViU3ViOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXG5pbXBvcnQgcHViU3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCBzY3JlZW5Db250cm9sbGVyID0gKCgpID0+IHtcbiAgY29uc3QgdXBkYXRlU2NyZWVuID0gKGNvbnRlbnQpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIik7XG4gICAgbGV0IGNvbnRlbnREaXY7XG4gICAgaWYgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29udGVudC0ke2NvbnRlbnQuaWR9YCkpIHtcbiAgICAgIGNvbnRlbnREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29udGVudC0ke2NvbnRlbnQuaWR9YClcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGVudERpdi5pZCA9IGBjb250ZW50LSR7Y29udGVudC5pZH1gO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuICAgIH07XG4gICAgY29udGVudERpdi5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVMaXN0ID0gKGxpc3QpID0+IHtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGxpc3QucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgfVxuICBcblxuICBjb25zdCBpbml0aWFsaXNlU2NyZWVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5pZCA9IFwiY29udGFpbmVyXCI7XG4gICAgYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250ZW50LmlkID0gJ2NvbnRlbnQnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XG4gICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcImRpYWxvZy1tb2RhbFwiKTtcbiAgICBtb2RhbC5pZCA9ICdmb3JtLW1vZGFsJ1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtb2RhbCk7XG4gICAgY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoJ2Zvb3RlcicpO1xuICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J2h0dHBzOi8vd3d3LmdpdGh1Yi5jb20vbmlhbGxhbnRvbnknPiBtYWRlIGJ5IE5pYWxsIEFudG9ubnkgPC9hPlwiXG4gICAgYm9keS5hcHBlbmRDaGlsZChmb290ZXIpO1xuICB9O1xuXG4gIGNvbnN0IGxpc3RDbGljayA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNsaWNrZWRJdGVtID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5saXN0LWNvbnRhaW5lcicpO1xuICAgIGlmICghY2xpY2tlZEl0ZW0pIHJldHVybjtcbiAgICBjb25zdCBjbGlja2VkTGlzdCA9IGNsaWNrZWRJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50b2RvLWl0ZW0nKTtcbiAgICBjb25zb2xlLmxvZyhjbGlja2VkSXRlbSwgY2xpY2tlZExpc3QpO1xuICAgIHB1YlN1Yi5wdWJsaXNoKCdpdGVtTWVudScsY2xpY2tlZExpc3QpO1xuICB9XG5cbiAgY29uc3QgaXRlbU1lbnUgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBtZW51UGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgbWVudVBhbi5jbGFzc0xpc3QuYWRkKCdtZW51Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1lbnVQYW4pO1xuICAgIGNvbnN0IGRvbmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkb25lQnV0dG9uLmlkID0gJ21lbnUtZG9uZSc7XG4gICAgZG9uZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdkb25lJztcbiAgICBkb25lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2l0ZW1Eb25lJyxpdGVtKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgfSk7XG4gICAgY29uc3QgZWRpdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGVkaXRCdXR0b24udGV4dENvbnRlbnQgPSAnZWRpdCc7XG4gICAgZWRpdEJ1dHRvbi5pZCA9ICdtZW51LWVkaXQnOyAgICBcbiAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKSA9PiB7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBtZW51UGFuLmlubmVySFRNTCA9ICcnO1xuICAgICAgbWVudVBhbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG1lbnVQYW4pO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2l0ZW1FZGl0JyxpdGVtKX1cbiAgICAgICk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsQnV0dG9uLnRleHRDb250ZW50ID0gJ2NhbmNlbCc7XG4gICAgY2FuY2VsQnV0dG9uLmlkID0gJ21lbnUtY2FuY2VsJzsgICAgXG4gICAgY2FuY2VsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICB9KTtcbiAgICBjb25zdCBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkZWxldGVCdXR0b24udGV4dENvbnRlbnQgPSAnZGVsZXRlJztcbiAgICBkZWxldGVCdXR0b24uaWQgPSAnbWVudS1kZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaXRlbURlbGV0ZScsaXRlbSk7XG4gICAgICBtZW51UGFuLmlubmVySFRNTCA9ICcnO1xuICAgICAgbWVudVBhbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG1lbnVQYW4pO1xuICAgIH0pXG4gICAgbWVudVBhbi5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoZG9uZUJ1dHRvbik7XG4gICAgbWVudVBhbi5hcHBlbmRDaGlsZChlZGl0QnV0dG9uKTtcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGNhbmNlbEJ1dHRvbik7XG4gICAgbWVudVBhbi5zaG93TW9kYWwoKTtcbiAgfVxuXG4gIGNvbnN0IGxpc3RFeGlzdEVycm9yID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBmb3VuZC4uLicpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpYWxvZyk7XG4gICAgZGlhbG9nLmFwcGVuZENoaWxkKGVycm9yTWVzc2FnZSk7XG4gICAgZGlhbG9nLmFwcGVuZENoaWxkKGNvbmZpcm1CdXR0b24pO1xuICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdlcnJvci1tZXNzYWdlJyk7XG4gICAgZGlhbG9nLnNob3coKTtcbiAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSAgJ2xpc3QgYWxyZWFkeSBleGlzdHMhJztcbiAgICBjb25maXJtQnV0dG9uLnRleHRDb250ZW50ID0gJ29rJztcbiAgICBjb25maXJtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ21ha2VQcm9qZWN0Jyk7XG4gICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIGRpYWxvZy5pbm5lckhUTUwgPSAnJztcbiAgICAgIGRpYWxvZy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGRpYWxvZyk7XG4gICAgfSk7XG4gIH1cbiAgICBcbiAgXG4gIGNvbnN0IGxpc3RFeGlzdFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2xpc3RFeGlzdEVycm9yJyxsaXN0RXhpc3RFcnJvcik7XG4gIGNvbnN0IHJlbW92ZUxpc3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdyZW1vdmVMaXN0JyxyZW1vdmVMaXN0KTtcbiAgY29uc3QgaXRlbU1lbnVTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdpdGVtTWVudScsIGl0ZW1NZW51KTtcbiAgY29uc3QgbGlzdENsaWNrU3ViID0gcHViU3ViLnN1YnNjcmliZSgnbGlzdENsaWNrJywgbGlzdENsaWNrKTtcbiAgY29uc3QgdXBkYXRlU3Vic2NyaXB0aW9uID0gcHViU3ViLnN1YnNjcmliZShcInVwZGF0ZVNjcmVlblwiLCB1cGRhdGVTY3JlZW4pO1xuICBjb25zdCBpbml0aWFsaXNlU3ViID0gcHViU3ViLnN1YnNjcmliZSgnaW5pdGlhbGlzZScsaW5pdGlhbGlzZVNjcmVlbik7XG59KSgpO1xuXG5jb25zdCBpbnB1dE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgY3JlYXRlU2VsZWN0ID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICBzZWxlY3RCb3guc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImxpc3ROYW1lXCIpO1xuICAgIHNlbGVjdEJveC5pZCA9IFwic2VsZWN0LWxpc3RzXCI7XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIE9iamVjdC5rZXlzKHByb2plY3RzKSkge1xuICAgICAgY29uc3QgbmV3T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgIG5ld09wdGlvbi52YWx1ZSA9IHByb2plY3RzW2xpc3RdLm5hbWU7XG4gICAgICBuZXdPcHRpb24udGV4dENvbnRlbnQgPSBwcm9qZWN0c1tsaXN0XS5uYW1lO1xuICAgICAgc2VsZWN0Qm94LmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgfTtcbiAgICBwdWJTdWIucHVibGlzaCgncmVjZWl2ZVNlbGVjdCcsIHNlbGVjdEJveCk7XG4gIH07XG5cbiAgY29uc3QgbWFrZU1vZGFsID0gKGZvckxpc3QpID0+IHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLW1vZGFsJyk7XG4gICAgY29uc3QgZ2V0UXVlcmllc1N1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoXG4gICAgICBcInJlY2VpdmVRdWVyaWVzXCIsXG4gICAgICBtYWtlSW5wdXRzXG4gICAgKTtcbiAgICBjb25zdCBnZXRQcm9qZWN0U3Vic2NyaXB0aW9uID0gcHViU3ViLnN1YnNjcmliZShcbiAgICAgIFwicmVjZWl2ZUxpc3RcIixcbiAgICAgIGNyZWF0ZVNlbGVjdFxuICAgICk7XG4gICAgY29uc3QgbmV3Rm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgIG5ld0Zvcm0uY2xhc3NMaXN0LmFkZChcImlucHV0LWZvcm1cIik7XG4gICAgbmV3Rm9ybS5pZCA9IFwibW9kYWwtZm9ybVwiO1xuICAgIG1vZGFsLmFwcGVuZENoaWxkKG5ld0Zvcm0pO1xuICAgIHN3aXRjaCAoZm9yTGlzdC5hY3Rpb24pIHtcbiAgICAgIGNhc2UgJ25ld0l0ZW0nIDpcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goXCJzZW5kSXRlbVF1ZXJpZXNcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZWRpdFRhc2tFbmQnIDpcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goXCJzZW5kSXRlbVF1ZXJpZXNcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbmV3UHJvamVjdCcgOlxuICAgICAgICBwdWJTdWIucHVibGlzaCgnc2VuZFByb2plY3RRdWVyaWVzJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDogYnJlYWs7XG4gICAgfVxuICAgIGlmIChuZXdGb3JtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpKSB7IFxuICAgICAgY29uc3Qgc2VsZWN0aW9ucyA9IG5ld0Zvcm0ucXVlcnlTZWxlY3Rvcignc2VsZWN0JykuY2hpbGRyZW47XG4gICAgICBmb3IgKGxldCBpID0gMCA7IGkgPCBzZWxlY3Rpb25zLmxlbmd0aCA7IGkrKykge1xuICAgICAgICBpZiAoc2VsZWN0aW9uc1tpXS52YWx1ZSA9PT0gZm9yTGlzdC5saXN0KSBzZWxlY3Rpb25zW2ldLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZvckxpc3QuaGFzT3duUHJvcGVydHkoJ2Fzc2lnbmVkJykpIHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhmb3JMaXN0LmFzc2lnbmVkKTtcbiAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGlucHV0LSR7a2V5fWApO1xuICAgICAgICBpZiAoIWZvcm1FbGVtZW50KSByZXR1cm47XG4gICAgICAgIGZvcm1FbGVtZW50LnZhbHVlID0gZm9yTGlzdC5hc3NpZ25lZFtrZXldO1xuICAgICAgfSlcbiAgICB9XG4gICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbi1jb250YWluZXInKTtcbiAgICBuZXdGb3JtLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21vZGFsLXN1Ym1pdCcpO1xuICAgIHN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjb25maXJtJztcbiAgICBzdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywnc3VibWl0Jyk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWNhbmNlbCcpO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnXG4gICAgY2FuY2VsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKSA9PiB7XG4gICAgICBnZXRQcm9qZWN0U3Vic2NyaXB0aW9uLnJlbW92ZSgpO1xuICAgICAgZ2V0UXVlcmllc1N1YnNjcmlwdGlvbi5yZW1vdmUoKTtcbiAgICAgIG1vZGFsLmlubmVySFRNTCA9ICcnO1xuICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICB9KTtcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoc3VibWl0QnV0dG9uKTtcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoY2FuY2VsQnV0dG9uKTtcbiAgICBuZXdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwoZSkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IHt9O1xuICAgICAgICBBcnJheS5mcm9tKG5ld0Zvcm0uZWxlbWVudHMpLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBmb3JtRGF0YVtpbnB1dC5uYW1lXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgICAgIG1vZGFsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgZ2V0UHJvamVjdFN1YnNjcmlwdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgICAgIGdldFF1ZXJpZXNTdWJzY3JpcHRpb24ucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBwdWJTdWIucHVibGlzaChmb3JMaXN0LmFjdGlvbixmb3JtRGF0YSk7XG4gICAgfSk7XG4gICAgbW9kYWwuc2hvd01vZGFsKCk7XG4gIH07XG5cbiAgY29uc3QgbWFrZUlucHV0cyA9IChxdWVyaWVzKSA9PiB7XG4gICAgY29uc3QgbmV3Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kYWwtZm9ybVwiKTtcbiAgICBxdWVyaWVzLmZvckVhY2goKHNlY3Rpb24pID0+IHtcbiAgICAgIHN3aXRjaCAoc2VjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJpbnB1dFwiOiB7XG4gICAgICAgICAgY29uc3QgbmV3SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgbmV3SW5wdXQuaWQgPSBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YDtcbiAgICAgICAgICBuZXdJbnB1dC5yZXF1aXJlZCA9IHNlY3Rpb24ucmVxdWlyZWQ7XG4gICAgICAgICAgbmV3SW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG4gICAgICAgICAgbmV3SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBzZWN0aW9uLm5hbWUpO1xuICAgICAgICAgIGNvbnN0IG5ld0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YCk7XG4gICAgICAgICAgbmV3TGFiZWwudGV4dENvbnRlbnQgPSBzZWN0aW9uLm5hbWU7XG4gICAgICAgICAgbmV3SW5wdXQuY2xhc3NMaXN0LmFkZChcInRleHQtaW5wdXRcIik7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdMYWJlbCk7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdJbnB1dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcImFyZWFcIjoge1xuICAgICAgICAgIGNvbnN0IG5ld0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICAgIG5ld0lucHV0LmlkID0gYGlucHV0LSR7c2VjdGlvbi5uYW1lfWA7XG4gICAgICAgICAgbmV3SW5wdXQucmVxdWlyZWQgPSBzZWN0aW9uLnJlcXVpcmVkO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgc2VjdGlvbi5uYW1lKTtcbiAgICAgICAgICBjb25zdCBuZXdMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgYGlucHV0LSR7c2VjdGlvbi5uYW1lfWApO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZShcInJvd3NcIiwgYDRgKTtcbiAgICAgICAgICBuZXdMYWJlbC50ZXh0Q29udGVudCA9IHNlY3Rpb24ubmFtZTtcbiAgICAgICAgICBuZXdJbnB1dC5jbGFzc0xpc3QuYWRkKFwidGV4dC1pbnB1dFwiKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0xhYmVsKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0lucHV0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdkYXRlJzoge1xuICAgICAgICAgIGNvbnN0IG5ld0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgIG5ld0lucHV0LmlkID0gYGlucHV0LSR7c2VjdGlvbi5uYW1lfWA7XG4gICAgICAgICAgbmV3SW5wdXQucmVxdWlyZWQgPSBzZWN0aW9uLnJlcXVpcmVkO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJkYXRlXCIpO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgc2VjdGlvbi5uYW1lKTtcbiAgICAgICAgICBjb25zdCBuZXdMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgYGlucHV0LSR7c2VjdGlvbi5uYW1lfWApO1xuICAgICAgICAgIG5ld0xhYmVsLnRleHRDb250ZW50ID0gc2VjdGlvbi5uYW1lO1xuICAgICAgICAgIG5ld0lucHV0LmNsYXNzTGlzdC5hZGQoXCJkYXRlLWlucHV0XCIpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3TGFiZWwpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3SW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJzZWxlY3RcIjoge1xuICAgICAgICAgIGNvbnN0IG5ld0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBgaW5wdXQtJHtzZWN0aW9uLm5hbWV9YCk7XG4gICAgICAgICAgbmV3TGFiZWwudGV4dENvbnRlbnQgPSBzZWN0aW9uLm5hbWU7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdMYWJlbCk7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0U3ViID0gcHViU3ViLnN1YnNjcmliZSgncmVjZWl2ZVNlbGVjdCcsKHNlbGVjdEJveCkgPT4ge1xuICAgICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChzZWxlY3RCb3gpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3NlbmRMaXN0Jyk7XG4gICAgICAgICAgc2VsZWN0U3ViLnJlbW92ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSlcbiAgfTtcbiAgY29uc3QgbWFrZU1vZGFsU3ViID0gcHViU3ViLnN1YnNjcmliZSgnbWFrZU1vZGFsJywgbWFrZU1vZGFsKTtcbn0pKCk7XG5cbmNvbnN0IHNpZGVCYXIgPSAoKCkgPT4ge1xuXG4gIGNvbnN0IHNpZGVCYXJCdXR0b24gPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyJyk7XG4gICAgaGVhZGVyLmlkID0gJ2hlYWRlcic7XG4gICAgYm9keS5pbnNlcnRCZWZvcmUoaGVhZGVyLCBjb250ZW50KTtcbiAgICBjb25zdCBuZXdUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5ld1RpdGxlLnRleHRDb250ZW50ID0gJ1RvLURvcydcbiAgICBuZXdUaXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJQcm9qZWN0c1wiO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoXCJzaWRlYmFyLXRpdGxlXCIpO1xuICAgIGhlYWRlci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKG5ld1RpdGxlKVxuICAgIGNvbnN0IHNpZGViYXIgPSBpbml0aWFsaXNlU2lkZUJhcigpOyAgXG4gICAgY29uc29sZS5sb2coJ1NpZGViYXI6ICcgLCBzaWRlYmFyKTtcbiAgICB0aXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNpZGViYXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4Jyk7XG4gICAgIFxuICB9XG5cbiAgY29uc3QgaGlkZVNpZGViYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyJyk7XG4gICAgc2lkZWJhci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgY29uc3QgaW5pdGlhbGlzZVNpZGVCYXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuICAgIGNvbnN0IHNpZGViYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xuICAgIHNpZGViYXIuaWQgPSBcInNpZGViYXJcIjtcbiAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoJ21lbnUnKTtcbiAgICBjb25zdCBzaWRlYmFyQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNpZGViYXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QtbGlzdCcpO1xuICAgIHNpZGViYXIuYXBwZW5kQ2hpbGQoc2lkZWJhckNvbnRlbnQpO1xuICAgIG1ha2VTaWRlQmFyU3ViLnJlbW92ZSgpO1xuICAgIGNvbnN0IG5ld0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld0J1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXctYnV0dG9uJyk7XG4gICAgbmV3QnV0dG9uLnRleHRDb250ZW50ID0gJ25ldyBwcm9qZWN0JztcbiAgICBjb25zdCBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uLWNvbnRhaW5lcicpO1xuICAgIHNpZGViYXIuYXBwZW5kQ2hpbGQobmV3Q29udGFpbmVyKTtcbiAgICBuZXdDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3QnV0dG9uKTtcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlkZVNpZGViYXIpO1xuICAgIGNsb3NlQnV0dG9uLnRleHRDb250ZW50ID0gJ2Nsb3NlJ1xuICAgIG5ld0NvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG4gICAgbmV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKSA9PiB7cHViU3ViLnB1Ymxpc2goJ21ha2VQcm9qZWN0Jyl9KTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHNpZGViYXIpO1xuICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICByZXR1cm4gc2lkZWJhcjtcbiAgfTtcblxuICBjb25zdCByZW1vdmVQcm9qZWN0ID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBsaXN0LSR7cHJvamVjdC5uYW1lLnJlcGxhY2UoL1xccy9nLCcnKX1gKTtcbiAgICBwcm9qZWN0RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHByb2plY3RFbGVtZW50KTtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3RNZW51ID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgY29uc3QgbWVudVBhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIG1lbnVQYW4uY2xhc3NMaXN0LmFkZCgnbWVudScpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtZW51UGFuKTtcbiAgICBjb25zdCBzaG93QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2hvd0J1dHRvbi5pZCA9ICdtZW51LXNob3cnO1xuICAgIHNob3dCdXR0b24udGV4dENvbnRlbnQgPSAnc2hvdyc7XG4gICAgc2hvd0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBwdWJTdWIucHVibGlzaCgncHVibGlzaExpc3QnLHByb2plY3QpO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2hpZGVCYXInKTtcbiAgICB9KTtcbiAgICBjb25zdCBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkZWxldGVCdXR0b24uaWQgPSAnbWVudS1kZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdkZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBkZWxldGVDb25maXJtKHByb2plY3QpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnO1xuICAgIGNhbmNlbEJ1dHRvbi5pZCA9ICdtZW51LWNhbmNlbCc7ICAgIFxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaGlkZUJhcicpO1xuICAgIH0pOyAgICBcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKHNob3dCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGNhbmNlbEJ1dHRvbik7XG4gICAgbWVudVBhbi5zaG93TW9kYWwoKTtcbiAgfVxuXG4gIGNvbnN0IGRlbGV0ZUNvbmZpcm0gPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgICBjb25zdCBjb25maXJtTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnbWVudScpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjb25maXJtTWVzc2FnZSk7XG4gICAgZGlhbG9nLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmZpcm1CdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW5jZWxCdXR0b24pO1xuICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdjb25maXJtLW1lc3NhZ2UnKTtcbiAgICBkaWFsb2cuc2hvdygpO1xuICAgIGNvbmZpcm1NZXNzYWdlLnRleHRDb250ZW50ID0gICdkZWxldGUgcHJvamVjdD8nO1xuICAgIGNvbmZpcm1CdXR0b24udGV4dENvbnRlbnQgPSAnb2snO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnO1xuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgZGlhbG9nLmlubmVySFRNTCA9ICcnO1xuICAgICAgZGlhbG9nLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZGlhbG9nKTtcbiAgICB9KTtcbiAgICBjb25maXJtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2RlbGV0ZUxpc3QnLHByb2plY3QpO1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICBkaWFsb2cuaW5uZXJIVE1MID0gJyc7XG4gICAgICBkaWFsb2cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChkaWFsb2cpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2cocHJvamVjdCk7XG5cbiAgfVxuXG4gIGNvbnN0IGFkZFRvU2lkZUJhciA9IChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0LWxpc3QnKTtcbiAgICBjb25zdCBwcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJwcm9qZWN0LWJ1dHRvblwiKTtcbiAgICBwcm9qZWN0QnV0dG9uLmlkID0gYGxpc3QtJHtwcm9qZWN0Lm5hbWUucmVwbGFjZSgvXFxzL2csJycpfWA7XG4gICAgcHJvamVjdEJ1dHRvbi50ZXh0Q29udGVudCA9IHByb2plY3QubmFtZTtcbiAgICBzaWRlYmFyLmFwcGVuZENoaWxkKHByb2plY3RCdXR0b24pO1xuICAgIHByb2plY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpID0+IHtcbiAgICAgIHByb2plY3RNZW51KHByb2plY3QpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCJBZGRlZCBwcm9qZWN0OiBcIixwcm9qZWN0Lm5hbWUpO1xuICB9O1xuICBjb25zdCBoaWRlU2lkZUJhclN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2hpZGVCYXInLCBoaWRlU2lkZWJhcik7XG4gIGNvbnN0IHJlbW92ZVByb2plY3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdkZWxldGVMaXN0JywgcmVtb3ZlUHJvamVjdCk7XG4gIGNvbnN0IG1ha2VTaWRlQmFyU3ViID0gcHViU3ViLnN1YnNjcmliZSgnbWFrZVNpZGVCYXInLCBzaWRlQmFyQnV0dG9uKTtcbiAgY29uc3QgYWRkU2lkZUJhclN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoXCJhZGRQcm9qZWN0XCIsIGFkZFRvU2lkZUJhcik7XG59KSgpO1xuXG5leHBvcnQgeyBzY3JlZW5Db250cm9sbGVyLCBzaWRlQmFyIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=