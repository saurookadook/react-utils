import type { CombineReducers } from './index.d';

// type FinalReducersFuncMap_PREFERRABLE<T> = {
//     [K in keyof T as string]: CombineReducers.ReducerFunc<T[K]>;
// }

type GlobalState<S> = {
    [key: string]: CombineReducers.StateSlice<S>;
}

type FinalReducersFuncMap<S> = {
    [key: string]: CombineReducers.ReducerFunc<S>;
}

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
function combineReducers<S extends CombineReducers.AmbiguousObject>(reducers: CombineReducers.ReducersArg<S>): CombineReducers.ReturnType<S> {
    const reducerKeys = Object.keys(reducers);
    const globalState = {} as GlobalState<S>;
    const finalReducers = {} as FinalReducersFuncMap<S>;

    reducerKeys.forEach((key) => {
        if (!(key in reducers)) {
            return;
        }

        const [reducerFunction, reducerInitialState] = reducers[key];
        if (typeof reducerFunction !== 'function') {
            throw new TypeError(`in 'combineReducers' - reducer for ${key} must be a function!`);
        } else {
            // TODO - I'm not sure why this is throwing an error about `S[string]` possibly being instantiated with a different subtype of `any`
            // @ts-ignore
            finalReducers[key] = reducerFunction;
        }
        globalState[key] = reducerInitialState;
    });
    const finalReducerKeys = Object.keys(finalReducers);

    return [
        // @ts-expect-error: TODO - need to find a way to correctly either infer the types of this function or cast them from the type parameter arg
        (state, action) => {
            const newState = {} as CombineReducers.AmbiguousObject;
            let newStateForCurrentKey = {};
            let hasStateChanged = false;

            reducerKeys.forEach((key) => {
                const currentReducer = finalReducers[key];
                const previousStateForKey = typeof state === 'object' && state != null ? state[key] : {};

                try {
                    newStateForCurrentKey = currentReducer(previousStateForKey, action);
                } catch (e) {
                    console.error(
                        `combineReducers: encountered error running reducer function for key: '${key}' and action: '${action.type}'`,
                        e,
                    );
                    newStateForCurrentKey = previousStateForKey;
                }

                newState[key] = newStateForCurrentKey;
                hasStateChanged = hasStateChanged || newStateForCurrentKey !== previousStateForKey;
            });

            hasStateChanged = hasStateChanged || finalReducerKeys.length !== Object.keys(state).length;
            return hasStateChanged ? newState : state;
        },
        // @ts-expect-error: TODO - need to find a way to correctly either infer the types of this or cast them from the type parameter arg
        globalState,
    ];
}

export { CombineReducers };
export default combineReducers;
