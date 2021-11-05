import React from 'react';
import { ChordType } from '@model/song';

export interface ChordProps {
    chord: ChordType;
}

export const Chord: React.FC<ChordProps> = ({ chord: { chord, mod } }) => {
    return (
        <span style={{ fontWeight: 'bolder', paddingRight: 4 }}>
            {chord}
            <sub>{mod}</sub>
        </span>
    );
};
