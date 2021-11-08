import React from 'react';
import { ChordType } from '@model/song';
import cn from 'classnames';
import './Chord.scss';
import { ChordEditPopup } from './ChordEditPopup';
import { Whisper } from 'rsuite';

const CLASS = 'chord';

export interface ChordProps {
    chord: ChordType;
    className?: string;
    onEdit?: (chord: ChordType) => void;
    onRemove?: () => void;
    // popover?: any;
}

export const Chord: React.FC<ChordProps> = ({
    chord: chordBase,
    className,
    onEdit,
    onRemove,
}) => {
    // if (!chord.length) return <div style={{ height: '1em' }} />;
    const { chord, mod } = chordBase;

    const whisperRef = React.useRef<any>();

    const chordContent = (
        <span
            className={cn(`${CLASS}`, className)}
            style={{
                fontWeight: 'bolder',
                paddingRight: 4,
                whiteSpace: 'pre',
            }}
        >
            {chord.length ? chord : ' '}
            <sub>{mod}</sub>
        </span>
    );

    return !onEdit || !onRemove ? (
        chordContent
    ) : (
        <Whisper
            ref={whisperRef}
            placement={'top'}
            trigger={'click'}
            speaker={
                <ChordEditPopup
                    chord={chordBase}
                    onSubmit={(chord) => {
                        onEdit(chord);
                        whisperRef.current.close();
                    }}
                    onRemove={onRemove}
                />
            }
        >
            {chordContent}
        </Whisper>
    );
};
