import { LyricsPartType, SongLine } from '@model/song';
import React from 'react';
import { useEditorContext } from '../../EditorContext';
import { EditLine } from './EditLine';
import { LyricsLine } from './LyricsLine';
import { get } from 'lodash';

export interface LineProps {
    path: string;
    lineIndex: number;
    isEdited: boolean;
    onRemoveLine: () => void;
    onSetLineEdit: () => void;
    onCancelLineEdit: () => void;
    onAddLineAfter: () => void;
    onAddLineBefore: () => void;
}

export const Line: React.FC<LineProps> = ({
    path,
    isEdited,
    onRemoveLine,
    onSetLineEdit,
    onCancelLineEdit,
    onAddLineAfter,
    onAddLineBefore,
}) => {
    const { song, dispatch } = useEditorContext();
    const line = get(song, path);

    const isLyricsEmpty = !line.lyrics.length;

    if (isLyricsEmpty || isEdited)
        return (
            <EditLine
                line={line}
                onSave={(text) => {
                    onCancelLineEdit();
                    dispatch({
                        type: 'setValue',
                        payload: {
                            path,
                            value: {
                                ...line,
                                chords: undefined,
                                lyrics: [text],
                                lastChordOffset: undefined,
                                firstChordOffset: undefined,
                            },
                        },
                    });
                }}
                onCancel={isLyricsEmpty ? onRemoveLine : onCancelLineEdit}
            />
        );

    return (
        <LyricsLine
            line={line}
            onToggleEdit={onSetLineEdit}
            onRemove={onRemoveLine}
            onAlterLine={(line: SongLine) =>
                dispatch({ type: 'setValue', payload: { path, value: line } })
            }
            onAddLineAfter={onAddLineAfter}
            onAddLineBefore={onAddLineBefore}
        />
    );
};
