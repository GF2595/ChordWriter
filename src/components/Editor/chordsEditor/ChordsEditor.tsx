import { EditableHeader } from '@common/ChordsEditor';
import { PageContent } from '@common/PageContent';
import { ElementInfo, PageHeader } from '@common/PageHeader';
import {
    EditorContextProvider,
    useEditorContext,
} from '@components/EditorContext';
import { SongbookPdfBuilder } from '@components/SongbookPdfBuilder';
import { SongBody } from '@model/song';
import ListIcon from '@rsuite/icons/List';
import { get } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Notification, toaster } from 'rsuite';
import './ChordsEditor.scss';
import { MonospacedModal } from './MonospacedModal';
import { SongPart } from './SongPart';
import { checkSongJsonFormat, getNewSong, _getNewSong } from './utils';

const CLASS = 'chords-editor';

function copyStyles(source: Document, target: Document) {
    Array.from(
        source.querySelectorAll('link[rel="stylesheet"], style')
    ).forEach((link) => {
        target.head.appendChild(link.cloneNode(true));
    });
}

// ! TODO: приделать onClose
const PdfPreview: React.FC<{ onClose?: () => void }> = ({
    children,
    onClose: _,
}) => {
    const api = window.api.window;
    const childWindow = useMemo(
        () => window.open('', 'modal', 'width=595, height=840'),
        []
    );
    const [buttonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode('section {margin-top: 24px;}'));
        childWindow.document.head.appendChild(css);
    }, []);
    api.openDevTools();

    return createPortal(
        <>
            {buttonVisible && (
                <Button
                    onClick={() => {
                        // ! TODO: кнопка не возвращается
                        setButtonVisible(false);
                        api.print();
                    }}
                >
                    print
                </Button>
            )}
            {children}
        </>,
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
                        // ! TODO: вернуть
                        payload: { value: _getNewSong() },
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
                ],
            },
            // ! TODO: вернуть на место
            {
                title: 'В PDF-файл',
                onClick: () => {
                    setPdfPreview(
                        <PdfPreview onClose={() => setPdfPreview(undefined)}>
                            <SongbookPdfBuilder song={value} />
                        </PdfPreview>
                    );
                },
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

