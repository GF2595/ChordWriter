import { InstrumentalPartType } from '@model/song';
import React from 'react';
import { Chord } from './Chord';

export interface ChordsPartBodyProps {
    part: InstrumentalPartType;
}

export const ChordsPartBody: React.FC<ChordsPartBodyProps> = ({
    part: { chords },
}) => (
    <>
        {chords?.map((line) => (
            <div style={{ marginLeft: '16px' }}>
                {line.map((chord) => (
                    <Chord style={styles.chord} chord={chord} />
                ))}
            </div>
        ))}
    </>
);

const styles: { [item: string]: React.CSSProperties } = {
    chord: {
        marginRight: '4px',
    },
};
