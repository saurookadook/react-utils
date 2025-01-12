import { Dispatch, createContext } from 'react';

// import { StateSlice, BaseReducerAction } from '@nlpssa-app-types/common/main';
import { type AppState, initialAppState } from '@src/store';

export const AppStateContext = createContext<AppState>(initialAppState);
// TODO: Fix any type
export const AppDispatchContext = createContext<Dispatch<any>>((action) => action);
