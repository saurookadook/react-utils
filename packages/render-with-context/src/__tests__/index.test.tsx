import * as React from 'react';
const { createContext, useContext, useEffect, useReducer } = React;
import { cleanup, screen, waitFor } from '@testing-library/react';
import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { deeplyMerge } from '../deeplyMerge';
import renderWithContext from '../index';

type NullishValue<V> = V | null;

type LocalsStateSlice = {
    count: number;
    flashMessages?: string[];
    pathname?: string;
}

type PageDataStateSlice = {
    certainty?: number;
    data?: string[];
    sentiment?: string;
    stockSlug?: string;
};

type UserStateSlice = {
    firstName?: string;
    lastName?: string;
    isBlocked?: boolean;
};

type MockStateStore = {
    locals: LocalsStateSlice;
    pageData: NullishValue<PageDataStateSlice>;
    user: NullishValue<UserStateSlice>;
};

const mockActions = {
    INCREMENT_COUNT: 'INCREMENT_COUNT',
    INIT_PAGE: 'INIT_PAGE',
};

const MockStateContext = createContext<MockStateStore>({
    locals: { count: 0 },
    pageData: {},
    user: {},
});

type MockDispatch = React.Dispatch<combineReducers.ReducerAction<any>>;
const MockDispatchContext = createContext<MockDispatch>((action) => action);

const mockLocalsReducer: combineReducers.ArgsTuple<MockStateStore['locals']> = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.INCREMENT_COUNT:
                stateSlice.count += 1;
                return stateSlice;
            default:
                return stateSlice;
        }
    },
    {
        count: 0,
    },
];

const mockPageDataReducer: combineReducers.ArgsTuple<MockStateStore['pageData']> = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.payload.pageData,
                };
            default:
                return stateSlice;
        }
    },
    null,
];

const mockUserReducer: combineReducers.ArgsTuple<MockStateStore['user']> = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.payload.user,
                };
            default:
                return stateSlice;
        }
    },
    null,
];

const [mockCombinedReducer, mockCombinedDefaultState] = combineReducers({
    locals: mockLocalsReducer,
    pageData: mockPageDataReducer,
    user: mockUserReducer,
});

const initialPageDataStateSlice: PageDataStateSlice = {
    certainty: 0.99,
    data: ['stuff', 'moar stuff', 'furrballz'],
    sentiment: 'SUPER GREAT',
    stockSlug: 'MEOW',
};

const initialUserStateSlice: UserStateSlice = {
    firstName: 'Testy',
    lastName: 'McTestermanjensensonmann',
    isBlocked: false,
};

const initPageAction = ({ dispatch, data }) =>
    dispatch({
        type: mockActions.INIT_PAGE,
        payload: data,
    });

const incrementCountAction = ({ dispatch }) => dispatch({ type: mockActions.INCREMENT_COUNT });

const MockProvider = ({ children, initialState }) => {
    const recursivelyMergedState = deeplyMerge(deeplyMerge({}, mockCombinedDefaultState), initialState);
    const [state, dispatch] = useReducer(mockCombinedReducer, recursivelyMergedState);

    return (
        <MockStateContext.Provider value={state as MockStateStore}>
            <MockDispatchContext.Provider value={dispatch}>{children}</MockDispatchContext.Provider>
        </MockStateContext.Provider>
    );
};

const renderStateSlices = (state: MockStateStore) => {
    const stateSliceKeys = Object.keys(state);
    return stateSliceKeys.map((sliceKey, i) => {
        const stateSlice = state[sliceKey];
        const stateSliceProperties = Object.keys(stateSlice);
        return (
            <ul key={`${sliceKey}-${i}`} id={`${sliceKey}`}>
                {stateSliceProperties.map((property, j) => {
                    return <li key={`${property}-${j}`}>{`${property}: ${stateSlice[property]}`}</li>;
                })}
            </ul>
        );
    });
};

const MockComponentUnderTest = () => {
    const { locals, pageData, user } = useContext(MockStateContext);
    // console.log('MockComponentUnderTest\n\n', { locals, pageData, user });
    const dispatch = useContext(MockDispatchContext);

    const hasInitialized = () => pageData != null && user != null;

    useEffect(() => {
        if (!hasInitialized()) {
            setTimeout(() => {
                return initPageAction({
                    dispatch,
                    data: {
                        pageData: initialPageDataStateSlice,
                        user: initialUserStateSlice,
                    },
                });
            }, 100);
        }
    }, [locals.count, pageData, user]);

    return (
        <div id="main-container">
            <section>
                <span id="count">{`Current count: ${locals.count}`}</span>
                <button onClick={() => incrementCountAction({ dispatch })}>{`PRESS THE BUTTON`}</button>
            </section>
            <div className="state-slices-wrapper">
                {hasInitialized() ? (
                    <span aria-label="state slices">{renderStateSlices({ locals, pageData, user })}</span>
                ) : (
                    <span aria-label="Loading...">{`Loading... 🙃`}</span>
                )}
            </div>
        </div>
    );
};

describe('renderWithContext utility', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    it('should render the component under test', async () => {
        jest.useFakeTimers();
        renderWithContext(<MockComponentUnderTest />, MockProvider);

        /**
         * TODO: not sure why this test is throwing this warning:
         * Warning: An update to MockProvider inside a test was not wrapped in act(...).
         */
        await waitFor(() => {
            expect(screen.getByLabelText('Loading...')).toBeVisible();
        });

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            const stateSlicesElement = screen.getByLabelText('state slices');
            expect(stateSlicesElement).toBeVisible();
            expect(stateSlicesElement.querySelectorAll('#pageData > li')).toHaveLength(4);
            expect(stateSlicesElement.querySelectorAll('#user > li')).toHaveLength(3);
        });
        jest.useRealTimers();
    });

    it("should render the component correctly based on the passed 'state'", async () => {
        renderWithContext(<MockComponentUnderTest />, MockProvider, {
            state: {
                pageData: {
                    certainty: 0.97,
                    sentiment: 'haz gud snoot',
                    stockSlug: 'WOOF',
                },
                user: {
                    firstName: 'Hooplah',
                    isBlocked: false,
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByLabelText('state slices')).toBeInTheDocument();
        });

        await waitFor(() => {
            const stateSlicesElement = screen.getByLabelText('state slices');
            expect(stateSlicesElement).toBeVisible();
            expect(stateSlicesElement.querySelectorAll('#pageData > li')).toHaveLength(3);
            expect(stateSlicesElement.querySelectorAll('#user > li')).toHaveLength(2);
        });
    });

    it('should handle user interaction correctly in the component under test', async () => {
        const { user } = renderWithContext(<MockComponentUnderTest />, MockProvider);

        const getCountElement = () => screen.getByText(/Current\scount:\s\d+/);

        expect(getCountElement()).toHaveTextContent('Current count: 0');

        await user.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(getCountElement()).toHaveTextContent('Current count: 1');
        });
    });
});
