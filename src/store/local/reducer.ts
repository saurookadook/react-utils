import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { INCREMENT_COUNTER, DECREMENT_COUNTER, SET_GREETING } from "@src/constants";

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

const defaultGreetingStateSlice = 'Hello, world!';

const greeting = [
    (stateSlice, action) => {
        switch (action.type) {
            case SET_GREETING:
                return action.payload.greeting;
            default:
                return stateSlice;
        }
    },
    defaultGreetingStateSlice,
];

export default combineReducers({
    counter,
    greeting,
});
