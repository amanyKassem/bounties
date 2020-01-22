const INITIAL_STATE = { product: [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'addProduct':{
            return {
                product     : action.payload.data,
                loader      : action.payload.key === 1 ? false : true
            };
        }

        default:
            return state;
    }
};
