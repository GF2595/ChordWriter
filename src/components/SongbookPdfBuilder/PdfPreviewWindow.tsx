import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { bodyStyle } from './bodyStyle';
import {
    SongbookPdfBuilder,
    SongbookPdfBuilderProps,
} from './SongbookPdfBuilder';

export interface PdfPreviewWindowProps extends SongbookPdfBuilderProps {
    onClose?: () => void;
}

export const PdfPreviewWindow: React.FC<PdfPreviewWindowProps> = ({
    ...builderProps
}) => {
    const api = window.api.window;
    const childWindow = useMemo(
        () =>
            window.open(
                '',
                'modal',
                'width=794, resizable=false, fullscreenable=false'
            ),
        []
    );
    const [buttonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode(bodyStyle));
        childWindow.document.head.appendChild(css);
    }, []);

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
            <SongbookPdfBuilder {...builderProps} />
        </>,
        childWindow.document.body
    );
};

