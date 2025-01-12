import combineReducers, { type CombineReducers } from '@saurookkadookk/react-utils-combine-reducers';

import {
    ADD_TODO_ITEMS,
    CLEAR_TODO_ITEMS,
    REMOVE_TODO_ITEMS,
} from "@src/constants";

type TodoStateSlice = {
    todoItems: string[];
}

type TodoItemsAction = CombineReducers.ReducerAction<{ todoItem?: TodoStateSlice['todoItems'][0] }>

type CombinedTodoStateSlice = {
    todoItems: CombineReducers.ArgsTuple<TodoStateSlice['todoItems'], TodoItemsAction>;
}

const defaultTodoItemsStateSlice: string[] = [];

const todoItems: CombinedTodoStateSlice['todoItems'] = [
    (stateSlice, action) => {
        switch (action.type) {
            case ADD_TODO_ITEMS:
                stateSlice.push(action.payload.todoItem);
                return stateSlice;
            // return [...stateSlice, action.payload];
            case REMOVE_TODO_ITEMS:
                stateSlice.pop();
                return stateSlice;
            // return [...stateSlice.slice(0, -1)];
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
