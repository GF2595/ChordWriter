import { ChordEditPopup } from '@common/ChordsEditor/ChordEditPopup';
import { ChordType } from '@model/song';
import cn from 'classnames';
import React, { useRef } from 'react';
import { Whisper } from 'rsuite';
import './Chord.scss';

const CLASS = 'chord';

export interface ChordProps {
    chord: ChordType;
    className?: string;
    absolutePositionedMod?: boolean;
    onEdit?: (chord: ChordType) => void;
    onRemove?: () => void;
}

export const Chord: React.FC<ChordProps> = ({
    chord: chordBase,
    className,
    absolutePositionedMod,
    onEdit,
    onRemove,
}) => {
    const { chord, mod } = chordBase;

    const whisperRef = useRef<{ close: () => void }>();

    const chordContent = (
        <span
            className={cn(
                CLASS,
                { [`${CLASS}-clickable`]: !!onEdit && !!onRemove },
                className
            )}
            style={{
                fontWeight: 'bolder',
                whiteSpace: 'pre',
            }}
        >
            {chord.length ? chord : ' '}
            <sub
                className={cn({
                    [`${CLASS}__absolute-mod`]: absolutePositionedMod,
                })}
            >
                {mod}
            </sub>
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
                    onRemove={() => {
                        onRemove();
                        whisperRef.current.close();
                    }}
                />
            }
        >
            {chordContent}
        </Whisper>
    );
};

