import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "@src/constants";

const defaultCounterStateSlice = 0;

const counter = [
    (stateSlice, action) => {
        switch (action.type) {
            case INCREMENT_COUNTER:
                return stateSlice + 1;
            case DECREMENT_COUNTER:
                return stateSlice - 1;
            default:
                return stateSlice;
        }
    },
    defaultCounterStateSlice,
];

export default combineReducers({
    counter,
});
