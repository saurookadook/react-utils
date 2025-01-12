import { type Dispatch } from "react";

import { SET_GREETING } from "@src/constants";

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
