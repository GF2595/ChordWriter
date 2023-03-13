import { useEditorContext } from '@components/EditorContext';
import { Song } from '@model/song';
import React from 'react';
import { Button, Input, Modal, ModalProps } from 'rsuite';
import { getMonospacedText } from './utils';

export interface MonospacedModalProps
    extends Pick<ModalProps, 'open' | 'onClose'> {}

export const MonospacedModal: React.FC<MonospacedModalProps> = ({
    ...modalProps
}) => {
    const { value: song } = useEditorContext<Song>();
    const { onClose, open } = modalProps;

    const text = open ? getMonospacedText(song) : '';

    return (
        <Modal {...modalProps}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Моноширинная запись</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    readOnly
                    as="textarea"
                    rows={15}
                    style={{ resize: 'none', fontFamily: 'monospace' }}
                    value={text}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} appearance="subtle">
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
