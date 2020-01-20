const INITIAL_STATE = { bankAcoounts : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getBankAcoounts':{
            return {
                bankAcoounts        : action.payload.data,
                loader               : action.payload.key === 1 ? false : true
            };
        }

        default:
            return state;
    }
};
