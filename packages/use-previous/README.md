# `@saurookkadookk/react-utils-use-previous`

<!-- TODO: description -->

🚧 _WIP_ 🚧

## Installing

**with `npm`**

```sh
$ npm install @saurookkadookk/react-utils-use-previous
```

**with `pnpm`**

```sh
$ pnpm add @saurookkadookk/react-utils-use-previous
```

**with `Yarn`**

```sh
$ yarn add @saurookkadookk/react-utils-use-previous
```

## Usage

As the name of the hook implies, `usePrevious` is helpful for carrying over the value of a local variable between renders of a component.

```jsx
import React, { useEffect, useState } from 'react';

const SingularItemView = () => {
    const [currentItemView, setCurrentItemView] = useState({
        data: null,
    });

    const previousPathname = usePrevious(window.location.pathname);

    useEffect(() => {
        if (
            currentItemView.data == null
            || (previousPathname !== window.location.pathname)
        ) {
            fetch('/api/some/resource')
                .then((resp) => resp.json())
                .then((resData) => setCurrentItemView({
                    data: resData,
                }));
        }
    }, [currentItemView.data, window.location.pathname]);

    return (
        <div>
            {/* rest of component */}
        </div>
    );
}

```
