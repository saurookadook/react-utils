import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import localReducer from '@src/store/local/reducer';
import todoReducer from '@src/store/todo/reducer';

export default combineReducers({
    local: localReducer,
    todo: todoReducer,
});
