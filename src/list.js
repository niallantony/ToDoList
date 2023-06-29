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
        pubSub.publish('addToList', Item(input.name, input.description, input.listName));
    }
    const sendQueriesSubscription = pubSub.subscribe('sendQueries',sendQueries);
    const newItemSubscription = pubSub.subscribe('newItem',newItem);
    console.log('To Do List Initialised');
    console.table(pubSub.subscriptions);

})();

const lists = (() => {

    const projectList = {};

    const Project = (name, index) => {
        const projectContents = [];
        const addEntry = (entry) => {
            entry.index = Object.keys(projectList).length;
            projectContents.push(entry);
            pubSub.publish('updateList',projectContents);
        }
        return {
            name,
            index,
            addEntry
        }
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

    const newProject = (input) => {
        const newEntry = Project(input.name,Object.keys(projectList).length);
        projectList[newEntry.name] = newEntry;
        pubSub.publish('addProject', newEntry);
        pubSub.publish('updateProjectList', projectList);
    }
    newProject({name: 'default'});
    const sendListSubscription = pubSub.subscribe('sendList', sendList);
    const addEntrySubscription = pubSub.subscribe('addToList', addItemToList);
})();

export {
    toDoList,
    lists
};