import { EditableHeader } from '@common/ChordsEditor';
import { PageContent } from '@common/PageContent';
import { ElementInfo, PageHeader } from '@common/PageHeader';
import {
    EditorContextProvider,
    useEditorContext,
} from '@components/EditorContext';
import { LyricsPartType, SongBody } from '@model/song';
import ListIcon from '@rsuite/icons/List';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import { Button, Notification, toaster } from 'rsuite';
import './ChordsEditor.scss';
import { MakePdfModal } from './MakePdfModal';
import { MonospacedModal } from './MonospacedModal';
import { SongPart } from './SongPart';
import { checkSongJsonFormat, getNewSong } from './utils';

const CLASS = 'chords-editor';

const EditorContent: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(false);
    const [monospacedModalVisible, setMonospacedModalVisible] = useState(false);
    const [makePdfModalVisible, setMakePdfModalVisible] = useState(false);
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

    const buttons: ElementInfo[] = useMemo(
        () => [
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
                buttons: [
                    {
                        title: 'В файл...',
                        info: 'Сохранить песню в *.json файл',
                        onClick: () => {
                            api.saveToNewFile(JSON.stringify(value, null, 4));
                        },
                    },
                    'Divider',
                    {
                        title: 'В моноширинную запись',
                        info: 'Вывести текущую песню в моноширинном формате',
                        onClick: () => setMonospacedModalVisible(true),
                    },
                    'Divider',
                    {
                        title: 'Сборка PDF',
                        info: 'Сохранить текущую песню или собрать песенник в формате PDF',
                        onClick: () => setMakePdfModalVisible(true),
                    },
                ],
            },
            {
                icon: <ListIcon />,
                active: structureVisible,
                title: 'Структура',
                info: 'Отобразить структуру (отдельные части и их типы) и элементы редактирования структуры песни',
                onClick: () => setStructureVisible((value) => !value),
            },
        ],
        [api, dispatch, structureVisible, value]
    );

    return (
        <>
            <PageHeader elements={buttons} />
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
                                onSplitPart={(partIndex, lineIndex) => {
                                    const oldPart = songBody[
                                        partIndex
                                    ] as LyricsPartType;

                                    if (!oldPart || !oldPart.lines?.[lineIndex])
                                        return;

                                    dispatch({
                                        type: 'setValue',
                                        payload: {
                                            path: 'songBody',
                                            value: [
                                                ...songBody.slice(0, partIndex),
                                                {
                                                    ...oldPart,
                                                    lines: oldPart.lines.slice(
                                                        0,
                                                        lineIndex
                                                    ),
                                                },
                                                {
                                                    lines: oldPart.lines.slice(
                                                        lineIndex
                                                    ),
                                                },
                                                ...songBody.slice(
                                                    partIndex + 1
                                                ),
                                            ],
                                        },
                                    });
                                }}
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
            <MonospacedModal
                open={monospacedModalVisible}
                onClose={() => setMonospacedModalVisible(false)}
            />
            {makePdfModalVisible && (
                <MakePdfModal
                    open={makePdfModalVisible}
                    onClose={() => setMakePdfModalVisible(false)}
                />
            )}
        </>
    );
};

export const ChordsEditor: React.FC = () => (
    <EditorContextProvider song={getNewSong()}>
        <EditorContent />
    </EditorContextProvider>
);

