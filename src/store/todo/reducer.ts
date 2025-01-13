import combineReducers, { type CombineReducers } from '@saurookkadookk/react-utils-combine-reducers';

import {
    ADD_TODO_ITEMS,
    CLEAR_TODO_ITEMS,
    REMOVE_TODO_ITEMS,
} from "@src/constants";

export type TodoStateSlice = {
    todoItems: string[];
}

type TodoItemsAction = CombineReducers.ReducerAction<
    {
        todoItem?: TodoStateSlice['todoItems'][0],
        todoItemIndex?: number
    }
>

type CombinedTodoStateSlice = {
    todoItems: CombineReducers.ArgsTuple<TodoStateSlice['todoItems'], TodoItemsAction>;
}

const defaultTodoItemsStateSlice: string[] = [];

const todoItems: CombinedTodoStateSlice['todoItems'] = [
    (stateSlice, action) => {
        switch (action.type) {
            case ADD_TODO_ITEMS:
                return [...stateSlice, action.payload.todoItem];
            case REMOVE_TODO_ITEMS:
                // TODO: I feel like this SHOULD work...
                // stateSlice.splice(action.payload.todoItemIndex, 1);
                // return stateSlice;
                return [
                    ...stateSlice.slice(0, action.payload.todoItemIndex + 1),
                    ...stateSlice.slice(action.payload.todoItemIndex + 2),
                ];
            case CLEAR_TODO_ITEMS:
                return [];
            default:
                return stateSlice;
        }
    },
    defaultTodoItemsStateSlice,
];

export const initialTodoStateSlice = {
    todoItems: defaultTodoItemsStateSlice,
};

export default combineReducers({
    todoItems,
});
