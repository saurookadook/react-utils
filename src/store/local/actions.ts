import { type Dispatch } from "react";

import { INCREMENT_COUNTER, DECREMENT_COUNTER, SET_GREETING } from "@src/constants";

export const incrementCounter = ({
    dispatch,
}: {
    dispatch: Dispatch<any>;
}) => {
    return dispatch({ type: INCREMENT_COUNTER });
};

export const decrementCounter = ({
    dispatch,
}: {
    dispatch: Dispatch<any>;
}) => {
    return dispatch({ type: DECREMENT_COUNTER });
};

export const updateGreeting = ({
    dispatch,
    greeting,
}: {
    dispatch: Dispatch<any>;
    greeting: string;
}) => {
    return dispatch({
        type: SET_GREETING,
        payload: { greeting },
    });
};
