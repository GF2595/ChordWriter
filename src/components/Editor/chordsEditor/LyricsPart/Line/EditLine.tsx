import { SongLine } from '@model/song';
import React, { useRef, useState } from 'react';
import './EditLine.scss';
import { InlineInput } from '../../components';

export interface EditLineProps {
    line: SongLine | string;
    placeholder?: string;
    canSaveEmpty?: boolean;
    onSave: (text: string) => void;
    onCancel: () => void;
}

export const EditLine: React.FC<EditLineProps> = ({
    line,
    canSaveEmpty,
    placeholder,
    onSave,
    onCancel,
}) => {
    const originalText = useRef(
        typeof line === 'string' ? line : line.lyrics.join('')
    );
    const [text, setText] = useState(originalText.current);

    const disabled =
        !originalText.current.localeCompare(text) ||
        (!canSaveEmpty && !text.length);

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
            onPaste={(event) => {
                console.log(event.clipboardData.getData('text'));
                const selectionRange = window.getSelection().getRangeAt(0);
                console.log(selectionRange.startOffset);
                console.log(selectionRange.endOffset);
                event.preventDefault();
            }}
        />
    );
};

