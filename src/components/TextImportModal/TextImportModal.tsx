import { useEditorContext } from '@components/EditorContext';
import { isArray } from 'lodash';
import React, { useState } from 'react';
import { Button, Input, Modal, ModalProps } from 'rsuite';
import './TextImportModal.scss';
import { parseTextSong } from './utils';

const CLASS = 'text-import-modal';

export interface TextImportModalProps
    extends Pick<ModalProps, 'open' | 'onClose'> {}

export const TextImportModal: React.FC<TextImportModalProps> = ({
    onClose,
    ...modalProps
}) => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const { dispatch } = useEditorContext();

    return (
        <Modal {...modalProps}>
            <Modal.Header>
                <Modal.Title>Импорт из текстового формата</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    as="textarea"
                    rows={15}
                    placeholder="Вставьте сюда текст песни"
                    onChange={(value) =>
                        setTextAreaValue(
                            isArray(value) ? value.join('\n') : `${value}`
                        )
                    }
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className={`${CLASS}__button-left`}
                    size={'xs'}
                    onClick={(event) => {
                        dispatch({
                            type: 'setValue',
                            payload: {
                                value: parseTextSong(textAreaValue),
                            },
                        });

                        onClose(event);
                    }}
                >
                    Импорт
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
    );
};

