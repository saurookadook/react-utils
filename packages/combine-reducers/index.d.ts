
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: Andy Maskiell <https://waitwut.xyz>

// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.

import type { Reducer } from 'react';

export = CombineReducers;

declare function CombineReducers<S>(reducers: CombineReducers.ReducersArg<S>): CombineReducers.ReturnType<S>;

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block. Often you will want to describe the
 *~ shape of the return type of the function; that type should
 *~ be declared in here, as this example shows.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace CombineReducers {
    export type AmbiguousObject = Record<string, any>;

    export type StateSlice<S> = {
        [K in keyof S]: S[K];
    } | S;

    export type ReducerAction<T> = {
        type: string;
        payload?: T;
    };

    export type ReducerFunc<T> = Reducer<T, ReducerAction<T>>

    export type ArgsTuple<T> = [ReducerFunc<T>, T];

    export type ReducersArg<S> = {
        // [Slice in keyof S as string]: [ReducerFunc<S[Slice]>, S[Slice]];
        [key: string]: ArgsTuple<S>;
    }

    export type ReturnType<S> = ArgsTuple<S>;


    // TODO: maybe remove these?
    type NullableValue<V> = V | null;

    type NullableObject<T> = {
        [K in keyof T]: NullableValue<T[K]>;
    };
    // end TODO
}
