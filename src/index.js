import pubSub from "./pubsub.js";
import {toDoList, lists, storage} from "./list.js";
import { screenController, sideBar } from "./screen.js";
import './style.css';

const initialLoad = (() => {
    console.table(pubSub.subscriptions);
    pubSub.publish('initialise');
    pubSub.publish('makeSideBar');
    pubSub.publish('pullFromStorage');
    const projectsFirstLoad = pubSub.subscribe('receiveList',(list) => {
        if (Object.keys(list).length === 0) pubSub.publish('newProject',({name:'default'}));
        pubSub.publish('firstProjectRequest',list);
    });
    pubSub.publish('sendList');
    projectsFirstLoad.remove();
})();



export default initialLoad;