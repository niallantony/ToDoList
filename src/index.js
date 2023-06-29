import pubSub from "./pubsub.js";
import {toDoList, lists} from "./list.js";
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
        button.textContent = 'New Item';
        body.appendChild(button);
        button.addEventListener('click', () => {
            const name = prompt('Name of Item?');
            const description = prompt('Description?');
            newListItem(name,description);
        })
    }
    
    const newListItem = (name,description,list = 'default') => {
        const input = {name: name, description: description, listName: list};
        pubSub.publish('newItem',input);
    }

    const updateList = (list) => {
        content.innerHTML = '';
        list.forEach((item) => {
            const container = document.createElement('div');
            container.id = item.index;
            container.textContent = item.itemContent;
            content.appendChild(container);
        })
    }
    const updateListSubscription = pubSub.subscribe('updateList',updateList);
    const content = initialiseScreen();
    newItemButton();

})();

console.table(pubSub.subscriptions);

export default screenController;