import {
    EditableHeader,
    IconButtonCluster,
    IconButtonInfo,
} from '@common/ChordsEditor';
import { useEditorContext } from '@components/EditorContext';
import MoveDownIcon from '@rsuite/icons/MoveDown';
import MoveUpIcon from '@rsuite/icons/MoveUp';
import TrashIcon from '@rsuite/icons/Trash';
import cn from 'classnames';
import React, { useMemo } from 'react';
import { InputPicker } from 'rsuite';
import './PartHeader.scss';
import { PartContentType } from './types';

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
                Icon: MoveUpIcon,
                title: 'Добавить часть выше',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: partsArrayPath,
                            index: partIndex,
                            value: { lines: [] },
                        },
                    }),
            },
            {
                Icon: MoveDownIcon,
                title: 'Добавить часть ниже',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: partsArrayPath,
                            index: partIndex + 1,
                            value: { lines: [] },
                        },
                    }),
            },
        ],
        [dispatch, partIndex, partsArrayPath]
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

