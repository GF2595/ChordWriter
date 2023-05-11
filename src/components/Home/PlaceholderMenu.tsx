import React from 'react';
import { Button } from 'rsuite';
import './PlaceholderMenu.scss';

const CLASS = 'placeholder-menu';

export interface PlaceholderMenuProps {
    onCreateSong: () => void;
    onOpenSong: () => void;
    onMakePdf: () => void;
}

export const PlaceholderMenu: React.FC<PlaceholderMenuProps> = ({
    onCreateSong,
    onMakePdf,
    onOpenSong,
}) => {
    return (
        <div className={CLASS}>
            <Button className={`${CLASS}__button`} onClick={onCreateSong}>
                Создать песню
            </Button>
            <Button className={`${CLASS}__button`} onClick={onOpenSong}>
                Открыть песню
            </Button>
            <Button className={`${CLASS}__button`} onClick={onMakePdf}>
                Сборка песенника в PDF
            </Button>
        </div>
    );
};

