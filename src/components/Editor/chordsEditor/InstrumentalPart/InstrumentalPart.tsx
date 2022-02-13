import { InstrumentalPartType } from '@model/song';
import React from 'react';
import { Chord } from '../components/Chord';
import './InstrumentalPart.scss';
import { noop } from 'lodash';

const CLASS = 'instrumental-part';

export interface InstrumentalPartProps {
    part: InstrumentalPartType;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({ part }) => {
    return (
        <div className={CLASS}>
            <div>{part.title}</div>
            <>
                {part.chords
                    ? part.chords
                          .map((line, index) =>
                              line.map((chord, chordIndex) => (
                                  // TODO: нормальный key
                                  <Chord
                                      key={`${index}_${chordIndex}`}
                                      chord={chord}
                                      onEdit={noop}
                                      onRemove={noop}
                                  />
                              ))
                          )
                          .reduce((prev, next) => [...prev, <br />, ...next])
                    : part.tabs}
            </>
        </div>
    );
};
