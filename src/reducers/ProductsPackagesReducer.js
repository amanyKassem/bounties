const INITIAL_STATE = { productsPackages : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getProductsPackages':{
            return {
                productsPackages        : action.payload.data,
                loader               : action.payload.key === 1 ? false : true
            };
        }

        default:
            return state;
    }
};
