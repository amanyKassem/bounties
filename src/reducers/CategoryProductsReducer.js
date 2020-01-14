const INITIAL_STATE = { categoryProducts : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'categoryProducts':{
            return ({...state, categoryProducts : action.payload.data, loader : action.payload.key === 1 ? false : true });
        }
        default:
            return state;
    }
};
