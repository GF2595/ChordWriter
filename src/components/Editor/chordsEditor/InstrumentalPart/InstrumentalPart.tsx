import React from 'react';
import { Chord } from '../components/Chord';
import './InstrumentalPart.scss';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPartType } from '@model/song';
import { AddChordArea } from '../components';

const CLASS = 'instrumental-part';

export interface InstrumentalPartProps {
    path: string;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({ path }) => {
    const { value: part, dispatch } = useEditorContext(path);

    const { chords, tabs } = part as InstrumentalPartType;

    return (
        <div className={CLASS}>
            {chords
                ? chords
                      .map((line, index) => [
                          <AddChordArea
                              key={`${index}_area_first`}
                              onAddChord={(chord) =>
                                  dispatch({
                                      type: 'addArrayValue',
                                      payload: {
                                          path: `${path}.chords[${index}]`,
                                          value: chord,
                                          index: 0,
                                      },
                                  })
                              }
                          />,
                          ...line.map((chord, chordIndex) => (
                              <>
                                  {/* TODO: нормальный key*/}
                                  <Chord
                                      hasPadding={false}
                                      key={`${index}_${chordIndex}`}
                                      chord={chord}
                                      onEdit={(chord) =>
                                          dispatch({
                                              type: 'setValue',
                                              payload: {
                                                  path: `${path}.chords[${index}][${chordIndex}]`,
                                                  value: chord,
                                              },
                                          })
                                      }
                                      onRemove={() =>
                                          dispatch({
                                              type: 'removeArrayValue',
                                              payload: {
                                                  path: `${path}.chords[${index}]`,
                                                  index: chordIndex,
                                              },
                                          })
                                      }
                                  />
                                  <AddChordArea
                                      shortArea={chordIndex != line.length - 1}
                                      key={`${index}_area_[${chordIndex + 1}]`}
                                      onAddChord={(chord) =>
                                          dispatch({
                                              type: 'addArrayValue',
                                              payload: {
                                                  path: `${path}.chords[${index}]`,
                                                  value: chord,
                                                  index: chordIndex + 1,
                                              },
                                          })
                                      }
                                  />
                              </>
                          )),
                      ])
                      .reduce((prev, next) => [...prev, <br />, ...next])
                : tabs}
        </div>
    );
};
