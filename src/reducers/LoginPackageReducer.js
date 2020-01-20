const INITIAL_STATE = { loginPackage : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getLoginPackage':
            return { loginPackage: action.payload.data, loader: action.payload.key === 1 ? false : true };
        default:
            return state;
    }
};
