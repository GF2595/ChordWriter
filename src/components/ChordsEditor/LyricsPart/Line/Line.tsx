import { useEditorContext } from '@components/EditorContext';
import React, { useCallback } from 'react';
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
    onSplitPart?: () => void;
    onMultilinePaste: (excessLines: string[]) => void;
    onCreateNewPart?: () => void;
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
    onSplitPart,
    onCreateNewPart,
}) => {
    const { value: line, dispatch } = useEditorContext(path);

    const isLyricsEmpty = !line?.lyrics || !line.lyrics.length;

    const handleSave = useCallback(
        (text) => {
            onCancelLineEdit();
            dispatch({
                type: 'setValue',
                payload: {
                    path,
                    value: {
                        ...line,
                        lyrics: [{ lyric: text }],
                        lastChordOffset: undefined,
                        firstChordOffset: undefined,
                    },
                },
            });
        },
        [dispatch, line, onCancelLineEdit, path]
    );

    // TODO: рефакторинг
    if (!line) return null;

    if (isLyricsEmpty || isEdited)
        return (
            <EditLine
                line={line}
                onSaveWithNewLine={(text) => {
                    handleSave(text);
                    onAddLineAfter();
                }}
                onSave={handleSave}
                onSaveEmpty={() => {
                    onRemoveLine();
                    onCreateNewPart?.();
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
            onSplitPart={onSplitPart}
        />
    );
};

