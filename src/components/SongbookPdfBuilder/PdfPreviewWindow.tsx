import { Song } from '@model/song';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { bodyStyle } from './bodyStyle';
import { SongbookPdfBuilder } from './SongbookPdfBuilder';

export interface PdfPreviewWindowProps {
    onClose?: () => void;
    song: Song;
}

// ! TODO: приделать onClose
export const PdfPreviewWindow: React.FC<PdfPreviewWindowProps> = ({ song }) => {
    const api = window.api.window;
    const childWindow = useMemo(
        () => window.open('', 'modal', 'width=595, height=840'),
        []
    );
    const [buttonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode(bodyStyle));
        childWindow.document.head.appendChild(css);
    }, []);
    api.openDevTools();

    return createPortal(
        <>
            <div
                style={{
                    backgroundColor: 'gray',
                    borderBottom: buttonVisible ? '1px solid darkgray' : 'none',
                    height: buttonVisible ? '30px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.5s ease-in-out',
                }}
            >
                <button
                    style={{
                        height: '20px',
                        marginLeft: '16px',
                        opacity: buttonVisible ? 1 : 0,
                    }}
                    onClick={() => {
                        setButtonVisible(false);
                        api.print();
                    }}
                >
                    Сохранить
                </button>
            </div>
            <SongbookPdfBuilder song={song} />
        </>,
        childWindow.document.body
    );
};

