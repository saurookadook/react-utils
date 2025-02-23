import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import localReducer, { type LocalStateSlice, initialLocalStateSlice } from '@src/store/local/reducer';
import todoReducer, { type TodoStateSlice, initialTodoStateSlice } from '@src/store/todo/reducer';

export type AppState = combineReducers.AmbiguousObject & {
    local: LocalStateSlice;
    todo: TodoStateSlice;
}

export const initialAppState = {
    local: initialLocalStateSlice,
    todo: initialTodoStateSlice,
};

export default combineReducers<AppState>({
    local: localReducer,
    todo: todoReducer,
});
