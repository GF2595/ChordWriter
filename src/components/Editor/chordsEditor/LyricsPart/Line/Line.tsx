import React from 'react';
import { useEditorContext } from '@components/EditorContext';
import { EditLine } from './EditLine';
import { LyricsLine } from './LyricsLine';

export interface LineProps {
    path: string;
    isEdited: boolean;
    onRemoveLine: () => void;
    onSetLineEdit: () => void;
    onCancelLineEdit: () => void;
    onAddLineAfter: () => void;
    onAddLineBefore: () => void;
    onMultilinePaste: (excessLines: string[]) => void;
}

export const Line: React.FC<LineProps> = ({
    path,
    isEdited,
    onRemoveLine,
    onSetLineEdit,
    onCancelLineEdit,
    onAddLineAfter,
    onAddLineBefore,
    onMultilinePaste,
}) => {
    const { value: line, dispatch } = useEditorContext(path);

    if (!line) return null;

    const isLyricsEmpty = !line?.lyrics || !line.lyrics.length;

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
                                lyrics: [{ lyric: text }],
                                lastChordOffset: undefined,
                                firstChordOffset: undefined,
                            },
                        },
                    });
                }}
                onCancel={isLyricsEmpty ? onRemoveLine : onCancelLineEdit}
                onMultilinePaste={onMultilinePaste}
            />
        );

    return (
        <LyricsLine
            path={path}
            onToggleEdit={onSetLineEdit}
            onRemove={onRemoveLine}
            onAddLineAfter={onAddLineAfter}
            onAddLineBefore={onAddLineBefore}
        />
    );
};
