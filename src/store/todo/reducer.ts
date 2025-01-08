import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { ADD_TODO_ITEMS, CLEAR_TODO_ITEMS, REMOVE_TODO_ITEMS } from "@src/constants";

const defaultTodoItemsStateSlice: string[] = [];

const todoItems = [
    (stateSlice, action) => {
        switch (action.type) {
            case ADD_TODO_ITEMS:
                stateSlice.push(action.payload);
                return stateSlice;
            // return [...stateSlice, action.payload];
            case REMOVE_TODO_ITEMS:
                stateSlice.pop(action.payload);
                return stateSlice;
            // return [...stateSlice, action.payload];
            case CLEAR_TODO_ITEMS:
                return [];
            default:
                return stateSlice;
        }
    },
    defaultTodoItemsStateSlice,
];

export default combineReducers({
    todoItems,
});
