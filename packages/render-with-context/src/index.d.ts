// Type definitions for `@saurookkadookk/react-utils-render-with-context` '1.0.0'
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

import type { ReactElement } from 'react';
import { type RenderResult, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export = RenderWithContext;

declare function RenderWithContext<
    C = RenderWithContext.ComponentUnderTest,
    P = RenderWithContext.ProviderRef,
    O = RenderWithContext.OptionsArg,
>(
    component: C,
    ProviderRef: P,
    options?: O,
): RenderWithContext.TypedReturn;

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
declare namespace RenderWithContext {
    export type ComponentUnderTest = ReactElement;
    export type ProviderRef = any; // TODO: should use React.Provider<any>
    export type OptionsArg = RenderOptions & {
        state?: AmbiguousObject;
    };

    // export type AmbiguousObject<V = unknown> = Record<string, V>;
    export type AmbiguousObject = Record<string, any>;

    export type TypedReturn =
        RenderResult & { user: ReturnType<typeof userEvent['setup']> };


    // TODO: maybe remove these?
    type NullableValue<V> = V | null;

    type NullableObject<T> = {
        [K in keyof T]: NullableValue<T[K]>;
    };
    // end TODO
}
