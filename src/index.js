import pubSub from "./pubsub.js";
import { screenController, sideBar } from "./screen.js";
import {toDoList, lists} from "./list.js";
import './style.css';

const initialLoad = (() => {


    

    const updateList = (list) => {
        const content = document.createElement('div');
        content.classList.add('list');
        list.forEach((item) => {
            const container = document.createElement('div');
            container.id = `item-${item.index}`;
            container.textContent = item.itemContent;
            content.appendChild(container);
        })
        pubSub.publish('updateScreen',content);
    }

    const updateListSubscription = pubSub.subscribe('updateList',updateList);


})();

console.table(pubSub.subscriptions);

export default initialLoad;