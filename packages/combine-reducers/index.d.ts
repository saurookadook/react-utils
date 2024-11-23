type AmbiguousObject = Record<string, any>;

type NullableValue<V> = V | null;

type NullableObject<T> = {
    [K in keyof T]: NullableValue<T[K]>;
};

export type GenericStateStore<V> = {
    [K in keyof V]: V[K] | null;
};

export type StateSlice = {
    [key: string]: any;
};

export type CombinedState<S = StateSlice> = NullableObject<S> | object;

export interface BaseReducerAction {
    type: string;
    payload?: StateSlice;
}

export type GenericReducerAction<T> = {
    type: string;
    payload?: T;
};

export type StateSliceReducerFunc =
    (stateSlice: StateSlice, action: BaseReducerAction) => StateSlice;

export type GenericReducerFunc<
    S = StateSlice,
    A = BaseReducerAction
> = (stateSlice: S, action: A) => S;


export type GenericStateSliceReducer<
    S = StateSlice,
    A = BaseReducerAction
> = [GenericReducerFunc<S, A>, S];

export interface StateSliceReducer<S, A> {
    [key: string]: GenericStateSliceReducer<S, A>;
}

export type CombinedStateSliceReducer<S, A> = [GenericReducerFunc<S, A>, CombinedState];

export interface FinalReducers<S, A> {
    [key: string]: GenericReducerFunc<S, A>;
}
