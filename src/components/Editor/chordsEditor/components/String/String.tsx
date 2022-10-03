import React, { useCallback, useEffect, useState } from 'react';
import EditIcon from '@rsuite/icons/Edit';
import CheckIcon from '@rsuite/icons/Check';
import cn from 'classnames';
import './String.scss';
import { Input, InputGroup } from 'rsuite';
import { useEditorContext } from '../../EditorContext';
import { get } from 'lodash';

const CLASS = 'string';

export interface StringProps {
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

export const String: React.FC<StringProps> = ({
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

    const onEdit = (value: string) =>
        dispatch({ type: 'setValue', payload: { path, value } });

    const containerStyle: React.CSSProperties = {
        fontWeight: bold ? 'bolder' : undefined,
        fontSize: size === 'lg' ? 20 : undefined,
    };

    const handleSave = useCallback(() => {
        setIsEditing((value) => !value);
        onEdit(text);
    }, [onEdit, setIsEditing, text]);

    return (
        <div className={CLASS} style={style[align]}>
            <div
                className={cn(`${CLASS}__container`, className)}
                style={containerStyle}
                onKeyDown={(event) => {
                    if (isEditing && event.key === 'Enter') handleSave();
                }}
            >
                {isEditing ? (
                    <>
                        <InputGroup>
                            <Input
                                value={text}
                                size={size === 'md' ? 'sm' : 'xs'}
                                onChange={(value) => setText(`${value}`)}
                            />
                            <InputGroup.Button onClick={handleSave}>
                                <CheckIcon />
                            </InputGroup.Button>
                        </InputGroup>
                    </>
                ) : (
                    <>
                        <span
                            className={cn(`${CLASS}__text`, {
                                [`${CLASS}__text--placeholder`]: !text,
                            })}
                        >
                            {text || alt || 'введите текст'}
                        </span>
                        <EditIcon
                            className={`${CLASS}__icon`}
                            onClick={() => setIsEditing((value) => !value)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
