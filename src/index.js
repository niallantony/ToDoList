import pubSub from "./pubsub.js";
import {toDoList, lists} from "./list.js";
import { screenController, sideBar } from "./screen.js";
import './style.css';

const initialLoad = (() => {
    console.table(pubSub.subscriptions);
})();



export default initialLoad;