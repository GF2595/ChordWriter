import { InstrumentalPartType } from '@model/song';
import React from 'react';
import { Chord } from '../components/Chord';
import './InstrumentalPart.scss';
import { noop } from 'lodash';

const CLASS = 'instrumental-part';

export interface InstrumentalPartProps {
    part: InstrumentalPartType;
    onEdit: (part?: InstrumentalPartType) => void;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({
    part,
    onEdit,
}) => {
    const { chords, tabs } = part;

    return (
        <div className={CLASS}>
            {chords
                ? chords
                      .map((line, index) =>
                          line.map((chord, chordIndex) => (
                              // TODO: нормальный key
                              <Chord
                                  key={`${index}_${chordIndex}`}
                                  chord={chord}
                                  onEdit={(chord) => {
                                      const line = chords[index];

                                      onEdit({
                                          ...part,
                                          chords: [
                                              ...chords.splice(index, 1, [
                                                  ...line.splice(
                                                      chordIndex,
                                                      1,
                                                      chord
                                                  ),
                                              ]),
                                          ],
                                      });
                                  }}
                                  onRemove={() =>
                                      onEdit({
                                          ...part,
                                          chords: [
                                              ...chords.splice(index, 1, [
                                                  ...chords[index].splice(
                                                      chordIndex,
                                                      1
                                                  ),
                                              ]),
                                          ],
                                      })
                                  }
                              />
                          ))
                      )
                      .reduce((prev, next) => [...prev, <br />, ...next])
                : tabs}
        </div>
    );
};
