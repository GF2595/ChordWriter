import { ChordType } from '@model/song';
import React from 'react';

export interface ChordProps {
    chord: ChordType;
    style: React.CSSProperties;
    absolutePositionedMod?: boolean;
}

export const Chord: React.FC<ChordProps> = ({
    chord: chordBase,
    style,
    absolutePositionedMod,
}) => {
    const { chord, mod } = chordBase;

    return (
        <span
            style={{
                ...style,
                fontWeight: 'bolder',
                whiteSpace: 'pre',
                width: 'fit-content',
            }}
        >
            {chord.length ? chord : ' '}
            {!!mod && (
                <sub
                    style={
                        absolutePositionedMod
                            ? { position: 'absolute', bottom: '-0.25rem' }
                            : undefined
                    }
                >
                    {mod}
                </sub>
            )}
        </span>
    );
};
