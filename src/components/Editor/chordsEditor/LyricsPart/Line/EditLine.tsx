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
    const [text, setText] = useState(originalText.current);

    const disabled = !originalText.current.localeCompare(text) || !text.length;

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
                className={CLASS}
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
