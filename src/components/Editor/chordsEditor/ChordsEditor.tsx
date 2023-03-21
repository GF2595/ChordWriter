import { EditableHeader } from '@common/ChordsEditor';
import { PageContent } from '@common/PageContent';
import { ElementInfo, PageHeader } from '@common/PageHeader';
import {
    EditorContextProvider,
    useEditorContext,
} from '@components/EditorContext';
import { SongBody } from '@model/song';
import ListIcon from '@rsuite/icons/List';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Notification, toaster } from 'rsuite';
import './ChordsEditor.scss';
import { MonospacedModal } from './MonospacedModal';
import { SongPart } from './SongPart';
import { checkSongJsonFormat, getNewSong } from './utils';

const CLASS = 'chords-editor';

const PdfPreview: React.FC = ({ children }) => {
    const api = window.api.window;
    const childWindow = window.open('', 'modal');
    const [buttonVisible, setButtonVisible] = useState(true);

    // childWindow.document.write('<div id="root"></div>');

    return createPortal(
        <div>
            {buttonVisible && (
                <Button
                    onClick={() => {
                        setButtonVisible(false);
                        api.print();
                    }}
                >
                    print
                </Button>
            )}
            {children}
            <h1>Название</h1>
            <h2>Автор</h2>
        </div>,
        childWindow.document.body
    );
};

const EditorContent: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(false);
    const [monospacedModalVisible, setMonospacedModalVisible] = useState(false);
    const { value, dispatch } = useEditorContext();
    const api = window.api.window;
    const [pdfPreview, setPdfPreview] = useState<React.ReactNode>(null);

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
                        onClick: () => setMonospacedModalVisible(true),
                    },
                    {
                        title: 'В PDF-файл',
                        onClick: () => {
                            setPdfPreview(<PdfPreview />);
                            // childWindow;
                            // api.showPdf(value);
                            // api.print();
                        },
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
            {pdfPreview}
        </>
    );
};

export const ChordsEditor: React.FC = () => (
    <EditorContextProvider song={getNewSong()}>
        <EditorContent />
    </EditorContextProvider>
);

