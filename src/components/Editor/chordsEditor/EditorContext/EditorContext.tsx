import { Song } from '@model/song';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { set, get, isArray } from 'lodash';
import { insert, removeAt } from '@utils/array';

export interface EditorContextProps {
    song: Song;
}

// TODO: any
type State<T = any> = {
    value?: T;
    dispatch: React.Dispatch<Action<T>>;
    untypedDispatch: React.Dispatch<Action>;
};

const defaultValue: State = {
    value: {
        title: '',
        author: '',
        songBody: [],
    },
    dispatch: () => {},
    untypedDispatch: () => {},
};

type Payload<T = unknown> = {
    path?: string;
    value?: T;
    index?: number;
};

type Action<T = unknown> = {
    type: string;
    payload: Payload<T>;
};

const UndoActionsList: Action[] = [];

const Actions: {
    [key: string]: (
        state: Song,
        payload: Payload,
        omitSavingUndo?: boolean
    ) => Song;
} = {
    setValue: (state, { path, value }, omitSavingUndo) => {
        if (!path) return value as Song;

        const newState = {
            ...state,
        };

        const oldValue = get(state, path);
        set(newState, path, value);

        if (!omitSavingUndo)
            UndoActionsList.push({
                type: 'setValue',
                payload: {
                    path,
                    value: oldValue,
                },
            });

        return newState;
    },
    removeArrayValue: (state, { path, index }, omitSavingUndo) => {
        const newState = {
            ...state,
        };

        const arr = get(state, path, []);

        if (!isArray(arr)) {
            throw new Error(`Trying to remove not from array: ${path}`);
        }

        set(newState, path, removeAt(arr, index));

        if (!omitSavingUndo)
            UndoActionsList.push({
                type: 'addArrayValue',
                payload: {
                    path,
                    index,
                    value: arr[index],
                },
            });

        return newState;
    },
    addArrayValue: (state, { path, value, index }, omitSavingUndo) => {
        const newState = {
            ...state,
        };

        let arr = get(state, path, []);

        if (!isArray(arr)) {
            throw new Error(`Trying to add element not to array: ${path}`);
        }

        if (index === undefined) {
            arr.push(value);
        } else {
            arr = insert(arr, index, value);
        }

        set(newState, path, arr);

        if (!omitSavingUndo)
            UndoActionsList.push({
                type: 'removeArrayValue',
                payload: {
                    path,
                    index: index || arr.length - 1,
                },
            });

        return newState;
    },
    undo: (state) => {
        const action = UndoActionsList.pop();

        if (!action) return state;

        const { type, payload } = action;

        return Actions[type](state, payload, true);
    },
};

const editorReducer = (state: Song, { type, payload }: Action) => {
    console.groupCollapsed(
        `%c${type} action`,
        'color: CadetBlue',
        '\n',
        `path: ${payload.path}`
    );
    console.log('Payload:', JSON.parse(JSON.stringify(payload)));
    console.log('Previous state:', JSON.parse(JSON.stringify(state)));

    const newState = Actions[type](state, payload);

    console.log('New state:', JSON.parse(JSON.stringify(newState)));
    console.groupEnd();

    return newState;
};

const editorContext = createContext<State>(defaultValue);

export const EditorContextProvider: React.FC<EditorContextProps> = ({
    song: initialSong,
    children,
}) => {
    const [state, dispatch] = useReducer(editorReducer, initialSong);

    const onUndoClick = useCallback(
        (event: KeyboardEvent) => {
            if (
                event.ctrlKey === true &&
                event.code === 'KeyZ' &&
                // TODO: убедиться, что это здравое решение
                !(event.target as HTMLInputElement).isContentEditable &&
                (event.target as HTMLElement).nodeName !== 'INPUT' &&
                (event.target as HTMLElement).nodeName !== 'TEXTAREA'
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (!!UndoActionsList.length)
                    dispatch({ type: 'undo', payload: {} });
            }
        },
        [dispatch]
    );

    useEffect(() => {
        document.addEventListener('keydown', onUndoClick);

        return () => {
            document.removeEventListener('keydown', onUndoClick);
        };
    }, []);

    return (
        <editorContext.Provider
            value={{ value: state, dispatch, untypedDispatch: dispatch }}
        >
            {children}
        </editorContext.Provider>
    );
};

export function useEditorContext<T = any>(path?: string): State<T> {
    const context = useContext(editorContext);

    if (!context) {
        throw new Error('useEditorContext usage outside EditorContextProvider');
    }

    if (path) {
        const { value, dispatch } = context;

        const pathValue = get(value, path);

        return { value: pathValue, dispatch, untypedDispatch: dispatch };
    }

    return context;
}
