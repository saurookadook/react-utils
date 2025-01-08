import { Dispatch, createContext } from 'react';

// import { StateSlice, BaseReducerAction } from '@nlpssa-app-types/common/main';

export const AppStateContext = createContext({});
// TODO: Fix any type
export const AppDispatchContext = createContext<Dispatch<any>>((action) => action);
