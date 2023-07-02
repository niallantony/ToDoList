import pubSub from "./pubsub";

const toDoList = (() => {

    const Item = (name, description, listName) => {
        let itemIndex = 0;
        let done = false;

        const toggleDone = () => {
            console.log(done);
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
                type:'input',
                required:true,
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
        pubSub.publish('addToList', Item(input.name, input.description, input.lists));
    }
    const sendQueriesSubscription = pubSub.subscribe('sendQueries',sendQueries);
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
        list.projectContents.forEach((item) => {
            const container = document.createElement('div');
            container.id = `item-${item.index}`;
            container.classList.add('todo-item');
            container.textContent = item.itemContent;
            content.appendChild(container);
            if (item.done) {
                container.classList.add('done');
            };
        })
        const button = document.createElement("button");
        button.textContent = "New Item";
        content.appendChild(button);
        button.addEventListener("click", () => {
            pubSub.publish('makeModal',list.name)
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
            // projectContents[task] = [project];
            }
        return {
            name,
            index,
            addEntry,
            doneTask,
            publishContents
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

    const itemDone = (item) => {
        const itemIndex = item.id.substring(5);
        const list = item.parentElement.id;
        console.log(itemIndex);
        const project = projectList[list]
        project.doneTask(+itemIndex);
        project.publishContents();
    }

    const newProject = (input) => {
        const newEntry = Project(input.name,Object.keys(projectList).length);
        projectList[newEntry.name] = newEntry;
        console.table(projectList);
        console.log('New Project Made!', newEntry);
        pubSub.publish('addProject', newEntry);
        pubSub.publish('updateProjectList', projectList);
    }
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