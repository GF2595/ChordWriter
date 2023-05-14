import React from 'react';
import { Button } from 'rsuite';
import './PlaceholderMenu.scss';

const CLASS = 'placeholder-menu';

export interface PlaceholderMenuProps {
    onCreateSong: () => void;
    onOpenSong: () => void;
    onImportText: () => void;
    onMakePdf: () => void;
}

export const PlaceholderMenu: React.FC<PlaceholderMenuProps> = ({
    onCreateSong,
    onMakePdf,
    onOpenSong,
    onImportText,
}) => {
    return (
        <div className={CLASS}>
            <Button onClick={onCreateSong}>Создать песню</Button>
            <Button onClick={onOpenSong}>Открыть песню</Button>
            <Button onClick={onImportText}>Импорт из текстовой записи</Button>
            <Button onClick={onMakePdf}>Сборка песенника в PDF</Button>
        </div>
    );
};

