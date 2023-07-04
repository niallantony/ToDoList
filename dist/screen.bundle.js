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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQSwyREFBMkQsK0JBQStCO0FBQzFGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLE1BQU0sK0NBQU07QUFDWixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBLE1BQU0sK0NBQU07QUFDWixLQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsK0JBQStCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSx5QkFBeUIsK0NBQU07QUFDL0IsMkJBQTJCLCtDQUFNO0FBQ2pDLHlCQUF5QiwrQ0FBTTtBQUMvQixpQ0FBaUMsK0NBQU07QUFDdkMsQ0FBQzs7QUFFb0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvbGlzdC8uL3NyYy9wdWJzdWIuanMiLCJ3ZWJwYWNrOi8vdG9kb2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvbGlzdC8uL3NyYy9zY3JlZW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5cbmNvbnN0IHB1YlN1YiA9KCgpID0+IHtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICBjb25zdCBoT1AgPSBzdWJzY3JpcHRpb25zLmhhc093blByb3BlcnR5O1xuXG4gICAgY29uc3QgcHVibGlzaCA9IChldmVudCxkYXRhKSA9PiB7XG4gICAgICAgIC8vaWYgdG9waWMgZG9lc24ndCBleGlzdCwgZG8gbm90aGluZ1xuICAgICAgICBpZiAoIWhPUC5jYWxsKHN1YnNjcmlwdGlvbnMsZXZlbnQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCArICc6IE5vIHN1Y2ggZXZlbnQsIG9yIG5vIHN1YnNjcmliZXJzIScsIHN1YnNjcmlwdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hY3RpdmF0ZSBzdWJzY3JpYmVyc1xuICAgICAgICBzdWJzY3JpcHRpb25zW2V2ZW50XS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtKGRhdGEgIT0gdW5kZWZpbmVkID8gZGF0YSA6IHt9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdQdWJsaXNoZWQgJyArIGV2ZW50ICsgJyB3aXRoICcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaWJlID0gKGV2ZW50LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAvLyBlcnJvciBpZiBubyBmdW5jdGlvblxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrIGlzIG1pc3NpbmcgZnJvbSBzdWJzY3JpYmU6ICcgKyBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXJyb3IgaWYgbm90IGEgZnVuY3Rpb25cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge2BgXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uIGZyb20gc3Vic2NyaWJlOiAnICsgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vbWFrZSBldmVudCBpZiBub25lIGV4aXN0c1xuICAgICAgICBpZighaE9QLmNhbGwoc3Vic2NyaXB0aW9ucyxldmVudCkpIHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy9wdXNoIHN1YnNjcmliZXIgdG8gZXZlbnRcbiAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRpb25zW2V2ZW50XS5wdXNoKGNhbGxiYWNrKSAtIDE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdOZXcgc3Vic2NyaWJlciB0byBldmVudDogJyArIGV2ZW50ICwgc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgIC8vIGFkZCBtZXRob2QgdG8gcmVtb3ZlXG4gICAgICAgIGNvbnN0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnNbZXZlbnRdLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3JlbW92ZX07XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge3B1Ymxpc2gsIHN1YnNjcmliZSwgc3Vic2NyaXB0aW9uc307XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IHB1YlN1YjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlxuaW1wb3J0IHB1YlN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcblxuY29uc3Qgc2NyZWVuQ29udHJvbGxlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZVNjcmVlbiA9IChjb250ZW50KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xuICAgIGxldCBjb250ZW50RGl2O1xuICAgIGlmICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNvbnRlbnQtJHtjb250ZW50LmlkfWApKSB7XG4gICAgICBjb250ZW50RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNvbnRlbnQtJHtjb250ZW50LmlkfWApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRlbnREaXYuaWQgPSBgY29udGVudC0ke2NvbnRlbnQuaWR9YDtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcbiAgICB9O1xuICAgIGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTGlzdCA9IChsaXN0KSA9PiB7XG4gICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBsaXN0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gIH1cbiAgXG5cbiAgY29uc3QgaW5pdGlhbGlzZVNjcmVlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuaWQgPSBcImNvbnRhaW5lclwiO1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5pZCA9ICdjb250ZW50JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJkaWFsb2ctbW9kYWxcIik7XG4gICAgbW9kYWwuaWQgPSAnZm9ybS1tb2RhbCdcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobW9kYWwpO1xuICAgIGNvbnN0IGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvb3Rlci5jbGFzc0xpc3QuYWRkKCdmb290ZXInKTtcbiAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8YSBocmVmPSdodHRwczovL3d3dy5naXRodWIuY29tL25pYWxsYW50b255Jz4gbWFkZSBieSBOaWFsbCBBbnRvbm55IDwvYT5cIlxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcbiAgfTtcblxuICBjb25zdCBsaXN0Q2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBjbGlja2VkSXRlbSA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubGlzdC1jb250YWluZXInKTtcbiAgICBpZiAoIWNsaWNrZWRJdGVtKSByZXR1cm47XG4gICAgY29uc3QgY2xpY2tlZExpc3QgPSBjbGlja2VkSXRlbS5xdWVyeVNlbGVjdG9yKCcudG9kby1pdGVtJyk7XG4gICAgY29uc29sZS5sb2coY2xpY2tlZEl0ZW0sIGNsaWNrZWRMaXN0KTtcbiAgICBwdWJTdWIucHVibGlzaCgnaXRlbU1lbnUnLGNsaWNrZWRMaXN0KTtcbiAgfVxuXG4gIGNvbnN0IGl0ZW1NZW51ID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgY29uc3QgbWVudVBhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIG1lbnVQYW4uY2xhc3NMaXN0LmFkZCgnbWVudScpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtZW51UGFuKTtcbiAgICBjb25zdCBkb25lQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZG9uZUJ1dHRvbi5pZCA9ICdtZW51LWRvbmUnO1xuICAgIGRvbmVCdXR0b24udGV4dENvbnRlbnQgPSAnZG9uZSc7XG4gICAgZG9uZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdpdGVtRG9uZScsaXRlbSk7XG4gICAgICBtZW51UGFuLmlubmVySFRNTCA9ICcnO1xuICAgICAgbWVudVBhbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKG1lbnVQYW4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBlZGl0QnV0dG9uLnRleHRDb250ZW50ID0gJ2VkaXQnO1xuICAgIGVkaXRCdXR0b24uaWQgPSAnbWVudS1lZGl0JzsgICAgXG4gICAgZWRpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCkgPT4ge1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdpdGVtRWRpdCcsaXRlbSl9XG4gICAgICApO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnO1xuICAgIGNhbmNlbEJ1dHRvbi5pZCA9ICdtZW51LWNhbmNlbCc7ICAgIFxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgfSk7XG4gICAgY29uc3QgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGVsZXRlQnV0dG9uLnRleHRDb250ZW50ID0gJ2RlbGV0ZSc7XG4gICAgZGVsZXRlQnV0dG9uLmlkID0gJ21lbnUtZGVsZXRlJztcbiAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWVudVBhbi5jbG9zZSgpO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2l0ZW1EZWxldGUnLGl0ZW0pO1xuICAgICAgbWVudVBhbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1lbnVQYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChtZW51UGFuKTtcbiAgICB9KVxuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGRvbmVCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoZWRpdEJ1dHRvbik7XG4gICAgbWVudVBhbi5hcHBlbmRDaGlsZChjYW5jZWxCdXR0b24pO1xuICAgIG1lbnVQYW4uc2hvd01vZGFsKCk7XG4gIH1cblxuICBjb25zdCBsaXN0RXhpc3RFcnJvciA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3IgZm91bmQuLi4nKTtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgIGRpYWxvZy5hcHBlbmRDaGlsZChlcnJvck1lc3NhZ2UpO1xuICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjb25maXJtQnV0dG9uKTtcbiAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnZXJyb3ItbWVzc2FnZScpO1xuICAgIGRpYWxvZy5zaG93KCk7XG4gICAgZXJyb3JNZXNzYWdlLnRleHRDb250ZW50ID0gICdsaXN0IGFscmVhZHkgZXhpc3RzISc7XG4gICAgY29uZmlybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdvayc7XG4gICAgY29uZmlybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHB1YlN1Yi5wdWJsaXNoKCdtYWtlUHJvamVjdCcpO1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICBkaWFsb2cuaW5uZXJIVE1MID0gJyc7XG4gICAgICBkaWFsb2cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChkaWFsb2cpO1xuICAgIH0pO1xuICB9XG4gICAgXG4gIFxuICBjb25zdCBsaXN0RXhpc3RTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdsaXN0RXhpc3RFcnJvcicsbGlzdEV4aXN0RXJyb3IpO1xuICBjb25zdCByZW1vdmVMaXN0U3ViID0gcHViU3ViLnN1YnNjcmliZSgncmVtb3ZlTGlzdCcscmVtb3ZlTGlzdCk7XG4gIGNvbnN0IGl0ZW1NZW51U3ViID0gcHViU3ViLnN1YnNjcmliZSgnaXRlbU1lbnUnLCBpdGVtTWVudSk7XG4gIGNvbnN0IGxpc3RDbGlja1N1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2xpc3RDbGljaycsIGxpc3RDbGljayk7XG4gIGNvbnN0IHVwZGF0ZVN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoXCJ1cGRhdGVTY3JlZW5cIiwgdXBkYXRlU2NyZWVuKTtcbiAgY29uc3QgaW5pdGlhbGlzZVN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ2luaXRpYWxpc2UnLGluaXRpYWxpc2VTY3JlZW4pO1xufSkoKTtcblxuY29uc3QgaW5wdXRNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZVNlbGVjdCA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHNlbGVjdEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gICAgc2VsZWN0Qm94LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJsaXN0TmFtZVwiKTtcbiAgICBzZWxlY3RCb3guaWQgPSBcInNlbGVjdC1saXN0c1wiO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBPYmplY3Qua2V5cyhwcm9qZWN0cykpIHtcbiAgICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICBuZXdPcHRpb24udmFsdWUgPSBwcm9qZWN0c1tsaXN0XS5uYW1lO1xuICAgICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gcHJvamVjdHNbbGlzdF0ubmFtZTtcbiAgICAgIHNlbGVjdEJveC5hcHBlbmRDaGlsZChuZXdPcHRpb24pO1xuICAgIH07XG4gICAgcHViU3ViLnB1Ymxpc2goJ3JlY2VpdmVTZWxlY3QnLCBzZWxlY3RCb3gpO1xuICB9O1xuXG4gIGNvbnN0IG1ha2VNb2RhbCA9IChmb3JMaXN0KSA9PiB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1tb2RhbCcpO1xuICAgIGNvbnN0IGdldFF1ZXJpZXNTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKFxuICAgICAgXCJyZWNlaXZlUXVlcmllc1wiLFxuICAgICAgbWFrZUlucHV0c1xuICAgICk7XG4gICAgY29uc3QgZ2V0UHJvamVjdFN1YnNjcmlwdGlvbiA9IHB1YlN1Yi5zdWJzY3JpYmUoXG4gICAgICBcInJlY2VpdmVMaXN0XCIsXG4gICAgICBjcmVhdGVTZWxlY3RcbiAgICApO1xuICAgIGNvbnN0IG5ld0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICBuZXdGb3JtLmNsYXNzTGlzdC5hZGQoXCJpbnB1dC1mb3JtXCIpO1xuICAgIG5ld0Zvcm0uaWQgPSBcIm1vZGFsLWZvcm1cIjtcbiAgICBtb2RhbC5hcHBlbmRDaGlsZChuZXdGb3JtKTtcbiAgICBzd2l0Y2ggKGZvckxpc3QuYWN0aW9uKSB7XG4gICAgICBjYXNlICduZXdJdGVtJyA6XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKFwic2VuZEl0ZW1RdWVyaWVzXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VkaXRUYXNrRW5kJyA6XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKFwic2VuZEl0ZW1RdWVyaWVzXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25ld1Byb2plY3QnIDpcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3NlbmRQcm9qZWN0UXVlcmllcycpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgIH1cbiAgICBpZiAobmV3Rm9ybS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKSkgeyBcbiAgICAgIGNvbnN0IHNlbGVjdGlvbnMgPSBuZXdGb3JtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpLmNoaWxkcmVuO1xuICAgICAgZm9yIChsZXQgaSA9IDAgOyBpIDwgc2VsZWN0aW9ucy5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbnNbaV0udmFsdWUgPT09IGZvckxpc3QubGlzdCkgc2VsZWN0aW9uc1tpXS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmb3JMaXN0Lmhhc093blByb3BlcnR5KCdhc3NpZ25lZCcpKSB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZm9yTGlzdC5hc3NpZ25lZCk7XG4gICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBpbnB1dC0ke2tleX1gKTtcbiAgICAgICAgaWYgKCFmb3JtRWxlbWVudCkgcmV0dXJuO1xuICAgICAgICBmb3JtRWxlbWVudC52YWx1ZSA9IGZvckxpc3QuYXNzaWduZWRba2V5XTtcbiAgICAgIH0pXG4gICAgfVxuICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b24tY29udGFpbmVyJyk7XG4gICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChidXR0b25Db250YWluZXIpO1xuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtb2RhbC1zdWJtaXQnKTtcbiAgICBzdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAnY29uZmlybSc7XG4gICAgc3VibWl0QnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtb2RhbC1jYW5jZWwnKTtcbiAgICBjYW5jZWxCdXR0b24udGV4dENvbnRlbnQgPSAnY2FuY2VsJ1xuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCkgPT4ge1xuICAgICAgZ2V0UHJvamVjdFN1YnNjcmlwdGlvbi5yZW1vdmUoKTtcbiAgICAgIGdldFF1ZXJpZXNTdWJzY3JpcHRpb24ucmVtb3ZlKCk7XG4gICAgICBtb2RhbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHN1Ym1pdEJ1dHRvbik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGNhbmNlbEJ1dHRvbik7XG4gICAgbmV3Rm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsKGUpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSB7fTtcbiAgICAgICAgQXJyYXkuZnJvbShuZXdGb3JtLmVsZW1lbnRzKS5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZm9ybURhdGFbaW5wdXQubmFtZV0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICBtb2RhbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIGdldFByb2plY3RTdWJzY3JpcHRpb24ucmVtb3ZlKCk7XG4gICAgICAgICAgICBnZXRRdWVyaWVzU3Vic2NyaXB0aW9uLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goZm9yTGlzdC5hY3Rpb24sZm9ybURhdGEpO1xuICAgIH0pO1xuICAgIG1vZGFsLnNob3dNb2RhbCgpO1xuICB9O1xuXG4gIGNvbnN0IG1ha2VJbnB1dHMgPSAocXVlcmllcykgPT4ge1xuICAgIGNvbnN0IG5ld0Zvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGFsLWZvcm1cIik7XG4gICAgcXVlcmllcy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XG4gICAgICBzd2l0Y2ggKHNlY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIFwiaW5wdXRcIjoge1xuICAgICAgICAgIGNvbnN0IG5ld0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgIG5ld0lucHV0LmlkID0gYGlucHV0LSR7c2VjdGlvbi5uYW1lfWA7XG4gICAgICAgICAgbmV3SW5wdXQucmVxdWlyZWQgPSBzZWN0aW9uLnJlcXVpcmVkO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgc2VjdGlvbi5uYW1lKTtcbiAgICAgICAgICBjb25zdCBuZXdMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgYGlucHV0LSR7c2VjdGlvbi5uYW1lfWApO1xuICAgICAgICAgIG5ld0xhYmVsLnRleHRDb250ZW50ID0gc2VjdGlvbi5uYW1lO1xuICAgICAgICAgIG5ld0lucHV0LmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWlucHV0XCIpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3TGFiZWwpO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3SW5wdXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJhcmVhXCI6IHtcbiAgICAgICAgICBjb25zdCBuZXdJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgICBuZXdJbnB1dC5pZCA9IGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gO1xuICAgICAgICAgIG5ld0lucHV0LnJlcXVpcmVkID0gc2VjdGlvbi5yZXF1aXJlZDtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIHNlY3Rpb24ubmFtZSk7XG4gICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgbmV3TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJyb3dzXCIsIGA0YCk7XG4gICAgICAgICAgbmV3TGFiZWwudGV4dENvbnRlbnQgPSBzZWN0aW9uLm5hbWU7XG4gICAgICAgICAgbmV3SW5wdXQuY2xhc3NMaXN0LmFkZChcInRleHQtaW5wdXRcIik7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdMYWJlbCk7XG4gICAgICAgICAgbmV3Rm9ybS5hcHBlbmRDaGlsZChuZXdJbnB1dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnZGF0ZSc6IHtcbiAgICAgICAgICBjb25zdCBuZXdJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICBuZXdJbnB1dC5pZCA9IGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gO1xuICAgICAgICAgIG5ld0lucHV0LnJlcXVpcmVkID0gc2VjdGlvbi5yZXF1aXJlZDtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZGF0ZVwiKTtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIHNlY3Rpb24ubmFtZSk7XG4gICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgbmV3TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIGBpbnB1dC0ke3NlY3Rpb24ubmFtZX1gKTtcbiAgICAgICAgICBuZXdMYWJlbC50ZXh0Q29udGVudCA9IHNlY3Rpb24ubmFtZTtcbiAgICAgICAgICBuZXdJbnB1dC5jbGFzc0xpc3QuYWRkKFwiZGF0ZS1pbnB1dFwiKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0xhYmVsKTtcbiAgICAgICAgICBuZXdGb3JtLmFwcGVuZENoaWxkKG5ld0lucHV0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwic2VsZWN0XCI6IHtcbiAgICAgICAgICBjb25zdCBuZXdMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgYGlucHV0LSR7c2VjdGlvbi5uYW1lfWApO1xuICAgICAgICAgIG5ld0xhYmVsLnRleHRDb250ZW50ID0gc2VjdGlvbi5uYW1lO1xuICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQobmV3TGFiZWwpO1xuICAgICAgICAgIGNvbnN0IHNlbGVjdFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ3JlY2VpdmVTZWxlY3QnLChzZWxlY3RCb3gpID0+IHtcbiAgICAgICAgICAgIG5ld0Zvcm0uYXBwZW5kQ2hpbGQoc2VsZWN0Qm94KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdzZW5kTGlzdCcpO1xuICAgICAgICAgIHNlbGVjdFN1Yi5yZW1vdmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pXG4gIH07XG4gIGNvbnN0IG1ha2VNb2RhbFN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ21ha2VNb2RhbCcsIG1ha2VNb2RhbCk7XG59KSgpO1xuXG5jb25zdCBzaWRlQmFyID0gKCgpID0+IHtcblxuICBjb25zdCBzaWRlQmFyQnV0dG9uID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcicpO1xuICAgIGhlYWRlci5pZCA9ICdoZWFkZXInO1xuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKGhlYWRlciwgY29udGVudCk7XG4gICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXdUaXRsZS50ZXh0Q29udGVudCA9ICdUby1Eb3MnXG4gICAgbmV3VGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKVxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiUHJvamVjdHNcIjtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2lkZWJhci10aXRsZVwiKTtcbiAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgIGhlYWRlci5hcHBlbmRDaGlsZChuZXdUaXRsZSlcbiAgICBjb25zdCBzaWRlYmFyID0gaW5pdGlhbGlzZVNpZGVCYXIoKTsgIFxuICAgIGNvbnNvbGUubG9nKCdTaWRlYmFyOiAnICwgc2lkZWJhcik7XG4gICAgdGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzaWRlYmFyLnN0eWxlLmRpc3BsYXkgPSAnZ3JpZCcpO1xuICAgICBcbiAgfVxuXG4gIGNvbnN0IGhpZGVTaWRlYmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhcicpO1xuICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxpc2VTaWRlQmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKTtcbiAgICBjb25zdCBzaWRlYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpYWxvZ1wiKTtcbiAgICBzaWRlYmFyLmlkID0gXCJzaWRlYmFyXCI7XG4gICAgc2lkZWJhci5jbGFzc0xpc3QuYWRkKCdtZW51Jyk7XG4gICAgY29uc3Qgc2lkZWJhckNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzaWRlYmFyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0LWxpc3QnKTtcbiAgICBzaWRlYmFyLmFwcGVuZENoaWxkKHNpZGViYXJDb250ZW50KTtcbiAgICBtYWtlU2lkZUJhclN1Yi5yZW1vdmUoKTtcbiAgICBjb25zdCBuZXdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXdCdXR0b24uY2xhc3NMaXN0LmFkZCgnbmV3LWJ1dHRvbicpO1xuICAgIG5ld0J1dHRvbi50ZXh0Q29udGVudCA9ICduZXcgcHJvamVjdCc7XG4gICAgc2lkZWJhci5hcHBlbmRDaGlsZChuZXdCdXR0b24pO1xuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlU2lkZWJhcik7XG4gICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQgPSAnY2xvc2UnXG4gICAgc2lkZWJhci5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG4gICAgbmV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKSA9PiB7cHViU3ViLnB1Ymxpc2goJ21ha2VQcm9qZWN0Jyl9KTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHNpZGViYXIpO1xuICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICByZXR1cm4gc2lkZWJhcjtcbiAgfTtcblxuICBjb25zdCByZW1vdmVQcm9qZWN0ID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBsaXN0LSR7cHJvamVjdC5uYW1lLnJlcGxhY2UoL1xccy9nLCcnKX1gKTtcbiAgICBwcm9qZWN0RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHByb2plY3RFbGVtZW50KTtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3RNZW51ID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgY29uc3QgbWVudVBhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIG1lbnVQYW4uY2xhc3NMaXN0LmFkZCgnbWVudScpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtZW51UGFuKTtcbiAgICBjb25zdCBzaG93QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2hvd0J1dHRvbi5pZCA9ICdtZW51LXNob3cnO1xuICAgIHNob3dCdXR0b24udGV4dENvbnRlbnQgPSAnc2hvdyc7XG4gICAgc2hvd0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBwdWJTdWIucHVibGlzaCgncHVibGlzaExpc3QnLHByb2plY3QpO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2hpZGVCYXInKTtcbiAgICB9KTtcbiAgICBjb25zdCBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkZWxldGVCdXR0b24uaWQgPSAnbWVudS1kZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdkZWxldGUnO1xuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1lbnVQYW4uY2xvc2UoKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBkZWxldGVDb25maXJtKHByb2plY3QpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnO1xuICAgIGNhbmNlbEJ1dHRvbi5pZCA9ICdtZW51LWNhbmNlbCc7ICAgIFxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnVQYW4uaW5uZXJIVE1MID0gJyc7XG4gICAgICBtZW51UGFuLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQobWVudVBhbik7XG4gICAgICBtZW51UGFuLmNsb3NlKCk7XG4gICAgICBwdWJTdWIucHVibGlzaCgnaGlkZUJhcicpO1xuICAgIH0pOyAgICBcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKHNob3dCdXR0b24pO1xuICAgIG1lbnVQYW4uYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBtZW51UGFuLmFwcGVuZENoaWxkKGNhbmNlbEJ1dHRvbik7XG4gICAgbWVudVBhbi5zaG93TW9kYWwoKTtcbiAgfVxuXG4gIGNvbnN0IGRlbGV0ZUNvbmZpcm0gPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgICBjb25zdCBjb25maXJtTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnbWVudScpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjb25maXJtTWVzc2FnZSk7XG4gICAgZGlhbG9nLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmZpcm1CdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW5jZWxCdXR0b24pO1xuICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdjb25maXJtLW1lc3NhZ2UnKTtcbiAgICBkaWFsb2cuc2hvdygpO1xuICAgIGNvbmZpcm1NZXNzYWdlLnRleHRDb250ZW50ID0gICdkZWxldGUgcHJvamVjdD8nO1xuICAgIGNvbmZpcm1CdXR0b24udGV4dENvbnRlbnQgPSAnb2snO1xuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdjYW5jZWwnO1xuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgZGlhbG9nLmlubmVySFRNTCA9ICcnO1xuICAgICAgZGlhbG9nLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZGlhbG9nKTtcbiAgICB9KTtcbiAgICBjb25maXJtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2RlbGV0ZUxpc3QnLHByb2plY3QpO1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICBkaWFsb2cuaW5uZXJIVE1MID0gJyc7XG4gICAgICBkaWFsb2cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChkaWFsb2cpO1xuICAgICAgcHViU3ViLnB1Ymxpc2goJ2hpZGVCYXInKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKHByb2plY3QpO1xuXG4gIH1cblxuICBjb25zdCBhZGRUb1NpZGVCYXIgPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1saXN0Jyk7XG4gICAgY29uc3QgcHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgcHJvamVjdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwicHJvamVjdC1idXR0b25cIik7XG4gICAgcHJvamVjdEJ1dHRvbi5pZCA9IGBsaXN0LSR7cHJvamVjdC5uYW1lLnJlcGxhY2UoL1xccy9nLCcnKX1gO1xuICAgIHByb2plY3RCdXR0b24udGV4dENvbnRlbnQgPSBwcm9qZWN0Lm5hbWU7XG4gICAgc2lkZWJhci5hcHBlbmRDaGlsZChwcm9qZWN0QnV0dG9uKTtcbiAgICBwcm9qZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKSA9PiB7XG4gICAgICBwcm9qZWN0TWVudShwcm9qZWN0KTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiQWRkZWQgcHJvamVjdDogXCIscHJvamVjdC5uYW1lKTtcbiAgfTtcbiAgY29uc3QgaGlkZVNpZGVCYXJTdWIgPSBwdWJTdWIuc3Vic2NyaWJlKCdoaWRlQmFyJywgaGlkZVNpZGViYXIpO1xuICBjb25zdCByZW1vdmVQcm9qZWN0U3ViID0gcHViU3ViLnN1YnNjcmliZSgnZGVsZXRlTGlzdCcsIHJlbW92ZVByb2plY3QpO1xuICBjb25zdCBtYWtlU2lkZUJhclN1YiA9IHB1YlN1Yi5zdWJzY3JpYmUoJ21ha2VTaWRlQmFyJywgc2lkZUJhckJ1dHRvbik7XG4gIGNvbnN0IGFkZFNpZGVCYXJTdWJzY3JpcHRpb24gPSBwdWJTdWIuc3Vic2NyaWJlKFwiYWRkUHJvamVjdFwiLCBhZGRUb1NpZGVCYXIpO1xufSkoKTtcblxuZXhwb3J0IHsgc2NyZWVuQ29udHJvbGxlciwgc2lkZUJhciB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9