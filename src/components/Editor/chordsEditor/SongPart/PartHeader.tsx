import React, { useCallback, useMemo } from 'react';
import { PartContentType } from './types';
import './PartHeader.scss';
import cn from 'classnames';
import {
    IconButtonCluster,
    IconButtonInfo,
    EditableHeader,
} from '../components';
import TrashIcon from '@rsuite/icons/Trash';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { InputPicker } from 'rsuite';
import { useEditorContext } from '../EditorContext';

const CLASS = 'part-header';

export interface PartHeaderProps {
    partsArrayPath: string;
    partIndex: number;
    showControls?: boolean;
    title?: string;
    type?: PartContentType;
    className?: string;
    onSetType: (type: PartContentType) => void;
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
    onSetType,
}) => {
    const { dispatch } = useEditorContext();

    const buttons: IconButtonInfo[] = useMemo(
        () => [
            {
                Icon: TrashIcon,
                title: 'Удалить часть',
                onClick: () =>
                    dispatch({
                        type: 'removeArrayValue',
                        payload: { path: partsArrayPath, index: partIndex },
                    }),
                fill: 'firebrick',
            },
            {
                Icon: ArrowUpLineIcon,
                title: 'Добавить часть выше',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: partsArrayPath,
                            index: partIndex,
                            value: {},
                        },
                    }),
            },
            {
                Icon: ArrowDownLineIcon,
                title: 'Добавить часть ниже',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: partsArrayPath,
                            index: partIndex + 1,
                            value: {},
                        },
                    }),
            },
        ],
        [dispatch]
    );

    return (
        <div
            className={cn(
                { [`${CLASS}--visible`]: title || showControls },
                className
            )}
        >
            {showControls ? (
                <div className={`${CLASS}__controls-block`}>
                    <div>
                        <EditableHeader
                            path={`${partsArrayPath}[${partIndex}].title`}
                            className={`${CLASS}__editable_title`}
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
                            disabledItemValues={['tab']}
                            size={'xs'}
                        />
                    </div>
                    <IconButtonCluster
                        buttons={buttons}
                        className={`${CLASS}__buttons-cluster`}
                    />
                </div>
            ) : (
                title && (
                    <span className={`${CLASS}__regular-title`}>{title}</span>
                )
            )}
        </div>
    );
};
