type AmbiguousObject = Record<string, any>;

type NullableValue<V> = V | null;

type NullableObject<T> = {
    [K in keyof T]: NullableValue<T[K]>;
};

export type GenericStateStore<V> = {
    [K in keyof V]: V[K] | null;
};

export type StateSlice = {
    [key: string]: unknown;
};

export type CombinedState = NullableObject<StateSlice>;

export interface BaseReducerAction {
    type: string;
    payload?: StateSlice;
}

export type GenericReducerAction<T> = {
    type: string;
    payload?: T;
};

export type GenericReducerFunc<S = StateSlice, A = BaseReducerAction> = (state: S, action: A) => S;

export type StateSliceReducerFunc = (state: StateSlice, action: BaseReducerAction) => StateSlice;

export type GenericStateSliceReducer<S = StateSlice, A = BaseReducerAction> = [GenericReducerFunc<S, A>, S];

export interface StateSliceReducer {
    [key: string]: GenericStateSliceReducer;
}

export type CombinedStateSliceReducer = [GenericReducerFunc, CombinedState];

export interface FinalReducers {
    [key: string]: GenericReducerFunc;
}
