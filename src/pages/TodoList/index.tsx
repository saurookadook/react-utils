import * as React from 'react';
import { useContext, useState } from 'react';

import { FlexColumn } from '@src/layouts';
import { addTodoItem, clearTodoItems, removeTodoItem } from '@src/store/todo/actions';
import { AppStateContext, AppDispatchContext } from '@src/store';
import './styles.css';

const ListHeading = ({
    itemCount,
}: {
    itemCount: number;
}) => {
    const pluralize = (count: number, word: string) =>
        (count === 1 ? word : `${word}s`);

    return (
        <h2>
            {itemCount > 0
                ? `You have ${itemCount} ${pluralize(itemCount, 'item')} on your To-Do list`
                : `To-Do list is empty`}
        </h2>
    );
};

const TodoList = () => {
    const [todoInputValue, setTodoInputValue] = useState('');

    const appState = useContext(AppStateContext);
    const appDispatch = useContext(AppDispatchContext);

    const { todoItems } = appState.todo;

    return (
        <section id="todo-list">
            <ListHeading itemCount={todoItems.length} />

            <ul>
                {todoItems.map((todoItem, index) => (
                    <li key={index}>
                        {todoItem}
                        <button
                            onClick={() =>
                                removeTodoItem({
                                    dispatch: appDispatch,
                                    targetIndex: index,
                                })
                            }
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <FlexColumn>
                <button onClick={() => clearTodoItems({ dispatch: appDispatch })}>
                    {`Clear All Items`}
                </button>

                <input
                    type="text"
                    placeholder="Add a new to-do item and press 'Enter' to submit"
                    value={todoInputValue}
                    onChange={(event) => setTodoInputValue(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && todoInputValue != '') {
                            // event.stopPropagation();
                            setTodoInputValue('');
                            addTodoItem({
                                dispatch: appDispatch,
                                todoItem: todoInputValue,
                            });

                        }
                    }}
                />
            </FlexColumn>
        </section>
    );
};

export default TodoList;
