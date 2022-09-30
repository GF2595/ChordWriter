import React from 'react';
import { PartContentType } from './types';
import './PartHeader.scss';
import cn from 'classnames';
import { String } from '../components';
import { InputPicker } from 'rsuite';

const CLASS = 'part-header';

export interface PartHeaderProps {
    partsArrayPath: string;
    partIndex: number;
    showControls?: boolean;
    title?: string;
    type?: PartContentType;
    className?: string;
    onSetType: (type: PartContentType) => void;
    onSetTitle: (title: string) => void;
    onAddBelow: () => void;
    onAddAbove: () => void;
    onDelete: () => void;
}

const typePickerData: { label: string; value: PartContentType | null }[] = [
    {
        label: 'Текст',
        value: 'lyrics',
    },
    {
        label: 'Аккорды',
        value: 'chords',
    },
    {
        label: 'Табулатура',
        value: 'tab',
    },
    {
        label: 'Пустая',
        value: null,
    },
];

export const PartHeader: React.FC<PartHeaderProps> = ({
    showControls,
    title,
    partsArrayPath,
    partIndex,
    type,
    className,
    onAddAbove,
    onAddBelow,
    onDelete,
    onSetTitle,
    onSetType,
}) => {
    return (
        <div
            className={cn(
                { [`${CLASS}--visible`]: title || showControls },
                className
            )}
        >
            {showControls ? (
                <>
                    <div>
                        <String
                            path={`${partsArrayPath}[${partIndex}].title`}
                            bold
                            size={'md'}
                            alt="Без названия"
                            align={'left'}
                        />
                        <InputPicker
                            searchable={false}
                            menuClassName={`${CLASS}__picker-menu`}
                            className={`${CLASS}__type-picker`}
                            cleanable={false}
                            data={typePickerData}
                            value={type}
                            onSelect={onSetType}
                            size={'xs'}
                        />
                    </div>
                </>
            ) : (
                title && (
                    <span style={{ fontWeight: 'bolder', paddingLeft: '8px' }}>
                        {title}
                    </span>
                )
            )}
        </div>
    );
};
