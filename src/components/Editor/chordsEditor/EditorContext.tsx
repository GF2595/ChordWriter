import { Song } from '@model/song';
import React, { createContext, useContext, useReducer } from 'react';
import { set, get, isArray } from 'lodash';
import { insert, removeAt } from '@utils/array';

export interface EditorContextProps {
    song: Song;
}

type State = {
    // TODO: any
    value: any;
    dispatch: React.Dispatch<Action>;
};

const defaultValue: State = {
    value: {
        title: '',
        author: '',
        songBody: [],
    },
    dispatch: () => {},
};

type Payload = {
    path?: string;
    value?: unknown;
    index?: number;
};

const Actions: { [key: string]: (state: Song, payload: Payload) => Song } = {
    setValue: (state, { path, value }) => {
        const newState = {
            ...state,
        };

        set(newState, path, value);

        return newState;
    },
    removeArrayValue: (state, { path, index }) => {
        const newState = {
            ...state,
        };

        const arr = get(state, path, []);

        if (!isArray(arr)) {
            throw new Error(`Trying to remove not from array: ${path}`);
        }

        set(newState, path, removeAt(arr, index));

        return newState;
    },
    addArrayValue: (state, { path, value, index }) => {
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

        return newState;
    },
};

type Action = {
    type: keyof typeof Actions;
    payload: Payload;
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

    return (
        <editorContext.Provider value={{ value: state, dispatch }}>
            {children}
        </editorContext.Provider>
    );
};

export const useEditorContext = (path?: string): State => {
    const context = useContext(editorContext);

    if (!context) {
        throw new Error('useEditorContext usage outside EditorContextProvider');
    }

    if (path) {
        const { value, dispatch } = context;

        const pathValue = get(value, path);

        if (!pathValue)
            console.error(`useEditorContext value at ${path} is undefined`);

        return { value: pathValue, dispatch };
    }

    return context;
};
