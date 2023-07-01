import { doc } from "prettier";
import pubSub from "./pubsub";

const screenController = (() => {
  const updateScreen = (content) => {
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(content);
  };
  

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
    pubSub.publish("sendQueries");
    const selectBox = newForm.querySelector('select');
    selectBox.setAttribute('selected',forList);
    const submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit');
    submitButton.textContent = 'Add Task';
    newForm.appendChild(submitButton);
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
        pubSub.publish('newItem',formData);
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
    makeSideBarSub.remove();
  };

  const addToSideBar = (project) => {
    const sidebar = document.getElementById('sidebar');
    const projectButton = document.createElement("button");
    projectButton.classList.add("project-button");
    projectButton.textContent = project.name;
    sidebar.appendChild(projectButton);
  };

  const makeSideBarSub = pubSub.subscribe('makeSideBar', initialiseSideBar);
  const addSideBarSubscription = pubSub.subscribe("addProject", addToSideBar);
})();

export { screenController, sideBar };
