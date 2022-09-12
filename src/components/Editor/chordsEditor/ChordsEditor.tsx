import React from 'react';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String } from './components';
import { SongPart } from './SongPart';
import { EditorContextProvider } from './EditorContext';

const CLASS = 'chords-editor';

// [TEMP] пока не добавится открытие и создание новых
const song = seventeen;

export const ChordsEditor: React.FC = () => {
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
            // icon: (),
            title: 'Сохранить',
            disabled: true,
        },
        {
            title: 'Повтор',
            disabled: true,
        },
    ];

    return (
        <>
            <PageHeader buttons={buttons} />
            <PageContent className={CLASS}>
                <EditorContextProvider song={song}>
                    <String bold path={'title'} />
                    <String path={'author'} />
                    <div className={`${CLASS}__text`}>
                        {song.songBody.map((_, index) => (
                            <SongPart
                                key={`${index}`}
                                path={`songBody[${index}]`}
                            />
                        ))}
                    </div>
                </EditorContextProvider>
            </PageContent>
        </>
    );
};
