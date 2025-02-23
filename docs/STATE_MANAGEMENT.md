# State Management

## Table of Contents

-   [Overview](#overview)
-   [Context and the Provider component](#context-and-the-provider-component)
-   [Actions and Reducers](#actions-and-reducers)
-   [Putting it all together](#putting-it-all-together)
-   [Conclusion](#conclusion)
    -   [Additional Resources](#additional-resources)
    -   [Full Example](#full-example)

## Overview

<!-- TODO: is there a better doc for the Redux pattern? Preferably one not associated with Redux.js  -->

For the most part, our frontend apps manage state following
[the Redux pattern](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#state-management). Instead of
using the Redux library, however, we use React hooks and a mix of the
[state reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) and the
[provider](https://react.dev/learn/scaling-up-with-reducer-and-context) patterns. In the sections below, we will explain
our state management strategy and its implementation through an example `to-do` app, given the following directory
structure:

```
example-react-app/
 |-- src/
 |---- to-do/
 |------ components/
 |------ entry.js
```

<br/>

> <br/>
>
> **ASIDE**
>
> For simplicity, the `reducers` in this document are relatively simple, likely more simple than
> what you might encounter in a bigger codebase. However since this approach becomes less
> sustainable at a larger scale, you may want to use a utility function such as [`combineReducers`](../packages/combine-reducers/README.md).
> At the bottom of that function's `README`, you will find an [extended example](../packages/combine-reducers/README.md#extended-example) with its use in a
> similar state management pattern.
> <br />

## Context and the Provider component

To create both a global `state` (_commonly called 'store' in Redux parlance_) and a `dispatch` function through which we
trigger changes in global `state`, we make use of [`createContext`](https://react.dev/reference/react/createContext)
from `React`. Doing so will allow us to make use of the [`useContext`](https://react.dev/reference/react/useContext)
hook in other components.

In this example, we will create these contexts at the top-level of an app's directory in a `context.js` file.

```js
// example filepath: 'example-react-app/src/to-do/context.js'
import { createContext } from 'react';

export const StateContext = createContext();
export const DispatchContext = createContext();
```

We then create a `Provider` component to make use of these contexts throughout our app's component tree. Additionally, we
use the [`useReducer`](https://react.dev/reference/react/useReducer) hook to initialize our global `state` and
`dispatch` function.

```js
// example filepath: 'example-react-app/src/to-do/components/Provider/index.jsx'
import React, { useReducer } from 'react';
import { StateContext, DispatchContext } from 'to-do/context';

const reducerFunction = () => console.log('This will eventually do things :)');

const Provider = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(reducerFunction, { ...initialState });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export default Provider;
```

<details>

<summary>

_Updated directory structure_

</summary>

<p>

For those of you who are visual learners, our updated directory structure will look like the following:

```
example-react-app/
 |-- src/
 |---- to-do/
 |------ components/
 |-------- Provider/ <--
 |---------- index.jsx <--
 |------ context.js <--
 |------ entry.js
```

</p>

</details>

## Actions and Reducers

With the `Provider` component in place, we can now create our first **actions** and **reducer** functions.

Generally, we treat any function that accepts as an argument the `dispatch` function associated with our `Provider`
component as an **action**, regardless of whether it directly dispatches a state change or not.

To continue with our example, let's start with a few actions to:

-   add a new to-do item
-   fetch the list of to-do items
-   set the list of to-do items

For the sake of keeping this example simple, assume that we have some endpoints in our backend
services to facilitate basic CRUD operations for our to-do items.

```js
// example filepath: 'example-react-app/src/to-do/store/actions.js'
export const addToDoItem = async ({ dispatch, toDoItem }) => {
    const options = { body: JSON.stringify(toDoItem), method: 'POST' };
    const fetchRequest = await fetch('/bestest-endpoints/to-do/new', options);

    return fetchRequest
        .then((response) => {
            if (!response.ok || response.status >= 400) {
                throw new Error(`Failed to create new to-do item with ID: ${toDoItem.id}`);
            }
            return response.json();
        })
        .then((jsonResponse) =>
            dispatch({
                type: 'ADD_TO_DO_ITEM',
                data: { id: jsonResponse.toDoItemId, ...toDoItem },
            }),
        )
        .catch((error) => console.error(error));
};

export const fetchToDoItems = async ({ dispatch }) => {
    const fetchRequest = await fetch('/bestest-endpoints/to-do/all');

    return fetchRequest
        .then((response) => {
            if (!response.ok || response.status >= 400) {
                throw new Error('Failed to retrieve to-do items');
            }
            return response.json();
        })
        .then((jsonResponse) => setToDoItems({ dispatch, data: jsonResponse.allToDoItems }))
        .catch((error) => console.error(error));
};

export const setToDoItems = ({ dispatch, data }) => dispatch({ type: 'SET_TO_DO_ITEMS', data });
```

And now for our **reducer** function, which will return the new state in response to the dispatched action's `type`.

```js
// example filepath: 'example-react-app/src/to-do/store/reducer.js'
export const toDoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_DO_ITEM':
            return {
                ...state,
                toDos: [...state.toDos, action.data],
            };
        case 'SET_TO_DO_ITEMS':
            return {
                ...state,
                toDos: action.data,
            };
        default:
            return state;
    }
};
```

Finally, let's update our `Provider` component to use our new **reducer** function.

```js
// example filepath: 'example-react-app/src/to-do/components/Provider/index.jsx'
import React, { useReducer } from 'react';
import { StateContext, DispatchContext } from 'to-do/context';
import { toDoReducer } from 'to-do/store/reducer';

const Provider = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(toDoReducer, { toDos: null, ...initialState });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};
```

<details>

<summary>

_Updated directory structure_

</summary>

<p>

For those of you who are visual learners, our updated directory structure will look like the following:

```
example-react-app/
 |-- src/
 |---- to-do/
 |------ components/
 |-------- Provider/
 |---------- index.jsx
 |------ store/ <--
 |-------- actions.js <--
 |-------- reducer.js <--
 |------ context.js
 |------ entry.js
```

</p>

</details>

## Putting it all together

To finish up our example, let's add some components that utilize our strategy.

```js
// example filepath: 'example-react-app/src/to-do/components/ToDoItemsList/index.jsx'
import React, { useContext } from 'react';
import { StateContext, DispatchContext } from 'to-do/context';
import ToDoItemListItem from 'to-do/components/ToDoItemListItem';
import { fetchToDoItems } from 'to-do/store/actions';

const ToDoItemsList = () => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        if (state.toDos == null) {
            fetchToDoItems({ dispatch });
        }
    }, [state.toDos]);

    return (
        <section>
            {state.toDos == null ? (
                'Loading... :]'
            ) : (
                <ul>
                    {state.toDos.map((toDo, index) => (
                        <ToDoItemListItem key={`${toDo.id}-${index}`} toDo={toDo} />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ToDoItemsList;
```

```js
// example filepath: 'example-react-app/src/to-do/components/ToDoItemListItem/index.jsx'
import React from 'react';

const ToDoItemListItem = ({ toDo }) => {
    return (
        <li>
            <p>
                <strong>Title:</strong> {toDo.title}
            </p>
            <p>{toDo.content}</p>
        </li>
    );
};

export default ToDoItemListItem;
```

```js
// example filepath: 'example-react-app/src/to-do/components/NewToDoItemForm/index.jsx'
import React, { useContext, useRef, useState } from 'react';
import { addToDoItem } from 'to-do/store/actions';
import { DispatchContext } from 'to-do/context';

const NewToDoItemForm = () => {
    const dispatch = useContext(DispatchContext);

    const [titleInputValue, setTitleInputValue] = useState('');
    const [contentTextboxValue, setContentTextboxValue] = useState('');

    const titleInputRef = useRef(null);
    const contentTextboxRef = useRef(null);

    let toDoItem = {
        title: '',
        content: '',
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addToDoItem({ dispatch, toDoItem });
    };

    useEffect(() => {
        Object.assign(toDoItem, {
            title: titleInputRef.current,
            content: contentTextboxRef.current,
        });
    });

    return (
        <form onSubmit={handleSubmit}>
            <label for="title">To-Do Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                onChange={(e) => setTitleInputValue(e.target.value)}
                ref={titleInputRef}
                value={titleInputValue}
            />

            <label for="content">To-Do Content:</label>
            <input
                type="textbox"
                id="content"
                name="content"
                onChange={(e) => setContentTextboxValue(e.target.value)}
                ref={contentTextboxRef}
                value={contentTextboxValue}
            />

            <input type="button" onClick={handleSubmit}>
                Create New To-Do
            </input>
        </form>
    );
};

export default NewToDoItemForm;
```

```js
// example filepath: 'example-react-app/src/to-do/components/App/index.jsx'
import React from 'react';
import NewToDoItemForm from 'to-do/components/NewToDoItemForm';
import ToDoItemList from 'to-do/components/ToDoItemList';

const App = () => {
    return (
        <section>
            <ToDoItemList />
            <NewToDoItemForm />
        </section>
    );
};
```

```js
// example filepath: 'example-react-app/src/to-do/entry.js'
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'to-do/components/App';
import Provider from 'to-do/components/Provider';

window.renderApp = async (bootstrapData) => {
    const container = document.getElementById('ps-main');
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <Provider initialState={bootstrapData}>
                <App />
            </Provider>
        </React.StrictMode>,
    );
};
```

<details>

<summary>

_Updated directory structure_

</summary>

<p>

For those of you who are visual learners, our updated directory structure will look like the following:

```
example-react-app/
 |-- src/
 |---- to-do/
 |------ components/
 |-------- App/ <--
 |---------- index.jsx <--
 |-------- NewToDoItemForm/ <--
 |---------- index.jsx <--
 |-------- Provider/
 |---------- index.jsx
 |-------- ToDoItemListItem/  <--
 |---------- index.jsx  <--
 |-------- ToDoItemsList/  <--
 |---------- index.jsx  <--
 |------ store/
 |-------- actions.js
 |-------- reducer.js
 |------ context.js
 |------ entry.js <--
```

</p>

</details>

Notice that components not only can optionally _**subscribe** to changes in global `state`_ but
they can also _**access** a reference to the `dispatch` function_ through which they can trigger
changes to global `state`, which also means that they can trigger changes in _components outside_
_of their branch of the component tree_. Also, notice that components can do none, either, or both
of these things; this gives us a tremendous amount of flexibility when determining exactly how each
component should interact (_or not!_) with the state of our app.

## Conclusion

Hopefully, this has been helpful in providing a broad explanation of our state management strategy
in our frontend apps, and showing each primary piece of its implementation.
<!-- Not sure how to end this :] -->

### Additional Resources

https://react.dev/learn/passing-data-deeply-with-context

https://react.dev/reference/react/createContext

**React docs**

-   [Hooks API documentation](https://react.dev/reference/react)
-   [createContext](https://react.dev/reference/react/createContext)
-   [useContext](https://react.dev/reference/react/useContext)
-   [useReducer](https://react.dev/reference/react/useReducer)
-   [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
-   [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
-   [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

**LogRocket blog**

-   [State Reducer pattern (from LogRocket blog)](https://blog.logrocket.com/react-design-patterns/#state-reducer-pattern)
-   [Provider pattern (from LogRocket blog)](https://blog.logrocket.com/react-design-patterns/#provider-pattern)

**Internal**

-   [`combineReducers`](../packages/combine-reducers/README.md)

### Full Example

_**Disclaimer**: this code may or may not work **exactly** as written_ 🙂

<details>

<summary>

`App`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/components/App/index.jsx'
import React from 'react';
import NewToDoItemForm from 'to-do/components/NewToDoItemForm';
import ToDoItemList from 'to-do/components/ToDoItemList';

const App = () => {
    return (
        <section>
            <ToDoItemList />
            <NewToDoItemForm />
        </section>
    );
};

export default App;
```

</p>

</details>

<details>

<summary>

`NewToDoItemForm`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/components/NewToDoItemForm/index.jsx'
import React, { useContext, useRef, useState } from 'react';
import { addToDoItem } from 'to-do/store/actions';
import { DispatchContext } from 'to-do/context';

const NewToDoItemForm = () => {
    const dispatch = useContext(DispatchContext);

    const [titleInputValue, setTitleInputValue] = useState('');
    const [contentTextboxValue, setContentTextboxValue] = useState('');

    const titleInputRef = useRef(null);
    const contentTextboxRef = useRef(null);

    let toDoItem = {
        title: '',
        content: '',
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addToDoItem({ dispatch, toDoItem });
    };

    useEffect(() => {
        Object.assign(toDoItem, {
            title: titleInputRef.current,
            content: contentTextboxRef.current,
        });
    });

    return (
        <form onSubmit={handleSubmit}>
            <label for="title">To-Do Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                onChange={(e) => setTitleInputValue(e.target.value)}
                ref={titleInputRef}
                value={titleInputValue}
            />

            <label for="content">To-Do Content:</label>
            <input
                type="textbox"
                id="content"
                name="content"
                onChange={(e) => setContentTextboxValue(e.target.value)}
                ref={contentTextboxRef}
                value={contentTextboxValue}
            />

            <input type="button" onClick={handleSubmit}>
                Create New To-Do
            </input>
        </form>
    );
};

export default NewToDoItemForm;
```

</p>

</details>

<details>

<summary>

`ToDoItemsList`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/components/ToDoItemsList/index.jsx'
import React, { useContext } from 'react';
import { StateContext, DispatchContext } from 'to-do/context';
import ToDoItemListItem from 'to-do/components/ToDoItemListItem';
import { fetchToDoItems } from 'to-do/store/actions';

const ToDoItemsList = () => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        if (state.toDos == null) {
            fetchToDoItems({ dispatch });
        }
    }, [state.toDos]);

    return (
        <section>
            {state.toDos == null ? (
                'Loading... :]'
            ) : (
                <ul>
                    {state.toDos.map((toDo, index) => (
                        <ToDoItemListItem key={`${toDo.id}-${index}`} toDo={toDo} />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ToDoItemsList;
```

</p>

</details>

<details>

<summary>

`ToDoItemListItem`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/components/ToDoItemListItem/index.jsx'
import React from 'react';

const ToDoItemListItem = ({ toDo }) => {
    return (
        <li>
            <p>
                <strong>Title:</strong> {toDo.title}
            </p>
            <p>{toDo.content}</p>
        </li>
    );
};

export default ToDoItemListItem;
```

</p>

</details>

---

<details>

<summary>

`actions.js`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/store/actions.js'
export const addToDoItem = async ({ dispatch, toDoItem }) => {
    const options = { body: JSON.stringify(toDoItem), method: 'POST' };
    const fetchRequest = await fetch('/bestest-endpoints/to-do/new', options);

    return fetchRequest
        .then((response) => {
            if (!response.ok || response.status >= 400) {
                throw new Error(`Failed to create new to-do item with ID: ${toDoItem.id}`);
            }
            return response.json();
        })
        .then((jsonResponse) =>
            dispatch({
                type: 'ADD_TO_DO_ITEM',
                data: { id: jsonResponse.toDoItemId, ...toDoItem },
            }),
        )
        .catch((error) => console.error(error));
};

export const fetchToDoItems = async ({ dispatch }) => {
    const fetchRequest = await fetch('/bestest-endpoints/to-do/all');

    return fetchRequest
        .then((response) => {
            if (!response.ok || response.status >= 400) {
                throw new Error('Failed to retrieve to-do items');
            }
            return response.json();
        })
        .then((jsonResponse) => setToDoItems({ dispatch, data: jsonResponse.allToDoItems }))
        .catch((error) => console.error(error));
};

export const setToDoItems = ({ dispatch, data }) => dispatch({ type: 'SET_TO_DO_ITEMS', data });
```

</p>

</details>

<details>

<summary>

`reducer.js`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/store/reducer.js'
export const toDoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_DO_ITEM':
            return {
                ...state,
                toDos: [...state.toDos, action.data],
            };
        case 'SET_TO_DO_ITEMS':
            return {
                ...state,
                toDos: action.data,
            };
        default:
            return state;
    }
};
```

</p>

</details>

---

<details>

<summary>

`context.js`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/context.js'
import { createContext } from 'react';

export const StateContext = createContext();
export const DispatchContext = createContext();
```

</p>

</details>

<details>

<summary>

`entry.js`

</summary>

<p>

```js
// example filepath: 'example-react-app/src/to-do/entry.js'
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'to-do/components/App';
import Provider from 'to-do/components/Provider';

window.renderApp = async (bootstrapData) => {
    const container = document.getElementById('ps-main');
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <Provider initialState={bootstrapData}>
                <App />
            </Provider>
        </React.StrictMode>,
    );
};
```

</p>

</details>

<details>

<summary>Full directory structure</summary>

<p>

```
example-react-app/
 |-- src/
 |---- to-do/
 |------ components/
 |-------- App/
 |---------- index.jsx
 |-------- NewToDoItemForm/
 |---------- index.jsx
 |-------- Provider/
 |---------- index.jsx
 |-------- ToDoItemListItem/
 |---------- index.jsx
 |-------- ToDoItemsList/
 |---------- index.jsx
 |------ store/
 |-------- actions.js
 |-------- reducer.js
 |------ context.js
 |------ entry.js
```

</p>

</details>
