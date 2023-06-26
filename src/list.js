import pubSub from "./pubsub";

const toDoList = (() => {

    const list = [];
    const Item = (name, description, index) => {
        const remove = () => {
            list.splice(index,1);
            console.log(name + ' removed from list');
        }
        
        return {
            name,
            description,
            remove,
        }
    }
    
    
    const newItem = (input) => {
        const newEntry = Item(input.name, input.description, list.length);
        list.push(newEntry);
        pubSub.publish('updateList', list);
    }
    
    const newItemSubscription = pubSub.subscribe('newItem',newItem);
    console.log('To Do List Initialised');
    console.table(pubSub.subscriptions);
})();

export default toDoList;