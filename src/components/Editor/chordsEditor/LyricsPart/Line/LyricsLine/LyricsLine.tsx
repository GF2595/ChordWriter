import { ChordType, LyricChordPair } from '@model/song';
import React, { useCallback, useMemo } from 'react';
import {
    IconButtonCluster,
    IconButtonInfo,
    Chord,
    Letter,
} from '../../../components';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import cn from 'classnames';
import { useEditorContext } from '@components/Editor/ChordsEditor/EditorContext';
import * as utils from './utils';

const CLASS = 'lyrics-line';

export interface LyricsLineProps {
    path: string;
    onToggleEdit: () => void;
    onRemove: () => void;
    onAddLineBefore: () => void;
    onAddLineAfter: () => void;
}

export const LyricsLine: React.FC<LyricsLineProps> = ({
    path,
    onToggleEdit,
    onRemove,
    onAddLineBefore,
    onAddLineAfter,
}) => {
    const {
        value: lyrics,
        dispatch,
        untypedDispatch,
    } = useEditorContext<LyricChordPair[]>(`${path}.lyrics`);

    const onAddChord = useCallback(
        (chord: ChordType, lyricIndex: number, letterIndex?: number) =>
            utils.onAddChord(
                lyrics,
                (newLyrics: LyricChordPair[]) =>
                    dispatch({
                        type: 'setValue',
                        payload: {
                            path: `${path}.lyrics`,
                            value: newLyrics,
                        },
                    }),
                chord,
                lyricIndex,
                letterIndex
            ),
        [lyrics, dispatch, path]
    );

    const onEditChord = useCallback(
        (chord: ChordType, lyricIndex: number) =>
            untypedDispatch({
                type: 'setValue',
                payload: {
                    path: `${path}.lyrics[${lyricIndex}].chord`,
                    value: chord,
                },
            }),
        [untypedDispatch, path]
    );

    const onRemoveChord = useCallback(
        (lyricIndex: number) =>
            utils.onRemoveChord(
                lyrics,
                (newLyrics: LyricChordPair[]) =>
                    dispatch({
                        type: 'setValue',
                        payload: {
                            path: `${path}.lyrics`,
                            value: newLyrics,
                        },
                    }),
                lyricIndex
            ),
        [dispatch, lyrics, path]
    );

    const buttons: IconButtonInfo[] = useMemo(
        () => [
            {
                Icon: EditIcon,
                title: 'Редактировать текст (редактирование стирает добавленные аккорды)',
                onClick: onToggleEdit,
            },
            {
                Icon: TrashIcon,
                title: 'Удалить строку',
                onClick: onRemove,
                fill: 'firebrick',
            },
            {
                Icon: ArrowUpLineIcon,
                title: 'Добавить строку выше',
                onClick: onAddLineBefore,
            },
            {
                Icon: ArrowDownLineIcon,
                title: 'Добавить строку ниже',
                onClick: onAddLineAfter,
            },
        ],
        [onToggleEdit, onRemove, onAddLineAfter, onAddLineBefore]
    );

    const firstChordOffset = !lyrics[0].lyric;

    return (
        <div className={CLASS}>
            {!!lyrics.length && (
                <div
                    key={'offset'}
                    className={`${CLASS}__letter-chord-container`}
                >
                    {firstChordOffset && (
                        <Chord
                            absolutePositionedMod
                            className={`${CLASS}__chord`}
                            chord={lyrics[0].chord}
                            onEdit={(chord) => onEditChord(chord, 0)}
                            onRemove={() => onRemoveChord(0)}
                        />
                    )}
                    <Letter
                        letter={null}
                        hasChord={firstChordOffset}
                        onAddChord={(chord) => onAddChord(chord, -1)}
                    />
                </div>
            )}
            {lyrics.map(({ lyric, chord }, lyricIndex) => (
                <div
                    key={`${lyric}.${lyricIndex}`}
                    className={`${CLASS}__cell`}
                >
                    <div className={`${CLASS}__cell_line`}>
                        {lyric.length
                            ? lyric.split('').map((letter, letterIndex) => (
                                  <div
                                      className={`${CLASS}__letter-chord-container`}
                                  >
                                      {letterIndex === 0 && !!chord && (
                                          <Chord
                                              absolutePositionedMod
                                              className={`${CLASS}__chord`}
                                              chord={chord}
                                              onEdit={(chord) =>
                                                  onEditChord(chord, lyricIndex)
                                              }
                                              onRemove={() =>
                                                  onRemoveChord(lyricIndex)
                                              }
                                          />
                                      )}
                                      <Letter
                                          key={`${letter}.${letterIndex}`}
                                          letter={letter}
                                          hasChord={
                                              letterIndex === 0 && !!chord
                                          }
                                          onAddChord={(chord) =>
                                              onAddChord(
                                                  chord,
                                                  lyricIndex,
                                                  letterIndex
                                              )
                                          }
                                      />
                                  </div>
                              ))
                            : lyricIndex !== 0 && (
                                  <div key={`tail.${lyricIndex}`}>
                                      {!!chord && (
                                          <Chord
                                              className={cn(`${CLASS}__chord`, {
                                                  [`${CLASS}__chord--tail`]:
                                                      lyricIndex !== 0,
                                              })}
                                              chord={chord}
                                              onEdit={(chord) =>
                                                  onEditChord(chord, lyricIndex)
                                              }
                                              onRemove={() =>
                                                  onRemoveChord(lyricIndex)
                                              }
                                          />
                                      )}{' '}
                                  </div>
                              )}
                    </div>
                </div>
            ))}
            <Letter
                key={lyrics.length}
                letter={'  '}
                hasChord={false}
                onAddChord={(chord) => onAddChord(chord, lyrics.length)}
            />
            <IconButtonCluster
                buttons={buttons}
                className={`${CLASS}__actions`}
                buttonClassName={'lyrics-line__icon'}
            />
        </div>
    );
};
