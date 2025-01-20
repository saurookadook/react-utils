import * as React from 'react';
import usePrevious from '@saurookkadookk/react-utils-use-previous';

import { ReactLogo, ViteLogo } from '@src/components';
import { FlexRow } from '@src/layouts';
import { AppStateContext, AppDispatchContext } from '@src/store';
import { incrementCounter, decrementCounter } from '@src/store/local/actions';

const Home = () => {
    const appState = React.useContext(AppStateContext);
    const appDispatch = React.useContext(AppDispatchContext);

    const { counter } = appState.local;

    const previousCount = usePrevious(counter);

    return (
        <div>
            <div>
                <h1>Vite + React</h1>

                <ViteLogo />
                <ReactLogo />

                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </div>

            <div className="card">
                <p>{`Counter: ${counter}`}</p>
                <p><em>{`Previous value: ${previousCount}`}</em></p>
                <FlexRow>
                    <button onClick={() => decrementCounter({ dispatch: appDispatch })}>
                        {`-`}
                    </button>
                    <button onClick={() => incrementCounter({ dispatch: appDispatch })}>
                        {`+`}
                    </button>
                </FlexRow>
            </div>
        </div>
    );
};

export default Home;
