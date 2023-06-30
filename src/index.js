import pubSub from "./pubsub.js";
import {toDoList, lists} from "./list.js";
import { screenController, sideBar } from "./screen.js";
import './style.css';

const initialLoad = (() => {
    console.table(pubSub.subscriptions);
    pubSub.publish('initialise');
    pubSub.publish('makeSideBar');
    pubSub.publish('newProject',({name:'default'}))
    const projectsFirstLoad = pubSub.subscribe('receiveList',(list) => {pubSub.publish('firstProjectRequest',list)});
    pubSub.publish('sendList');
    projectsFirstLoad.remove();
})();



export default initialLoad;