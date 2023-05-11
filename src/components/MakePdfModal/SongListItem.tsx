import TrashIcon from '@rsuite/icons/Trash';
import React from 'react';
import { IconButton, List } from 'rsuite';
import './SongListItem.scss';

const CLASS = 'song-list-item';

export interface SongListItemProps {
    index: number;
    author: string;
    title: string;
    onRemove: () => void;
}

export const SongListItem: React.FC<SongListItemProps> = ({
    author,
    title,
    index,
    onRemove,
}) => {
    const name = `${index + 1}. ${author}${!!author ? ' - ' : ''}${
        title || 'Без названия'
    }`;

    return (
        <List.Item index={index}>
            <div className={CLASS}>
                <span className={`${CLASS}__name`}>{name}</span>
                <IconButton
                    className={`${CLASS}__remove-button`}
                    icon={<TrashIcon />}
                    size={'xs'}
                    onClick={onRemove}
                />
            </div>
        </List.Item>
    );
};

