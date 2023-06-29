import pubSub from "./pubsub";

const screenController = (() => {
  const updateScreen = (content) => {
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(content);
    newItemButton();
  };

  const newItemButton = () => {
    const body = document.getElementById("content");
    const button = document.createElement("button");
    button.textContent = "New Item";
    body.appendChild(button);
    button.addEventListener("click", () => {
        pubSub.publish('makeModal')
    });
  };

  const initialiseScreen = (() => {
    const body = document.querySelector("body");
    const container = document.createElement("div");
    container.id = "container";
    body.appendChild(container);
    const content = document.createElement("div");
    content.id = "content";
    container.appendChild(content);
    newItemButton();
  })();

  const newListItem = (name, description, list = "default") => {
    const input = { name: name, description: description, listName: list };
    pubSub.publish("newItem", input);
  };

  const updateSubscription = pubSub.subscribe("updateScreen", updateScreen);
})();

const inputModal = (() => {
  const createSelect = (projects) => {
    const selectBox = document.createElement("select");
    selectBox.setAttribute("name", "lists");
    selectBox.id = "select-lists";
    for (const list of Object.keys(projects)) {
      console.table(projects[list]);
      const newOption = document.createElement("option");
      newOption.value = projects[list].index;
      newOption.textContent = projects[list].name;
      selectBox.appendChild(newOption);
    };
    pubSub.publish('receiveSelect', selectBox);
  };

  const makeModal = () => {
    const container = document.getElementById("container");
    const getQueriesSubscription = pubSub.subscribe(
      "receiveQueries",
      makeInputs
    );
    const getProjectSubscription = pubSub.subscribe(
      "receiveList",
      createSelect
    );
    const modal = document.createElement("dialog");
    modal.classList.add("dialog-modal");
    const newForm = document.createElement("form");
    newForm.classList.add("input-form");
    newForm.id = "modal-form";
    container.appendChild(modal);
    modal.appendChild(newForm);
    pubSub.publish("sendQueries");
    modal.showModal();
  };

  const makeInputs = (queries) => {
    const newForm = document.getElementById("modal-form");
    console.log('making inputs')
    queries.forEach((section) => {
      console.log(section.type);
      switch (section.type) {
        case "input": {
            console.log('new input');
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
          console.log('new select');
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
    return sidebar;
  };

  const addToSideBar = (project) => {
    const projectButton = document.createElement("button");
    projectButton.classList.add("project-button");
    projectButton.textContent = project.name;
    sideBar.appendChild(projectButton);
  };

  const sideBar = initialiseSideBar();

  const addSideBarSubscription = pubSub.subscribe("addProject", addToSideBar);
})();

export { screenController, sideBar };
