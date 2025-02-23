# `@saurookkadookk/react-utils-render-with-context`

A testing utility for testing components that are hooked up to [a state provider](https://react.dev/learn/scaling-up-with-reducer-and-context). _(For more details, see [Caveats](#caveats).)_

## Installing

**with `npm`**

```sh
$ npm install @saurookkadookk/react-utils-render-with-context
```

**with `pnpm`**

```sh
$ pnpm add @saurookkadookk/react-utils-render-with-context
```

**with `Yarn`**

```sh
$ yarn add @saurookkadookk/react-utils-render-with-context
```

## Usage

```jsx
import { screen, waitFor } from '@testing-library/react';
import renderWithContext from '@saurookkadookk/react-utils-render-with-context';

import StatefulComponent from 'path/to/components';
import AppStoreProvider from 'path/to/store/AppStateProvider';

describe('StatefulComponent tests', () => {
    beforeAll(() => {
        jest.useFakeTimers({ advanceTimers: true });
    });

    afterEach(() => {
        jest.clearAllTimers();
    })

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should render correctly', async () => {
        renderWithContext(<StatefulComponent />, AppStoreProvider, {
            state: {
                // optional state object to be passed to `initialState` prop of `AppStateProvider`
            }
        });

        await waitFor(() => {
            expect(screen.getByText("Page is ready!")).toBeVisible();
        });

        // rest of test
    });
});

```

### Typing

🚧 **WIP** 🚧

### Caveats

Please note that `renderWithContext` assumes that you have a `Provider` component following the pattern from [React's docs](https://react.dev/learn/scaling-up-with-reducer-and-context#moving-all-wiring-into-a-single-file) and that accepts an `initialState` prop. For example:

```jsx
import React, { useReducer } from 'react';

import {
    AppStateContext,
    AppDispatchContext,
    stateReducer
} from 'path/to/store';

const AppStoreProvider = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
};
```

For more concrete examples, please see [the tests for this package](./src/__tests__/index.test.tsx).
