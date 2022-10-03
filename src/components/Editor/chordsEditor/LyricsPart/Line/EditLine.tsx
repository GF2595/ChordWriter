import { IconButton } from '@components/common/IconButton';
import { SongLine } from '@model/song';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import React, { useRef, useState } from 'react';
import cn from 'classnames';
import './EditLine.scss';

const CLASS = 'edit-line';

export interface EditLineProps {
    line: SongLine | string;
    placeholder?: string;
    noMargin?: boolean;
    canSaveEmpty?: boolean;
    onSave: (text: string) => void;
    onCancel: () => void;
}

export const EditLine: React.FC<EditLineProps> = ({
    line,
    noMargin,
    canSaveEmpty,
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
        <>
            <span
                role="textbox"
                contentEditable
                onInput={(value) => setText(value.currentTarget.textContent)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') onCancel();
                }}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        disabled ? onCancel() : onSave(text);
                        event.preventDefault();
                    }
                }}
                className={cn(CLASS, { [`${CLASS}--no-margin`]: noMargin })}
                suppressContentEditableWarning={true}
            >
                {originalText.current}
            </span>
            <IconButton
                Icon={CheckIcon}
                disabled={disabled}
                title={'Сохранить изменения'}
                onClick={() => onSave(text)}
            />
            <IconButton
                Icon={CloseIcon}
                color={'firebrick'}
                title={'Отменить изменения'}
                onClick={onCancel}
            />
        </>
    );
};
