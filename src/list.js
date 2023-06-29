import pubSub from "./pubsub";

const toDoList = (() => {

    const Item = (name, description, listName) => {
        let itemIndex = 0;
    
        const remove = () => {
            list.splice(index,1);
            console.log(name + ' removed from list');
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
            listName,
            remove,
        }
    }
    
    
    const newItem = (input) => {
        pubSub.publish('addToList', Item(input.name, input.description, input.listName));
    }
    
    const newItemSubscription = pubSub.subscribe('newItem',newItem);
    console.log('To Do List Initialised');
    console.table(pubSub.subscriptions);
})();

const lists = (() => {

    const projectList = {};

    const Project = (name, index) => {
        const projectContents = [];
        const addEntry = (entry) => {
            entry.index = projectContents.length;
            projectContents.push(entry);
            pubSub.publish('updateList',projectContents);
        }
        return {
            name,
            index,
            addEntry
        }
    }

    const addItemToList = (input) => {
        if (!projectList.hasOwnProperty(input.listName)) {
            throw Error('No such list exists')
        }
        projectList[input.listName].addEntry(input);
    }

    const newProject = (input) => {
        const newEntry = Project(input.name,projectList.length);
        projectList[newEntry.name] = newEntry;
        // pubSub.publish('addProject', newEntry);
    }
    newProject({name: 'default'});
    const addEntrySubscription = pubSub.subscribe('addToList', addItemToList);
})();

export {
    toDoList,
    lists
};