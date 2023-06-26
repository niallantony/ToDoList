import pubSub from "./pubsub.js";
import toDoList from "./list.js";
import './style.css';

const screenController = (() => {

    const initialiseScreen = () => {
        const body = document.querySelector('body');
        const content = document.createElement('div');
        content.id = 'content';
        body.appendChild(content);
        return content;
    }

    const newItemButton = () => {
        const body = document.querySelector('body');
        const button = document.createElement('button');
        button.textContent = 'newItem';
        body.appendChild(button);
        button.addEventListener('click', () => {
            const name = prompt('Name of Item?');
            const description = prompt('Description?');
            newListItem(name,description);
        })
    }
    
    const newListItem = (name,description) => {
        const input = {name: name, description: description};
        pubSub.publish('newItem',input);
    }

    const updateList = (list) => {
        content.innerHTML = '';
        list.forEach((item) => {
            const container = document.createElement('div');
            container.id = item.index;
            container.textContent = `${item.name} : ${item.description}`
            content.appendChild(container);
        })
    }
    const updateListSubscription = pubSub.subscribe('updateList',updateList);
    const content = initialiseScreen();
    newItemButton();

})();

// const toDoList = (() => {

//     const list = [];
//     const Item = (name, description, index) => {
//         const remove = () => {
//             list.splice(index,1);
//             console.log(name + ' removed from list');
//         }
        
//         return {
//             name,
//             description,
//             remove,
//         }
//     }
    
    
//     const newItem = (input) => {
//         const newEntry = Item(input.name, input.description, list.length);
//         list.push(newEntry);
//         pubSub.publish('updateList', list);
//     }
    
//     const newItemSubscription = pubSub.subscribe('newItem',newItem);
//     console.log('To Do List Initialised');
// })();

    console.table(pubSub.subscriptions);

export default screenController;