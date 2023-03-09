import React, { useMemo } from 'react';
import cn from 'classnames';
import EditIcon from '@rsuite/icons/Edit';
import { Whisper } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import {
    AddChordArea,
    Chord,
    ChordEditPopup,
    IconButtonCluster,
} from '@common/ChordsEditor';
import { useEditorContext } from '@components/EditorContext';
import { ChordType } from '@model/song';
import './ChordsLine.scss';

const CLASS = 'chords-line';

export interface ChordsLineProps {
    lineArrayPath: string;
    lineIndex: number;
}

export const ChordsLine: React.FC<ChordsLineProps> = ({
    lineArrayPath,
    lineIndex,
}) => {
    const path = `${lineArrayPath}[${lineIndex}]`;
    const { value, dispatch } = useEditorContext(path);

    const buttons = useMemo(
        () => [
            {
                Icon: TrashIcon,
                title: 'Удалить часть',
                onClick: () =>
                    dispatch({
                        type: 'removeArrayValue',
                        payload: { path: lineArrayPath, index: lineIndex },
                    }),
                fill: 'firebrick',
            },
            {
                Icon: ArrowUpLineIcon,
                title: 'Добавить строку выше',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: lineArrayPath,
                            index: lineIndex,
                            value: [],
                        },
                    }),
            },
            {
                Icon: ArrowDownLineIcon,
                title: 'Добавить строку ниже',
                onClick: () =>
                    dispatch({
                        type: 'addArrayValue',
                        payload: {
                            path: lineArrayPath,
                            index: lineIndex + 1,
                            value: [],
                        },
                    }),
            },
        ],
        [dispatch]
    );

    const line = value as ChordType[];

    return (
        <div
            className={cn(CLASS, {
                [`${CLASS}--offset`]: !line.length,
            })}
        >
            {!line.length
                ? [
                      <Whisper
                          key={'first chord add area'}
                          placement={'top'}
                          trigger={'click'}
                          speaker={
                              <ChordEditPopup
                                  onSubmit={(chord) =>
                                      dispatch({
                                          type: 'addArrayValue',
                                          payload: {
                                              path,
                                              value: chord,
                                          },
                                      })
                                  }
                              />
                          }
                      >
                          <EditIcon
                              key={'add first chord button'}
                              className={`${CLASS}__empty-button`}
                          />
                      </Whisper>,
                  ]
                : [
                      <AddChordArea
                          key={`${lineIndex}_area_first`}
                          onAddChord={(chord) =>
                              dispatch({
                                  type: 'addArrayValue',
                                  payload: {
                                      path,
                                      value: chord,
                                      index: 0,
                                  },
                              })
                          }
                      />,
                      ...line.map((chord, chordIndex) => [
                          <Chord
                              key={`${lineIndex}_${chordIndex}_${chord}`}
                              chord={chord}
                              onEdit={(chord) =>
                                  dispatch({
                                      type: 'setValue',
                                      payload: {
                                          path: `${path}[${chordIndex}]`,
                                          value: chord,
                                      },
                                  })
                              }
                              onRemove={() =>
                                  dispatch({
                                      type: 'removeArrayValue',
                                      payload: {
                                          path,
                                          index: chordIndex,
                                      },
                                  })
                              }
                          />,
                          <AddChordArea
                              shortArea={chordIndex != line.length - 1}
                              key={`${lineIndex}_area_[${chordIndex + 1}]`}
                              onAddChord={(chord) =>
                                  dispatch({
                                      type: 'addArrayValue',
                                      payload: {
                                          path,
                                          value: chord,
                                          index: chordIndex + 1,
                                      },
                                  })
                              }
                          />,
                      ]),
                      <IconButtonCluster
                          key={'icon button cluster'}
                          buttonClassName={`${CLASS}__icon`}
                          buttons={buttons}
                      />,
                  ]}
        </div>
    );
};

