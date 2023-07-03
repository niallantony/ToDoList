import pubSub from "./pubsub";

const toDoList = (() => {

    const Item = (name, description, listName, dueDate) => {
        let itemIndex = 0;
        let done = false;

        const toggleDone = () => {
            done = !done;
            console.log(name + ' Done!', done);
        }
        const changeValues = (inputs) => {
            name = inputs.name;
            description = inputs.description;
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
        pubSub.publish('receiveQueries',queries);
    }
    
    const newItem = (input) => {
        pubSub.publish('addToList', Item(input.name, input.description, input.lists, input.due));
    }
    const sendQueriesSubscription = pubSub.subscribe('sendItemQueries',sendQueries);
    const newItemSubscription = pubSub.subscribe('newItem',newItem);
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
        closeButton.addEventListener('click', (e) => {pubSub.publish('removeList',content.parentElement)});
        list.projectContents.forEach((item) => {
            const listContainer = document.createElement('div');
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
        const projectContents = [];
        const addEntry = (entry) => {
            entry.index = projectContents.length;
            projectContents.push(entry);
            pubSub.publish('updateList',{name:name, projectContents:projectContents});
        }
        const publishContents = () => {
            pubSub.publish('updateList',{name:name, projectContents:projectContents});
        }
        const doneTask = (task) => {
            const project = projectContents[task];
            project.toggleDone();
        }
        const editTaskStart = (task) => {
            const editTaskEnd = (inputs) => {
                project.changeValues(inputs);
                changeTaskSub.remove();
            }
            const project = projectContents[task];
            const changeTaskSub = pubSub.subscribe('editTaskEnd',editTaskEnd)
            pubSub.publish('makeModal',{list:name, action:'editTaskEnd', assigned:{
                name:project.name,
                description:project.description,
                due:project.dueDate,
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
            projectList[newEntry.name] = newEntry;
            console.table(projectList);
            console.log('New Project Made!', newEntry);
            pubSub.publish('addProject', newEntry);
            pubSub.publish('updateProjectList', projectList);
        }
    }

    const itemEditSub = pubSub.subscribe('itemEdit', itemEdit);
    const makeProjectSub = pubSub.subscribe('makeProject',makeProject);
    const sendQueriesSubscription = pubSub.subscribe('sendProjectQueries', sendQueries);
    const itemDoneSub = pubSub.subscribe('itemDone',itemDone);
    const newProjectSub = pubSub.subscribe('newProject',newProject);
    const publishListSub = pubSub.subscribe('publishList', list => list.publishContents())
    const updateListSubscription = pubSub.subscribe('updateList',updateList);
    const sendListSubscription = pubSub.subscribe('sendList', sendList);
    const addEntrySubscription = pubSub.subscribe('addToList', addItemToList);
    const getProjectsSubscription = pubSub.subscribe('firstProjectRequest',loadFirstProject);

})();

export {
    toDoList,
    lists
};