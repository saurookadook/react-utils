import * as React from 'react';
import { useReducer } from 'react';

import { AppStateContext, AppDispatchContext } from '@src/store/contexts';
import combinedReducer from '@src/store/reducer';
import { deeplyMerge } from '@src/utils';

function AppStateProvider({
    children,
    initialState = {},
}: {
    children: React.ReactElement;
    initialState?: any;
}) {
    const [combinedReducerFunc, combinedInitialState] = combinedReducer;

    const recursivelyMergedInitialState = deeplyMerge(combinedInitialState, initialState);
    const [state, dispatch] = useReducer(combinedReducerFunc, recursivelyMergedInitialState);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

export default AppStateProvider;
