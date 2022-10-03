import React, { useState } from 'react';
import { PageContent } from '@components/common/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String } from './components';
import { SongPart } from './SongPart';
import { EditorContextProvider, useEditorContext } from './EditorContext';
import ListIcon from '@rsuite/icons/List';
import { Song, SongBody } from '@model/song';
import { Button, Notification, toaster } from 'rsuite';
import { checkSongJsonFormat, getNewSong } from './utils';
import { get } from 'lodash';

const CLASS = 'chords-editor';

const EditorContent: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(false);
    const { value, dispatch } = useEditorContext();
    const api = window.api.window;

    const message = (error: any) => (
        <Notification
            type={'error'}
            header={'Ошибка'}
            duration={30000}
            closable
        >
            Ошибка при открытии файла:
            <br />
            {error.toString()}
        </Notification>
    );

    const songBody = get(value, 'songBody') as SongBody;

    const buttons: ButtonInfo[] = [
        {
            title: 'Новая',
            onClick: () => {
                dispatch({
                    type: 'setValue',
                    payload: { value: getNewSong() },
                });
            },
        },
        {
            title: 'Открыть',
            onClick: () => {
                api.openFile()
                    .then((file) => {
                        checkSongJsonFormat(file);

                        dispatch({
                            type: 'setValue',
                            payload: { value: file },
                        });
                    })
                    .catch((error) => {
                        toaster.push(message(error), {
                            placement: 'bottomEnd',
                        });
                    });
            },
        },
        {
            title: 'Сохранить',
            onClick: () => {
                api.saveToNewFile(JSON.stringify(value, null, 4));
            },
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
                <String
                    size={'lg'}
                    alt={'Добавьте название'}
                    bold
                    path={'title'}
                />
                <String alt={'Добавьте автора'} path={'author'} />
                <div className={`${CLASS}__text`}>
                    {songBody.length ? (
                        songBody.map((part, index) => (
                            <SongPart
                                key={`${index}_${part.title}`}
                                isStructureVisible={structureVisible}
                                partsArrayPath={'songBody'}
                                partIndex={index}
                            />
                        ))
                    ) : (
                        <Button
                            onClick={() => {
                                dispatch({
                                    type: 'addArrayValue',
                                    payload: { path: 'songBody', value: {} },
                                });
                                setStructureVisible(true);
                            }}
                        >
                            Добавить часть
                        </Button>
                    )}
                </div>
            </PageContent>
        </>
    );
};

export const ChordsEditor: React.FC = () => (
    <EditorContextProvider song={getNewSong()}>
        <EditorContent />
    </EditorContextProvider>
);
