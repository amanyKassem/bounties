const INITIAL_STATE = { bookPackage : null, status : true , key:0 };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case 'getBookPackage':{
            return {
                bookPackage        : action.payload.data,
                status               : action.payload.key === 2,
                key               : action.payload.key ,
            };
        }

        default:
            return state;
    }
};
