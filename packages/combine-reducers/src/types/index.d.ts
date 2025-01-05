
// Type definitions for `@saurookkadookk/react-utils-combine-reducers` '0.1.0'
// Project: `react-utils` <https://github.com/saurookadook/react-utils>
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
export declare namespace CombineReducers {
    // export type AmbiguousObject<V = unknown> = Record<string, V>;
    export type AmbiguousObject = Record<string, any>;

    export type StateSlice<S> = {
        [K in keyof S]: S[K];
    } | S;

    export type ReducerAction<T> = {
        type: string;
        payload?: T | { [K in keyof T]: T[K] } | any; // TODO: short term fix
    };

    export type ReducerFunc<T, A = ReducerAction<T>> = Reducer<T, A>

    export type ArgsTuple<T, A = ReducerAction<T>> = [ReducerFunc<T, A>, T];

    export type ReducersArg<S> = {
        [Slice in keyof S as string]: [ReducerFunc<S[Slice]>, S[Slice]];
    }

    export type ReturnType<S> = ArgsTuple<S>;


    // TODO: maybe remove these?
    type NullableValue<V> = V | null;

    type NullableObject<T> = {
        [K in keyof T]: NullableValue<T[K]>;
    };
    // end TODO
}
