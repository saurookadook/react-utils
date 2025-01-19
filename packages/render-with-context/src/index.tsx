import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { deeplyMerge } from './deeplyMerge';
import type { RenderWithContext } from './index.d';

/**
 * @function renderWithContext
 * @description Utility for rendering stateful components in tests
 *
 * @param {RenderWithContext.ComponentUnderTest} component The component to render
 * @param {RenderWithContext.ProviderRef} ProviderRef
 * @param {RenderWithContext.OptionsArg} options
 *
 * @returns {RenderWithContext.TypedReturn} Returns combined return values of \
 *      Testing Library's `render` and `userEvent.setup` functions.
 */
function renderWithContext(
    component: React.ReactElement,
    ProviderRef: any, // TODO: should use React.Provider<any>,
    {
        state = {}, // force formatting
        ...renderOptions
    }: any = {},
): RenderWithContext.TypedReturn {
    const baseState = deeplyMerge({}, state);
    return {
        ...render(
            <ProviderRef initialState={baseState}>
                {component}
            </ProviderRef>,
            renderOptions,
        ),
        user: userEvent.setup(),
    };
}

export { RenderWithContext };
export default renderWithContext;
