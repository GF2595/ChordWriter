import { InstrumentalPartType } from '@model/song';
import React from 'react';
import { Chord } from './Chord';

export interface InstrumentalPartProps {
    part: InstrumentalPartType;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({ part }) => {
    return (
        <div style={{ paddingTop: 8 }}>
            <div>{part.title}</div>
            <div>
                {part.chords
                    ? part.chords
                          .map((line, index) =>
                              line.map((chord, chordIndex) => (
                                  // TODO: нормальный key
                                  <Chord
                                      key={`${index}_${chordIndex}`}
                                      chord={chord}
                                  />
                              ))
                          )
                          .reduce((prev, next) => [...prev, <br />, ...next])
                    : part.tabs}
            </div>
        </div>
    );
};
