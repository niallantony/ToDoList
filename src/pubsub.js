const pubSub = (() => {

    const subscriptions = {};
    const hOP = subscriptions.hasOwnProperty;

    const publish = (event,data) => {
        //if topic doesn't exist, do nothing
        if (!hOP.call(subscriptions,event)) {
            return;
        }

        //activate subscribers
        subscriptions[event].forEach((item) => {
            item(data != undefined ? data : {});
        })
    }

    const subscribe = (event, callback) => {
        // error if no function
        if (!callback) {
            throw new Error('callback is missing from subscribe: ' + event);
        }
        // error if not a function
        if (typeof callback !== 'function') {
            throw new Error('callback is not a function from subscribe: ' + event);
        }
        //make event if none exists
        if(!hOP.call(subscriptions,event)) {
            subscriptions[event] = [];
        }
        //push subscriber to event
        const index = subscriptions[event].push(callback) -1;
        //add method to remove
        const remove = () => {
            subscriptions[event].splice(index,1);
        }
        return {remove};
    }


    return {publish, subscribe};
})