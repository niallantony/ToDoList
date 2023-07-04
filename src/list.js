import { check } from "prettier";
import pubSub from "./pubsub";

const toDoList = (() => {

    const Item = (name, description, listName, dueDate , itemIndex = 0, done = false) => {
        const dataType = 'todo';

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
            get listName() {
                return listName.replace(/\s/g, "");
            },
            name,
            description,
            dueDate,
            dataType,
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
                name:'listName',
                type:'select',
                required:true,
            },
        ]
        pubSub.publish('receiveQueries',queries);
    }
    
    const changeValues = (input) => {
        pubSub.publish('changedItem', Item(input.name, input.description, input.listName, input.due));
    }

    const newItem = (input) => {
        pubSub.publish('addToList', Item(input.name, input.description, input.listName, input.due));
    }
    const oldItem = (input) => {
        pubSub.publish('readdToList', Item(input.name, input.description, input.listName, input.due, input.index, input.done));
    }
    const changeItemSub = pubSub.subscribe('changeValues',changeValues);
    const sendQueriesSubscription = pubSub.subscribe('sendItemQueries',sendQueries);
    const newItemSubscription = pubSub.subscribe('newItem',newItem);
    const oldItemSubscription = pubSub.subscribe('oldItem',oldItem);
})();

const lists = (() => {

    const projectList = {};

    const deleteList = (project) => {
        project.completeRemoval();
        delete projectList[project.name];
        if (document.getElementById(project.name)) {
            const projectWindow = document.getElementById(project.name).parentElement;
            pubSub.publish('removeList', projectWindow);
        }
    }

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
        closeButton.addEventListener('click', (e) => {pubSub.publish('removeList',content.parentElement)});
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
            pubSub.publish('makeModal',{list:list.name , action:'newItem'})
        });
        content.addEventListener('click',event => pubSub.publish('listClick',event));
        pubSub.publish('updateScreen',content);
    }

    const Project = (name, index) => {
        const dataType = 'project';
        const projectContents = [];
        const addEntry = (entry) => {
            entry.index = projectContents.length;
            projectContents.push(entry);
            pubSub.publish('updateList',{name:name, projectContents:projectContents});
        }
        const readdEntry = (entry) => {
            projectContents[entry.index] = entry;
        }
        const reorganiseList = () => {
            console.log('reorganising', projectContents);
            for (let i = 0 ; i < projectContents.length ; i++) {
                projectContents[i].index = i;
            }
            console.log('reorganised', projectContents);
        }
        const completeRemoval = () => {
            projectContents.forEach((item) => {
                pubSub.publish('deleteEntry',projectContents[item]);
            });
        }
        const populateContents = (contents) => {
            contents.forEach((item) => projectContents.push(item));
        }
        const publishContents = () => {
            reorganiseList();
            pubSub.publish('updateList',{name:name, projectContents:projectContents});
        }
        const doneTask = (task) => {
            const project = projectContents[task];
            project.toggleDone();
            pubSub.publish('storeDone',project);
        }
        const removeItem = (item) => {
            pubSub.publish('deleteEntry',projectContents[item]);
            projectContents.splice(item,1);
        }
        const editTaskStart = (task) => {
            const editTaskEnd = (inputs) => {
                const changeItem = pubSub.subscribe('changedItem',(item) => {
                    if (item.listName != name) {
                        console.log('Changing list...');
                        pubSub.publish('addToList',item);
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
                pubSub.publish('changeValues',inputs);
            }
            const project = projectContents[task];
            const changeTaskSub = pubSub.subscribe('editTaskEnd',editTaskEnd)
            pubSub.publish('makeModal',{list:name, action:'editTaskEnd', assigned:{
                name:project.name,
                description:project.description,
                due:project.dueDate,
                lists:project.listName,
            }});
        }
        return {
            name,
            index,
            dataType,
            populateContents,
            addEntry,
            doneTask,
            publishContents,
            editTaskStart,
            readdEntry,
            removeItem,
            completeRemoval
        }
    }

    const loadFirstProject = (projects) => {
        const firstProject = projects[Object.keys(projects)[0]];
        console.log(projects);
        console.log('First Project = ', firstProject);
        pubSub.publish('publishList',firstProject);
    }

    const sendList = () => {
        pubSub.publish('receiveList',projectList);
    }

    const addItemToList = (input) => {
        if (!projectList.hasOwnProperty(input.listName)) {
            throw Error('No such list exists')
        }
        projectList[input.listName].addEntry(input);
    }
    const readdItemToList = (input) => {
        if (!projectList.hasOwnProperty(input.listName)) {
            console.log('A wild task has been found... ', input.name);
            console.log('Exterminating...');
            pubSub.publish('deleteEntry',input);
            return;
        }
        projectList[input.listName].readdEntry(input);
    }

    const makeProject = () => {
        pubSub.publish('makeModal',{action:'newProject'});
    }

    const sendQueries = () => {
        const queries = [
            {
                name: 'name',
                type: 'input',
                require: true,
            }
        ]
        pubSub.publish('receiveQueries',queries);
    }

    const itemDelete = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.parentElement.id.replace(/\s/g, "");
        const project = projectList[list];
        project.removeItem(itemIndex);
        project.publishContents();
    }

    const itemDone = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.parentElement.id.replace(/\s/g, "");
        const project = projectList[list]
        project.doneTask(+itemIndex);
        project.publishContents();
    }

    const itemEdit = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.parentElement.id.replace(/\s/g, "");
        const project = projectList[list];
        project.editTaskStart(+itemIndex);
        project.publishContents();
    }

    const newProject = (input) => {
        const entries = Object.entries(projectList);
        let exists = false;
        for (let i = 0 ; i < entries.length ; i++) {
            if (input.name.replace(/\s/g,'') === entries[i][0]) {
                pubSub.publish('listExistError');
                console.warn('Existing Project', entries[i]);
                console.log('Aborting...')
                exists = true;
                return;
            }
        }
        console.log('Exists? :', exists);
        if (!exists) {
            const newEntry = Project(input.name,Object.keys(projectList).length);
            const newEntryName = newEntry.name.replace(/\s/g, "");
            projectList[newEntryName] = newEntry;
            console.table(projectList);
            console.log('New Project Made!', newEntry);
            pubSub.publish('addProject', newEntry);
            pubSub.publish('updateProjectList', projectList);
            const data = {};
            data[newEntryName] = newEntry
            pubSub.publish('addToStorage', data);
        }
    }

    const populateProject = (input) => {
        const newEntry = Project(input.name,input.index);
        const newEntryName = newEntry.name.replace(/\s/g, "");
        projectList[newEntryName] = newEntry;
        console.log('Project Populated: ', newEntry);
        pubSub.publish('addProject', newEntry);
        pubSub.publish('updateProjectList', projectList);
    }

    const deleteListSub = pubSub.subscribe('deleteList',deleteList);
    const removeItemSub = pubSub.subscribe('itemDelete',itemDelete);
    const populateProjectSub = pubSub.subscribe('populateProject', populateProject);
    const itemEditSub = pubSub.subscribe('itemEdit', itemEdit);
    const makeProjectSub = pubSub.subscribe('makeProject',makeProject);
    const sendQueriesSubscription = pubSub.subscribe('sendProjectQueries', sendQueries);
    const itemDoneSub = pubSub.subscribe('itemDone',itemDone);
    const newProjectSub = pubSub.subscribe('newProject',newProject);
    const publishListSub = pubSub.subscribe('publishList', list => list.publishContents())
    const updateListSubscription = pubSub.subscribe('updateList',updateList);
    const sendListSubscription = pubSub.subscribe('sendList', sendList);
    const addEntrySubscription = pubSub.subscribe('addToList', addItemToList);
    const readdEntrySubscription = pubSub.subscribe('readdToList', readdItemToList);
    const getProjectsSubscription = pubSub.subscribe('firstProjectRequest',loadFirstProject);

})();

const storage = (() => {

    const keyList = [];

    const checkStorage = () => {
        if (storageAvailable('localStorage')) {
            return true;
        } else {
            console.warn('No storage available.');
            return false;
        }
    }

    const populateKeys = (data) => {
        const keyName = data
        keyList.push(keyName);
        console.log('Populated!');
        console.table(keyList);
    }

    const addToStorage = (data) => {
        if (!checkStorage()) return;
        const keyName = Object.keys(data)[0];
        localStorage.setItem(keyName, JSON.stringify(data[keyName]));
        const returnValue = localStorage.getItem(keyName);
        console.log('Storage: ',returnValue);
        console.log(keyName);
        keyList.push(keyName);
        localStorage.setItem('keyList',keyList);
        console.log('Stored: ');
        console.table(keyList);
    }

    const pullFromStorage = () => {

        const newKeys = localStorage.getItem('keyList');
        if (!newKeys) return;
        const newKeysArray = newKeys.split(',');
        console.table(newKeysArray);
        for (let i = 0 ; i < newKeysArray.length ; i++ ) {
            console.log(newKeysArray[i]);
            const currentElement = JSON.parse(localStorage.getItem(newKeysArray[i]));
            console.log('Found: ',currentElement);
            switch (currentElement.dataType) {
                case 'project' : 
                    console.log('Found project: ', currentElement.name);
                    pubSub.publish('populateProject', currentElement);
                    populateKeys(currentElement.name.replace(/\s/g,''));
                    break;
                case 'todo' :
                    console.log('Found Item: ', currentElement.name);
                    pubSub.publish('oldItem',currentElement);
                    populateKeys([currentElement.listName,currentElement.index].join('_'));
                    break;
                default: 
                    console.log("Why isn't it working?", currentElement.dataType);
                    break;
            }
        }
    }

    const itemRemove = (item) => {
        console.log('Item deleted: ', item);
        const itemIdentifier = [item.listName,item.index].join('_');
        const itemIndex = keyList.indexOf(itemIdentifier);
        localStorage.removeItem(itemIdentifier);
        keyList.splice(itemIndex,1);
        localStorage.setItem('keyList',keyList);
    }

    const itemDone = (item) => {
        console.log(item);
        const itemIdentifier = [item.listName,item.index].join('_');
        console.log('Changing: ', itemIdentifier);
        localStorage.setItem(itemIdentifier,JSON.stringify(item));
    }

    const listRemove = (list) => {
        console.log('List Deleted: ', list.name);
        const itemIndex = keyList.indexOf(list.name);
        localStorage.removeItem(list.name);
        keyList.splice(itemIndex,1);
        localStorage.setItem('keyList',keyList);
    }

    const itemStorage = (item) => {
        const itemIdentifier = [item.listName,item.index].join('_');
        const data = {};
        data[itemIdentifier] = item;
        addToStorage(data);
    }

    //took from Mozilla (I don't know a lot of this yet);
    function storageAvailable(type) {
        let storage;
        try {
          storage = window[type];
          const x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === "QuotaExceededError" ||
              // Firefox
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
    }

    const itemDoneSub = pubSub.subscribe('storeDone',itemDone);
    const listRemoveSub = pubSub.subscribe('deleteList',listRemove);
    const itemRemoveSub = pubSub.subscribe('deleteEntry',itemRemove);
    const changeItemSub = pubSub.subscribe('changedItem', itemStorage);
    const addItemSub = pubSub.subscribe('addToList', itemStorage);
    const addStorageSub = pubSub.subscribe('addToStorage', addToStorage);
    const pullStorageSub = pubSub.subscribe('pullFromStorage',pullFromStorage);

})();

export {
    toDoList,
    lists,
    storage
};