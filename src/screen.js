
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
    pubSub.publish('itemMenu',clickedList);
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
      pubSub.publish('itemDone',item);
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
      pubSub.publish('itemEdit',item)}
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
      pubSub.publish('itemDelete',item);
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
    selectBox.setAttribute("name", "listName");
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
    newButton.addEventListener('click',() => {pubSub.publish('makeProject')});
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
      pubSub.publish('publishList',project);
      pubSub.publish('hideBar');
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
      pubSub.publish('hideBar');
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
      pubSub.publish('deleteList',project);
      dialog.close();
      dialog.innerHTML = '';
      dialog.parentElement.removeChild(dialog);
      pubSub.publish('hideBar');
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
  const hideSideBarSub = pubSub.subscribe('hideBar', hideSidebar);
  const removeProjectSub = pubSub.subscribe('deleteList', removeProject);
  const makeSideBarSub = pubSub.subscribe('makeSideBar', sideBarButton);
  const addSideBarSubscription = pubSub.subscribe("addProject", addToSideBar);
})();

export { screenController, sideBar };
