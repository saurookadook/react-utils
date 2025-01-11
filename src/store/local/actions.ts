import { SET_GREETING } from "@src/constants";

export const updateGreeting = ({ dispatch, greeting }) => {
    return dispatch({
        type: SET_GREETING,
        payload: { greeting },
    });
};
