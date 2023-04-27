import { useEditorContext } from '@components/EditorContext';
import { PdfPreviewWindow } from '@components/SongbookPdfBuilder';
import { Song } from '@model/song';
import { removeAt } from '@utils/array';
import { isArray } from 'lodash';
import React, { useRef, useState } from 'react';
import { Button, List, Modal, ModalProps, Notification, toaster } from 'rsuite';
import { checkSongJsonFormat } from '../utils';
import './MakePdfModal.scss';
import { SongListItem } from './SongListItem';

const CLASS = 'make-pdf-modal';

export interface MakePdfModalProps
    extends Pick<ModalProps, 'open' | 'onClose'> {}

const message = (error: any) => (
    <Notification type={'error'} header={'Ошибка'} duration={30000} closable>
        Ошибка при открытии файла:
        <br />
        {error.toString()}
    </Notification>
);

export const MakePdfModal: React.FC<MakePdfModalProps> = ({
    onClose,
    ...modalProps
}) => {
    const api = window.api.window;
    const { value: song } = useEditorContext<Song>();

    const [pdfPreview, setPdfPreview] = useState<React.ReactNode>(null);
    const [songList, setSongList] = useState(
        !!song.title || !!song.author || !!song.songBody.length ? [song] : []
    );
    const ref = useRef(0);

    const handleSortEnd = ({
        oldIndex,
        newIndex,
    }: {
        oldIndex: number;
        newIndex: number;
    }) =>
        setSongList((prvData) => {
            const moveData = prvData.splice(oldIndex, 1);
            const newData = [...prvData];
            newData.splice(newIndex, 0, moveData[0]);
            return newData;
        });

    return (
        <>
            <Modal {...modalProps}>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Сборка песенника</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${CLASS}__body`}>
                    <span className={`${CLASS}__info`}>
                        Добавьте песни в формате ChordWriter в список при помощи
                        кнопки ниже и расположите в нужном порядке для вывода
                    </span>
                    {!!songList.length ? (
                        <List
                            pressDelay={100}
                            size={'sm'}
                            sortable
                            onSort={handleSortEnd}
                            className={`${CLASS}__list`}
                        >
                            {songList.map((song, index) => (
                                <SongListItem
                                    key={`${index}${song.title}`}
                                    index={index}
                                    {...song}
                                    onRemove={() =>
                                        setSongList((list) =>
                                            removeAt(list, index)
                                        )
                                    }
                                />
                            ))}
                        </List>
                    ) : (
                        <div className={`${CLASS}__list-placeholder`}>
                            <span>
                                Добавьте песни в список с помощью кнопки ниже
                            </span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() =>
                            api.openFiles().then((value) => {
                                const newSongs: Song[] = [];

                                if (isArray(value))
                                    (value as Song[]).forEach((song) => {
                                        try {
                                            checkSongJsonFormat(song);

                                            newSongs.push(song);
                                        } catch (error) {
                                            toaster.push(message(error), {
                                                placement: 'bottomEnd',
                                            });
                                        }
                                    });

                                setSongList([...songList, ...newSongs]);
                            })
                        }
                        className={`${CLASS}__button-left`}
                        size={'xs'}
                    >
                        Добавить
                    </Button>
                    <Button
                        onClick={() => {
                            ref.current = ref.current + 1;
                            setPdfPreview(
                                <PdfPreviewWindow
                                    key={ref.current}
                                    onClose={() => setPdfPreview(null)}
                                    songs={songList}
                                />
                            );
                        }}
                        disabled={!songList.length}
                        className={`${CLASS}__button-left`}
                        size={'xs'}
                    >
                        Вывести PDF
                    </Button>
                    <Button
                        onClick={onClose}
                        appearance="subtle"
                        size={'xs'}
                        className={`${CLASS}__button-close`}
                    >
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            {pdfPreview}
        </>
    );
};

