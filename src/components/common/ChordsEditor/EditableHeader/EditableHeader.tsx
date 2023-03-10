import { InlineInput } from '@common/ChordsEditor/InlineInput';
import { useEditorContext } from '@components/EditorContext';
import EditIcon from '@rsuite/icons/Edit';
import cn from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import './EditableHeader.scss';

const CLASS = 'editable-header';

export interface EditableHeaderProps {
    className?: string;
    path: string;
    alt?: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    size?: 'lg' | 'md';
}

const style: { [name: string]: React.CSSProperties } = {
    left: {},
    center: { justifyContent: 'center' },
    right: { flexDirection: 'row-reverse' },
};

export const EditableHeader: React.FC<EditableHeaderProps> = ({
    className,
    alt,
    align = 'center',
    path,
    bold = false,
    size = 'md',
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const { value, dispatch } = useEditorContext(path);

    const [text, setText] = useState(value || '');

    useEffect(() => {
        setText(value || '');
    }, [value, setText]);

    const handleSave = useCallback(() => {
        setIsEditing((value) => !value);

        dispatch({ type: 'setValue', payload: { path, value } });
    }, [dispatch, path, value]);

    const handleCancel = useCallback(() => {
        setText(value);
        setIsEditing(false);
    }, [setText, value, setIsEditing]);

    const isLarge = size === 'lg';

    return (
        <div className={CLASS} style={style[align]}>
            <div className={cn(`${CLASS}__container`, className)}>
                {isEditing ? (
                    <InlineInput
                        fontSize={isLarge && 20}
                        bold={bold}
                        iconSize={isLarge && 16}
                        className={`${CLASS}__field`}
                        withMargin
                        initialValue={value}
                        placeholder={alt}
                        onInput={(value) =>
                            setText(value.currentTarget.textContent)
                        }
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onKeyDown={(event) => {
                            if (isEditing)
                                switch (event.key) {
                                    case 'Enter':
                                        handleSave();
                                        break;
                                    case 'Escape':
                                        handleCancel();
                                        break;
                                }
                        }}
                    />
                ) : (
                    <div onClick={() => setIsEditing((value) => !value)}>
                        <span
                            className={cn(
                                `${CLASS}__text`,
                                {
                                    [`${CLASS}__text--placeholder`]: !text,
                                },
                                {
                                    [`${CLASS}__text--lg`]: size === 'lg',
                                },
                                {
                                    [`${CLASS}__text--bold`]: bold,
                                }
                            )}
                        >
                            {text || alt || 'введите текст'}
                        </span>
                        <EditIcon
                            className={cn(`${CLASS}__icon`, {
                                [`${CLASS}__icon--lg`]: size === 'lg',
                            })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

