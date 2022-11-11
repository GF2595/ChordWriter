import { SongLine } from '@model/song';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './EditLine.scss';
import { InlineInput, InlineInputProps } from '../../components';

export interface EditLineProps {
    line: SongLine | string;
    placeholder?: string;
    canSaveEmpty?: boolean;
    onSave: (text: string) => void;
    onCancel: () => void;
    onMultilinePaste?: (excessLines: string[]) => void;
}

export const EditLine: React.FC<EditLineProps> = ({
    line,
    canSaveEmpty,
    placeholder,
    onSave,
    onCancel,
    onMultilinePaste,
}) => {
    const originalText = useRef(
        typeof line === 'string' ? line : line.lyrics.join('')
    );
    const [text, setText] = useState(originalText.current);

    const disabled =
        !originalText.current.localeCompare(text) ||
        (!canSaveEmpty && !text.length);

    const onPaste: InlineInputProps['onPaste'] = useCallback(
        (event) => {
            const pasteText = event.clipboardData.getData('text');
            const selectionRange = window.getSelection().getRangeAt(0);

            const pasteLines = pasteText.split('\n').map((line) => line.trim());

            if (pasteLines.length > 1) {
                const lineText = event.currentTarget.textContent;

                const newLineText = `${lineText.slice(
                    0,
                    selectionRange.startOffset
                )}${pasteLines[0]}`;

                pasteLines[1] = `${lineText.slice(selectionRange.endOffset)}${
                    pasteLines[1]
                }`;

                onSave(newLineText);
                onMultilinePaste?.(pasteLines.slice(1));

                event.preventDefault();
            }
        },
        [onSave, onMultilinePaste]
    );

    return (
        <InlineInput
            initialValue={originalText.current}
            placeholder={placeholder}
            onInput={(value) => setText(value.currentTarget.textContent)}
            onSave={() => onSave(text)}
            onCancel={onCancel}
            onKeyDown={(event) => {
                if (event.key === 'Escape') onCancel();
            }}
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    disabled ? onCancel() : onSave(text);
                    event.preventDefault();
                }
            }}
            onPaste={onPaste}
        />
    );
};

