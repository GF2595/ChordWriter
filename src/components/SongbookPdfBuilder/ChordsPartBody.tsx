/* eslint-disable react/jsx-key */
import { InstrumentalPartType } from '@model/song';
import React from 'react';
import { Chord } from './Chord';
import { leftOffset } from './constants';

export interface ChordsPartBodyProps {
    part: InstrumentalPartType;
}

export const ChordsPartBody: React.FC<ChordsPartBodyProps> = ({
    part: { chords },
}) => (
    <>
        {chords?.map((line) => (
            <div style={{ marginLeft: leftOffset }}>
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
