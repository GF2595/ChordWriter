import React, { useCallback, useState } from 'react';
import EditIcon from '@rsuite/icons/Edit';
import CheckIcon from '@rsuite/icons/Check';
import cn from 'classnames';
import './String.scss';
import { Input, InputGroup } from 'rsuite';
import { useEditorContext } from '../EditorContext';
import { get } from 'lodash';

const CLASS = 'string';

export interface StringProps {
    className?: string;
    path: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
}

const style: { [name: string]: React.CSSProperties } = {
    left: {},
    center: { justifyContent: 'center' },
    right: { flexDirection: 'row-reverse' },
};

export const String: React.FC<StringProps> = ({
    className,
    align = 'center',
    path,
    bold,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { song, dispatch } = useEditorContext();
    const value = get(song, path);
    const onEdit = (value: string) =>
        dispatch({ type: 'setValue', payload: { path, value } });
    const [text, setText] = useState(value);

    const containerStyle: React.CSSProperties = {
        fontWeight: bold ? 'bolder' : undefined,
        fontSize: bold ? 20 : undefined,
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
                                size={bold ? 'sm' : 'xs'}
                                onChange={(value) => setText(`${value}`)}
                            />
                            <InputGroup.Button onClick={handleSave}>
                                <CheckIcon />
                            </InputGroup.Button>
                        </InputGroup>
                    </>
                ) : (
                    <>
                        <span className={`${CLASS}__text`}>{text}</span>
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
