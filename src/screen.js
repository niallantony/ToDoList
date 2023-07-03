import { doc } from "prettier";
import pubSub from "./pubsub";

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
    pubSub.publish('itemMenu',clickedList);
  }

  const itemMenu = (item) => {
    const menuPan = document.createElement('div');
    menuPan.classList.add('menu');
    item.appendChild(menuPan);
    const doneButton = document.createElement('button');
    doneButton.id = 'menu-done';
    doneButton.textContent = 'done';
    doneButton.addEventListener('click',(event) => {
      event.stopPropagation();
      pubSub.publish('itemDone',event.target.parentElement.parentElement);
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
    });
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.id = 'menu-edit';    
    editButton.addEventListener('click',() => pubSub.publish('itemEdit',item));
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'cancel';
    cancelButton.id = 'cancel-edit';    
    cancelButton.addEventListener('click',(event) => {
      event.stopPropagation();
      menuPan.innerHTML = '';
      menuPan.parentElement.removeChild(menuPan);
    });
    menuPan.appendChild(doneButton);
    menuPan.appendChild(editButton);
    menuPan.appendChild(cancelButton);
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
      pubSub.publish('makeProject');
      dialog.close();
      dialog.innerHTML = '';
      dialog.parentElement.removeChild(dialog);
    });
  }
    
  
  const listExistSub = pubSub.subscribe('listExistError',listExistError);
  const removeListSub = pubSub.subscribe('removeList',removeList);
  const itemMenuSub = pubSub.subscribe('itemMenu', itemMenu);
  const listClickSub = pubSub.subscribe('listClick', listClick);
  const updateSubscription = pubSub.subscribe("updateScreen", updateScreen);
  const initialiseSub = pubSub.subscribe('initialise',initialiseScreen);
})();

const inputModal = (() => {
  const createSelect = (projects) => {
    const selectBox = document.createElement("select");
    selectBox.setAttribute("name", "lists");
    selectBox.id = "select-lists";
    for (const list of Object.keys(projects)) {
      const newOption = document.createElement("option");
      newOption.value = projects[list].name;
      newOption.textContent = projects[list].name;
      selectBox.appendChild(newOption);
    };
    pubSub.publish('receiveSelect', selectBox);
  };

  const makeModal = (forList) => {
    const modal = document.getElementById('form-modal');
    const getQueriesSubscription = pubSub.subscribe(
      "receiveQueries",
      makeInputs
    );
    const getProjectSubscription = pubSub.subscribe(
      "receiveList",
      createSelect
    );
    const newForm = document.createElement("form");
    newForm.classList.add("input-form");
    newForm.id = "modal-form";
    modal.appendChild(newForm);
    switch (forList.action) {
      case 'newItem' :
        pubSub.publish("sendItemQueries");
        break;
      case 'editTaskEnd' :
        pubSub.publish("sendItemQueries");
        break;
      case 'newProject' :
        pubSub.publish('sendProjectQueries');
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
        pubSub.publish(forList.action,formData);
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
          const selectSub = pubSub.subscribe('receiveSelect',(selectBox) => {
            newForm.appendChild(selectBox);
          })
          pubSub.publish('sendList');
          selectSub.remove();
          break;
        }
        default:
          break;
      }
    })
  };
  const makeModalSub = pubSub.subscribe('makeModal', makeModal);
})();

const sideBar = (() => {
  const initialiseSideBar = () => {
    const body = document.getElementById("container");
    const sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    body.appendChild(sidebar);
    const title = document.createElement("div");
    title.textContent = "Projects";
    title.classList.add("sidebar-title");
    sidebar.appendChild(title);
    const sidebarContent = document.createElement('div');
    sidebarContent.classList.add('project-list');
    sidebar.appendChild(sidebarContent);
    makeSideBarSub.remove();
    const newButton = document.createElement('button');
    newButton.classList.add('new-button');
    newButton.textContent = 'new project';
    sidebar.appendChild(newButton);
    newButton.addEventListener('click',() => {pubSub.publish('makeProject')});
  };

  const addToSideBar = (project) => {
    const sidebar = document.querySelector('.project-list');
    const projectButton = document.createElement("button");
    projectButton.classList.add("project-button");
    projectButton.textContent = project.name;
    projectButton.addEventListener('click',() => {
      pubSub.publish('publishList',project);
    })
    sidebar.appendChild(projectButton);
  };

  const makeSideBarSub = pubSub.subscribe('makeSideBar', initialiseSideBar);
  const addSideBarSubscription = pubSub.subscribe("addProject", addToSideBar);
})();

export { screenController, sideBar };
