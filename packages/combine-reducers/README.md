# `combineReducers`

A React-hooks friendly utility to combine several reducer functions into a singular reducer function. It is inspired by:

-   [`combineReducers` from Redux](https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts)
-   [`combineReducers` from the `react-combine-reducers` package](https://github.com/ankita1010/react-combine-reducers/blob/master/src/utility.js)

🚧 _WIP_ 🚧

## Installing

**with `npm`**

```sh
$ npm install @saurookkadookk/react-utils-combine-reducers
```

**with `pnpm`**

```sh
$ pnpm add @saurookkadookk/react-utils-combine-reducers
```

**with `Yarn`**

```sh
$ yarn add @saurookkadookk/react-utils-combine-reducers
```

## Rationale

The `combineReducers` utility was born out of a need to keep our reducer functions pure, by which I mean that a reducer
function should only manipulate a single slice of state.

Let's consider the following shape of `state` for a hypothetical application:

```js
const state = {
    flashMessage: {
        flashMessages: []
    },
    local: {
        loading: false,
    },
    toDoItems: [
        {
            id: '8bf3b458-fd7a-4535-8373-29c664aeac43',
            name: 'Take out the garbage'
        },
        {
            id: '656bdc29-c01e-4c34-8778-47b622a03e73',
            name: 'Pet the cats'
        }
    ],
    user: {
        id: '56eae865-446a-4d82-8ebe-88dca6ee4a1e',
        handle: 'the-greatest-cat-dad',
        email: 'greatest-cat-dad@hotmail.com',
    }
}
```

Without the `combineReducers` utility, for example, our reducer function would have to manipulate _all_ of these state
slices:

```js
import {
    SHOW_FLASH_MESSAGE,
    CLEAR_FLASH_MESSAGES,
    IS_LOADING,
    IS_LOADED,
    RECEIVE_TO_DO_ITEMS,
    ADD_TO_DO_ITEM,
    INIT_PAGE
} from 'common/constants';

const defaultState = {
    flashMessage: {
        flashMessages: []
    },
    local: {
        loading: false,
    },
    toDoItems: [],
    user: null,
}

export const applicationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_FLASH_MESSAGE:
            return {
                ...state,
                flashMessage: {
                    ...state.flashMessage,
                    flashMessages: [
                        ...state.flashMessage.flashMessages,
                        ...action.data
                    ]
                }
            };
        case CLEAR_FLASH_MESSAGES:
            return {
                ...state,
                flashMessage: {
                    ...state.flashMessage,
                    flashMessages: [],
                }
            };
        case IS_LOADING:
            return {
                ...state,
                local: {
                    ...state.local,
                    loading: true,
                }
            };
        case IS_LOADED:
            return {
                ...state,
                local: {
                    ...state.local,
                    loading: false,
                }
            };
        case ADD_TO_DO_ITEM:
            return {
                ...state,
                toDos: [...state.toDos, action.data],
            };
        case RECEIVE_TO_DO_ITEMS:
            return {
                ...state,
                toDos: [...action.data],
            };
        case INIT_PAGE:
            return {
                local: {
                    ...action.data.local,
                },
                toDoItems: [
                    ...action.data.toDoItems
                ],
                user: {
                    ...action.data.user
                }
            };
        default:
            return state;
    }
};
```

While this is a relatively small example, you can perhaps imagine how this could be difficult to manage in bigger
applications. 😅

However, the `combineReducers` utility allows us to roll up reducer functions for individual parts of state into a
singular reducer function:

```js
import {
    SHOW_FLASH_MESSAGE,
    CLEAR_FLASH_MESSAGES,
    IS_LOADING,
    IS_LOADED,
    RECEIVE_TO_DO_ITEMS,
    ADD_TO_DO_ITEM,
    INIT_PAGE
} from 'common/constants';

const defaultFlashMessageStateSlice = {
    flashMessages: []
}

const flashMessage = [
    (stateSlice, action) => {
        switch (action.type) {
            case SHOW_FLASH_MESSAGE:
                return {
                    ...stateSlice,
                    flashMessages: [
                        ...stateSlice.flashMessages,
                        ...action.data
                    ]
                };
            case CLEAR_FLASH_MESSAGES:
                return {
                    ...stateSlice,
                    flashMessages: [],
                };
            default:
                return stateSlice;
        }
    },
    defaultFlashMessageStateSlice
]

const defaultLocalStateSlice = {
    loading: false
};

const local = [
    (stateSlice, action) => {
        switch (action.type) {
            case IS_LOADING:
                return {
                    ...stateSlice,
                    loading: true,
                };
            case IS_LOADED:
                return {
                    ...stateSlice,
                    loading: false,
                };
            default:
                return stateSlice;
        }
    },
    defaultLocalStateSlice,
];

const defaultToDoItemsStateSlice = [];

const toDoItems = [
    (stateSlice, action) => {
        switch (action.type) {
            case ADD_TO_DO_ITEM:
                return [
                    ...stateSlice.toDoItems,
                    action.data
                ];
            case RECEIVE_TO_DO_ITEMS:
                return [
                    ...action.data
                ];
            case INIT_PAGE:
                return [
                    ...action.data.toDoItems
                ];
            default:
                return state;
        }
    },
    defaultToDoItemsStateSlice,
];

const defaultUserStateSlice = {
    id: '',
    handle: '',
    email: '',
};

const user = [
    (stateSlice, action) => {
        switch (action.type) {
            case INIT_PAGE:
                return {
                    ...action.data.user
                };
            default:
                return state;
        }
    },
    defaultUserStateSlice
];

export default combineReducers({ flashMessage, local, toDoItems, user });
```

A couple of the notable benefits include:

-   **separation of responsibility**: Each reducer function _only_ affects a single slice of `state`.
-   **debuggability**: If a slice of state isn't being updated/changed/etc. in the application's `reducer` the way you
would expect, you can immediately narrow your debugging to the function corresponding to the state slice in question.
<!--
    TODO: others?
    - less error-prone
    - clearer organization
-->

---

## Examples

### Simple usage

<details>

<summary>

`Provider` component

</summary>

<p>

```javascript
// example filepath: 'src/some-page/components/Provider/index.jsx'
import React, { useReducer } from 'react';
import combineReducers from 'common/utils/combineReducers';
import { StateContext, DispatchContext } from 'some-page/context';
import { sessionReducer, userReducer } from 'some-page/store/reducer';

const [combinedReducer, combinedState] = combineReducers({
    user: [userReducer, userStateSlice],
    session: [sessionReducer, sessionStateSlice],
});

const Provider = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(combinedReducer, {
        ...combinedState,
        ...initialState,
    });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export default Provider;
```

</p>
</details>

---

### Extended example

_(This is probably closer to its use in practice)_

<details>

<summary>

`base` reducer

</summary>

<p>

```javascript
// example filepath: 'src/some-page/store/base/reducer.js'
import { INIT_PAGE } from 'common/constants';

const initialStateSlice = {};

const session = [
    (stateSlice, action) => {
        switch (action.type) {
            case INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.data.session,
                    dateCompleted: new Date(action.data.session.dateCompleted),
                };
            default:
                return stateSlice;
        }
    },
    initialStateSlice,
];

const system = [
    (stateSlice, action) => {
        switch (action.type) {
            case INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.data.system,
                };
            default:
                return stateSlice;
        }
    },
    initialStateSlice,
];

const user = [
    (stateSlice, action) => {
        switch (action.type) {
            case INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.data.user,
                };
            default:
                return stateSlice;
        }
    },
    initialStateSlice,
];

export { session, system, user };
```

</p>
</details>

<details>

<summary>

`graph` reducer

</summary>

<p>

```javascript
// example filepath: 'src/some-page/store/graph/reducer.js'
import combineReducers from 'common/utils/combineReducers';
import { ON_HOVER, OFF_HOVER, RECEIVE_GRAPH_DATA } from 'some-page/constants';

const graphData = [
    (stateSlice, action) => {
        switch (action.type) {
            case RECEIVE_GRAPH_DATA:
                return action.payload;
            default:
                return stateSlice;
        }
    },
    null,
];

const onHover = [
    (stateSlice, action) => {
        switch (action.type) {
            case ON_HOVER:
                return { ...stateSlice, hovered: action.payload };
            case OFF_HOVER:
                return { ...stateSlice, hovered: false };
            default:
                return stateSlice;
        }
    },
    { hovered: false },
];

export default combineReducers({
    graphData,
    onHover,
});
```

</p>
</details>

<details>

<summary>

Combined reducer

</summary>

<p>

```javascript
// example filepath: 'src/some-page/store/reducer.js'
import combineReducers from 'common/utils/combineReducers';
import { session, system, user } from 'some-page/store/base/reducer.js';
import graph from 'some-page/store/graph/reducer.js';

export default combineReducers({
    graph,
    session,
    system,
    user,
});
```

</p>
</details>

<details>

<summary>

`Provider` component

</summary>

<p>

```javascript
// example filepath: 'src/some-page/components/Provider/index.jsx'
import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StateContext, DispatchContext } from 'some-page/context';
import store from 'some-page/store/reducer';

const Provider = ({ children, initialState }) => {
    const [combinedReducer, combinedState] = store;

    const [state, dispatch] = useReducer(combinedReducer, {
        local: {
            // TODO
        },
        ...combinedState,
        ...initialState,
    });

    useEffect(() => {
        // TODO: add actions here
    }, []);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

Provider.propTypes = {
    children: PropTypes.object.isRequired,
    initialState: PropTypes.object.isRequired,
};

export default Provider;
```

</p>
</details>
