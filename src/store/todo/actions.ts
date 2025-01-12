import { type Dispatch } from "react";

import {
    ADD_TODO_ITEMS,
    CLEAR_TODO_ITEMS,
    REMOVE_TODO_ITEMS,
} from "@src/constants";

export const addTodoItem = ({
    dispatch,
    todoItem,
}: {
    dispatch: Dispatch<any>;
    todoItem: string;
}) => {
    return dispatch({
        type: ADD_TODO_ITEMS,
        payload: { todoItem },
    });
};

export const clearTodoItems = ({
    dispatch,
}: {
    dispatch: Dispatch<any>;
}) => {
    return dispatch({
        type: CLEAR_TODO_ITEMS,
    });
};

export const removeTodoItem = ({
    dispatch,
    targetIndex,
}: {
    dispatch: Dispatch<any>;
    targetIndex: number;
}) => {
    return dispatch({
        type: REMOVE_TODO_ITEMS,
        payload: {
            todoItemIndex: targetIndex,
        },
    });
};
