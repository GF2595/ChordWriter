import { IconButton } from '@common/IconButton';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import React, { CSSProperties, HTMLAttributes } from 'react';
import './InlineInput.scss';

const CLASS = 'inline-input';

export interface InlineInputProps
    extends Pick<
        HTMLAttributes<HTMLSpanElement>,
        'onKeyDown' | 'onInput' | 'onKeyPress' | 'onPaste'
    > {
    initialValue: string[] | string;
    className?: string;
    placeholder?: string;
    canSaveEmpty?: boolean;
    disabled?: boolean;
    fontSize?: number;
    iconSize?: number;
    bold?: boolean;
    withMargin?: boolean;
    onSave: () => void;
    onCancel: () => void;
}

export const InlineInput: React.FC<InlineInputProps> = ({
    initialValue,
    canSaveEmpty,
    onSave,
    onCancel,
    className,
    disabled,
    fontSize,
    iconSize = 14,
    bold,
    withMargin,
    ...spanProps
}) => {
    const fieldStyle: CSSProperties = {
        fontSize: !!fontSize ? `${fontSize}px` : undefined,
        fontWeight: !!bold ? 'bold' : undefined,
        marginLeft: !!withMargin ? `${iconSize * 2}px` : undefined,
    };

    const iconSide = iconSize ? `${iconSize}px` : undefined;

    return (
        <div className={className}>
            <span
                style={fieldStyle}
                role="textbox"
                contentEditable
                className={CLASS}
                suppressContentEditableWarning={true}
                placeholder={'Введите текст'}
                {...spanProps}
            >
                {initialValue}
            </span>
            <IconButton
                width={iconSide}
                height={iconSide}
                Icon={CheckIcon}
                disabled={disabled}
                title={'Сохранить изменения'}
                onClick={onSave}
            />
            <IconButton
                width={iconSide}
                height={iconSide}
                Icon={CloseIcon}
                color={'firebrick'}
                title={'Отменить изменения'}
                onClick={onCancel}
            />
        </div>
    );
};

