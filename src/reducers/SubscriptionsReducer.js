const INITIAL_STATE = { subscriptions : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getSubscriptions':{
            return {
                subscriptions        : action.payload.data,
                loader               : action.payload.key === 1 ? false : true
            };
        }

        default:
            return state;
    }
};
