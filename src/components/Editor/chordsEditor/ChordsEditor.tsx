import React, { useState } from 'react';
import { PageContent } from '@common/PageContent';
import { PageHeader, ButtonInfo } from '@common/PageHeader';
import './ChordsEditor.scss';
import { SongPart } from './SongPart';
import { EditorContextProvider, useEditorContext } from '@components/EditorContext';
import ListIcon from '@rsuite/icons/List';
import { SongBody } from '@model/song';
import { Button, Notification, toaster } from 'rsuite';
import { checkSongJsonFormat, getNewSong } from './utils';
import { get } from 'lodash';
import { EditableHeader } from '@common/ChordsEditor';

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
            info: 'Открыть редактор новой песни',
            onClick: () => {
                dispatch({
                    type: 'setValue',
                    payload: { value: getNewSong() },
                });
            },
        },
        {
            title: 'Открыть',
            info: 'Открыть *.json файл с сохранённой песней',
            onClick: () => {
                api.openFile()
                    .then((file) => {
                        if (!file) return;

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
            info: 'Сохранить песню в *.json файл',
            onClick: () => {
                api.saveToNewFile(JSON.stringify(value, null, 4));
            },
        },
        {
            icon: <ListIcon />,
            active: structureVisible,
            title: 'Структура',
            info: 'Отобразить структуру (отдельные части и их типы) и элементы редактирования структуры песни',
            onClick: () => setStructureVisible((value) => !value),
        },
    ];

    return (
        <>
            <PageHeader buttons={buttons} />
            <PageContent className={CLASS}>
                <EditableHeader
                    size={'lg'}
                    alt={'Добавьте название'}
                    bold
                    path={'title'}
                />
                <EditableHeader alt={'Добавьте автора'} path={'author'} />
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

