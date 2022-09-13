import React from 'react';
import { Chord } from '../components/Chord';
import './InstrumentalPart.scss';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPartType } from '@model/song';
import { AddChordArea, ChordEditPopup } from '../components';
import EditIcon from '@rsuite/icons/Edit';
import { Whisper } from 'rsuite';
import cn from 'classnames';

const CLASS = 'instrumental-part';

export interface InstrumentalPartProps {
    path: string;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({ path }) => {
    const { value: part, dispatch } = useEditorContext(path);

    const { chords, tabs } = part as InstrumentalPartType;

    return (
        <div>
            {chords
                ? chords
                      .map((line, index) => [
                          <div
                              className={cn({
                                  [`${CLASS}__line--offset`]: !line.length,
                              })}
                          >
                              {!line.length
                                  ? [
                                        <Whisper
                                            placement={'top'}
                                            trigger={'click'}
                                            speaker={
                                                <ChordEditPopup
                                                    onSubmit={(chord) =>
                                                        dispatch({
                                                            type: 'addArrayValue',
                                                            payload: {
                                                                path: `${path}.chords[${index}]`,
                                                                value: chord,
                                                            },
                                                        })
                                                    }
                                                />
                                            }
                                        >
                                            <EditIcon
                                                className={`${CLASS}__empty-button`}
                                            />
                                        </Whisper>,
                                    ]
                                  : [
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
                                                    shortArea={
                                                        chordIndex !=
                                                        line.length - 1
                                                    }
                                                    key={`${index}_area_[${
                                                        chordIndex + 1
                                                    }]`}
                                                    onAddChord={(chord) =>
                                                        dispatch({
                                                            type: 'addArrayValue',
                                                            payload: {
                                                                path: `${path}.chords[${index}]`,
                                                                value: chord,
                                                                index:
                                                                    chordIndex +
                                                                    1,
                                                            },
                                                        })
                                                    }
                                                />
                                            </>
                                        )),
                                    ]}
                          </div>,
                      ])
                      .reduce((prev, next) => [...prev, <br />, ...next])
                : tabs}
        </div>
    );
};
