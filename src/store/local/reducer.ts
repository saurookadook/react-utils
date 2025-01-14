import combineReducers, { type CombineReducers } from '@saurookkadookk/react-utils-combine-reducers';

import { INCREMENT_COUNTER, DECREMENT_COUNTER, SET_GREETING } from "@src/constants";

export type LocalStateSlice = {
    counter: number;
    greeting: string;
}

type CounterAction = CombineReducers.ReducerAction<{ counter?: LocalStateSlice['counter'] }>
type GreetingAction = CombineReducers.ReducerAction<{ greeting?: LocalStateSlice['greeting'] }>

type CombinedLocalStateSlice = {
    counter: CombineReducers.ArgsTuple<LocalStateSlice['counter'], CounterAction>;
    greeting: CombineReducers.ArgsTuple<LocalStateSlice['greeting'], GreetingAction>;
}

const defaultCounterStateSlice: LocalStateSlice['counter'] = 0;

const counter: CombinedLocalStateSlice['counter'] = [
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

const defaultGreetingStateSlice: LocalStateSlice['greeting'] = 'Hello, world!';

const greeting: CombinedLocalStateSlice['greeting'] = [
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

export const initialLocalStateSlice = {
    counter: defaultCounterStateSlice,
    greeting: defaultGreetingStateSlice,
};

export default combineReducers({
    counter,
    greeting,
});
