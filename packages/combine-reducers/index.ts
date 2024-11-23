import type {
    StateSlice,
    CombinedState,
    BaseReducerAction,
    StateSliceReducer,
    CombinedStateSliceReducer,
    FinalReducers,
} from './index.d';

/**
 * @description Utility function for combining individual reducer functions and \
 * their initial state values into an Array with a single, combined reducer function \
 * and a single, combined state.
 *
 * @function combineReducers
 * @param {StateSliceReducer} reducers Map of state slices to their reducer functions
 *      (i.e. feedback: feedbackReducer, question: questionReducer)
 * @returns {CombinedStateSliceReducer} Array with a combinedReducer function and combinedState
 */
function combineReducers<S extends object = StateSlice, A = BaseReducerAction>(reducers: StateSliceReducer<S, A>): CombinedStateSliceReducer<S, A> {
    const reducerKeys = Object.keys(reducers);
    const globalState: CombinedState = {};
    const finalReducers: FinalReducers<S, A> = {};

    reducerKeys.forEach((key) => {
        const [reducerFunction, reducerInitialState] = reducers[key];
        if (typeof reducerFunction !== 'function') {
            throw new TypeError(`in 'combineReducers' - reducer for ${key} must be a function!`);
        } else {
            finalReducers[key] = reducerFunction;
        }
        globalState[key] = reducerInitialState;
    });
    const finalReducerKeys = Object.keys(finalReducers);

    return [
        (state: S, action: A): S => {
            const newState: CombinedState<S> = {};
            let newStateForCurrentKey = {};
            let hasStateChanged = false;

            reducerKeys.forEach((key) => {
                const currentReducer = finalReducers[key];
                const previousStateForKey = typeof state === 'object' && state != null ? state[key] : {};

                try {
                    newStateForCurrentKey = currentReducer(previousStateForKey, action);
                } catch (e) {
                    console.error(
                        // @ts-expect-error: Not sure why the compiler can't resolve `action.type`...
                        `combineReducers: encountered error running reducer function for key: '${key}' and action: '${action.type}'`,
                        e,
                    );
                    newStateForCurrentKey = previousStateForKey;
                }

                newState[key] = newStateForCurrentKey;
                hasStateChanged = hasStateChanged || newStateForCurrentKey !== previousStateForKey;
            });

            hasStateChanged = hasStateChanged || finalReducerKeys.length !== Object.keys(state).length;
            // @ts-expect-error: `hasStateChanged` is preventing the kind of issue with the return value type that the TypeScript compiler is yelling about
            return hasStateChanged ? newState : state;
        },
        globalState,
    ];
}

export default combineReducers;
