import { IconButton } from '@components/common/IconButton';
import { SongLine } from '@model/song';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import React, { useRef, useState } from 'react';
import './EditLine.scss';

const CLASS = 'edit-line';

export interface EditLineProps {
    line: SongLine;
    onSave: (text: string) => void;
    onCancel: () => void;
}

export const EditLine: React.FC<EditLineProps> = ({
    line,
    onSave,
    onCancel,
}) => {
    const originalText = useRef(line.lyrics.join(''));
    const text = useRef(originalText.current);

    const disabled = originalText.current.localeCompare(text.current) === 0;

    return (
        <>
            <span
                role="textbox"
                contentEditable
                onInput={(value) => text.current = value.currentTarget.textContent}
                onKeyDownCapture={(value) => value.key === 'Enter' && (disabled ? onCancel() : onSave(text.current))}
                className={CLASS}
                suppressContentEditableWarning={true}
            >
                {originalText}
            </span>
            <IconButton Icon={CheckIcon} disabled={disabled} onClick={() => onSave(text.current)} />
            <IconButton Icon={CloseIcon} color={'firebrick'} onClick={onCancel} />
        </>
    );
};
