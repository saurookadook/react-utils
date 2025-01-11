import {
    ADD_TODO_ITEMS,
    CLEAR_TODO_ITEMS,
    REMOVE_TODO_ITEMS,
} from "@src/constants";

export const addTodoItem = ({ dispatch, todoItem }) => {
    return dispatch({
        type: ADD_TODO_ITEMS,
        payload: { todoItem },
    });
};

export const clearTodoItems = ({ dispatch }) => {
    return dispatch({
        type: CLEAR_TODO_ITEMS,
    });
};

export const removeTodoItems = ({ dispatch }) => {
    return dispatch({
        type: REMOVE_TODO_ITEMS,
    });
};
