/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
import combineReducers, { type CombineReducers } from './index';

const mockActions = {
    INCREMENT_COUNT: 'INCREMENT_COUNT',
    DECREMENT_COUNT: 'DECREMENT_COUNT',
    ADD_FLASH_MESSAGE: 'ADD_FLASH_MESSAGE',
    REMOVE_FLASH_MESSAGE: 'REMOVE_FLASH_MESSAGE',
    INIT_PAGE: 'INIT_PAGE',
    SET_IT_ON_FIRE: 'SET_IT_ON_FIRE',
    UPDATE_USER_IS_BLOCKED: 'UPDATE_USER_IS_BLOCKED',
};

type LocalsStateSlice = {
    flashMessage?: string;
    flashMessages?: string[];
    pathname?: string;
};

type CountAction = CombineReducers.ReducerAction<{ count?: number }>

type FlashMessagesAction = CombineReducers.ReducerAction<{
    flashMessage?: string;
    flashMessages?: string[];
}>

type PathnameAction = CombineReducers.ReducerAction<{ pathname?: string }>

type CombinedLocalsStateSlice = {
    count: CombineReducers.ArgsTuple<number, CountAction>;
    flashMessages: CombineReducers.ArgsTuple<string[], FlashMessagesAction>;
    pathname: CombineReducers.ArgsTuple<string, PathnameAction>;
}

type UserStateSlice = {
    firstName?: string;
    lastName?: string;
    isBlocked?: boolean;
};

type CombinedState = {
    locals: LocalsStateSlice;
    user: UserStateSlice;
}

type LocalsStateSliceReducerArg = CombineReducers.ArgsTuple<CombinedState['locals']>

type UserStateSliceReducerArg = CombineReducers.ArgsTuple<CombinedState['user']>

const defaultCountSlice = 0;

const mockCountReducers: CombinedLocalsStateSlice['count'] = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.INCREMENT_COUNT:
                return stateSlice + 1;
            case mockActions.DECREMENT_COUNT:
                return stateSlice - 1;
            default:
                return stateSlice;
        }
    },
    defaultCountSlice,
];

const defaultFlashMessagesStateSlice: string[] = [];

const mockFlashMessagesReducer: CombinedLocalsStateSlice['flashMessages'] = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.ADD_FLASH_MESSAGE:
                if (action.payload?.locals?.flashMessage != null) {
                    stateSlice.push(action.payload.locals.flashMessage);
                }

                return stateSlice;
            case mockActions.REMOVE_FLASH_MESSAGE:
                return stateSlice.filter((message) => message !== action.payload?.locals?.flashMessage);
            default:
                return stateSlice;
        }
    },
    defaultFlashMessagesStateSlice,
];

const defaultPathnameStateSlice = '/app/home';

const mockPathnameReducer: CombinedLocalsStateSlice['pathname'] = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.INIT_PAGE:
                return action.payload?.pathname ?? stateSlice;
            default:
                return stateSlice;
        }
    },
    defaultPathnameStateSlice,
];

// @ts-ignore
const nestedLocalsStateSlice = combineReducers({
    count: mockCountReducers,
    flashMessages: mockFlashMessagesReducer,
    pathname: mockPathnameReducer,
});

const defaultLocalsStateSlice: LocalsStateSlice = {
    pathname: '/app/home',
};

// const mockLocalsReducer: GenericStateSliceReducer<LocalsStateSlice, GenericReducerAction<LocalsActionPayload>> = [
const mockLocalsReducer: LocalsStateSliceReducerArg = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.ADD_FLASH_MESSAGE:
                if (!Array.isArray(stateSlice.flashMessages)) {
                    stateSlice.flashMessages = [];
                }

                if (action.payload?.locals?.flashMessage != null) {
                    stateSlice.flashMessages.push(action.payload.locals.flashMessage);
                }

                return stateSlice;
            case mockActions.INIT_PAGE:
                return {
                    ...stateSlice,
                    ...action.payload.locals,
                };
            default:
                return stateSlice;
        }
    },
    defaultLocalsStateSlice,
];

const defaultUserStateSlice: UserStateSlice = {
    firstName: 'Testy',
    lastName: 'McTestermanjensensonmann',
    isBlocked: false,
};

const mockUserReducer: UserStateSliceReducerArg = [
    (stateSlice, action) => {
        switch (action.type) {
            case mockActions.UPDATE_USER_IS_BLOCKED:
                stateSlice.isBlocked = action.payload?.user?.isBlocked;
                return stateSlice;
            case mockActions.INIT_PAGE:
                return action.payload?.user != null
                    ? {
                        ...stateSlice,
                        ...action.payload.user,
                    }
                    : stateSlice;
            default:
                return stateSlice;
        }
    },
    defaultUserStateSlice,
];

describe('combineReducers utility', () => {
    let testCombinedReducer: CombineReducers.ArgsTuple<CombinedState>[0],
        testCombinedInitialState: CombineReducers.ArgsTuple<CombinedState>[1];
    // to make test output quieter :]
    jest.spyOn(console, 'error').mockImplementation((...args) => args);

    beforeEach(() => {
        [testCombinedReducer, testCombinedInitialState] = combineReducers({
            locals: mockLocalsReducer,
            user: mockUserReducer,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('combines default states', () => {
        const expectedDefaultState = {
            locals: defaultLocalsStateSlice,
            user: defaultUserStateSlice,
        };
        expect(testCombinedInitialState).toEqual(expectedDefaultState);
    });

    describe('returned combined reducer', () => {
        it("does not change state on 'null' action payload", () => {
            const sameAsDefaultState = testCombinedReducer(testCombinedInitialState, { type: 'LOLZ' });
            expect(testCombinedInitialState).toEqual(sameAsDefaultState);
        });

        describe('applies state change only to slice of state for corresponding action', () => {
            it("only applies change to 'locals' state slice", () => {
                const mockFlashMessage = 'LOOK OUT BEHIND YOU! 😱';
                const stateWithFlashMessage = testCombinedReducer(testCombinedInitialState, {
                    type: mockActions.ADD_FLASH_MESSAGE,
                    payload: {
                        locals: {
                            flashMessage: mockFlashMessage,
                        },
                    },
                });

                const expectedUpdatedState = {
                    locals: {
                        ...defaultLocalsStateSlice,
                        flashMessages: [mockFlashMessage],
                    },
                    user: {
                        ...defaultUserStateSlice,
                    },
                };
                expect(stateWithFlashMessage).toEqual(expectedUpdatedState);
            });

            it("only applies change to 'user' state slice", () => {
                const stateUserIsBlocked = testCombinedReducer(testCombinedInitialState, {
                    type: mockActions.UPDATE_USER_IS_BLOCKED,
                    payload: {
                        user: {
                            isBlocked: true,
                        },
                    },
                });

                const expectedUpdatedState = {
                    locals: {
                        ...defaultLocalsStateSlice,
                    },
                    user: {
                        ...defaultUserStateSlice,
                        isBlocked: true,
                    },
                };
                expect(stateUserIsBlocked).toEqual(expectedUpdatedState);
            });

            it('changes more than one slice of state based on action', () => {
                const mockLocalsSlice = {
                    flashMessages: ["Sorry, Santa; those cookies weren't for you but we saw you eat them anyway..."],
                    pathname: '/app/blocked',
                };
                const mockUserSlice = {
                    firstName: 'Santa',
                    lastName: 'Claus',
                    isBlocked: true,
                };

                const stateAfterInitPage = testCombinedReducer(testCombinedInitialState, {
                    type: mockActions.INIT_PAGE,
                    payload: {
                        locals: {
                            ...mockLocalsSlice,
                        },
                        user: {
                            ...mockUserSlice,
                        },
                    },
                });
                const expectedUpdatedState = {
                    locals: mockLocalsSlice,
                    user: mockUserSlice,
                };

                expect(stateAfterInitPage).toEqual(expectedUpdatedState);
            });
        });

        describe('handles problems as expected', () => {
            it('raises error for non-function reducers', () => {
                expect(() => {
                    combineReducers({
                        // @ts-expect-error: This test is literally testing for the situation of an incorrectly-typed reducer arg
                        woops: ['enchantment?', { excitedGreeting: 'enchantment!' }],
                    });
                }).toThrow();
            });

            it('logs error and returns existing state slice if error is encountered in reducer', () => {
                const mockProblematicReducer = (
                    stateSlice: string = '',
                    action: CombineReducers.ReducerAction<string>,
                ) => {
                    switch (action.type) {
                        case mockActions.SET_IT_ON_FIRE:
                            return JSON.parse('{"lolz": "woooooooppppppppsssiiiiieeeeeeeeeeez",');
                        default:
                            return stateSlice;
                    }
                };

                const [combinedWoopsReducer, combinedWoopsState] = combineReducers({
                    woops: [mockProblematicReducer, { excitedGreeting: 'enchantment!', query: 'enchantment?' }],
                });
                const expectedWoopsState = {
                    woops: { excitedGreeting: 'enchantment!', query: 'enchantment?' },
                };

                expect(combinedWoopsState).toEqual(expectedWoopsState);

                const uhOhBrokenWoopsState = combinedWoopsReducer(combinedWoopsState, {
                    type: mockActions.SET_IT_ON_FIRE,
                    payload: { worriedGreeting: 'enchantment...?' },
                });

                expect(uhOhBrokenWoopsState).toEqual(combinedWoopsState);
            });
        });
    });
});
