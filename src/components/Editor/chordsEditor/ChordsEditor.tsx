import React, { useEffect, useState } from 'react';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String } from './components';
import { SongPart } from './SongPart';
import { EditorContextProvider } from './EditorContext';
import ListIcon from '@rsuite/icons/List';

const CLASS = 'chords-editor';

// [TEMP] пока не добавится открытие и создание новых
const song = seventeen;

export const ChordsEditor: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(true);

    const buttons: ButtonInfo[] = [
        {
            title: 'Новая',
            disabled: true,
        },
        {
            title: 'Открыть',
            disabled: true,
        },
        {
            title: 'Сохранить',
            disabled: true,
        },
        {
            icon: <ListIcon />,
            active: structureVisible,
            title: 'Структура',
            onClick: () => setStructureVisible((value) => !value),
        },
    ];

    return (
        <>
            <PageHeader buttons={buttons} />
            <PageContent className={CLASS}>
                <EditorContextProvider song={song}>
                    <String
                        size={'lg'}
                        alt={'Добавьте название'}
                        bold
                        path={'title'}
                    />
                    <String alt={'Добавьте автора'} path={'author'} />
                    <div className={`${CLASS}__text`}>
                        {song.songBody.map((_, index) => (
                            <SongPart
                                key={`${index}`}
                                isStructureVisible={structureVisible}
                                partsArrayPath={'songBody'}
                                partIndex={index}
                            />
                        ))}
                    </div>
                </EditorContextProvider>
            </PageContent>
        </>
    );
};
