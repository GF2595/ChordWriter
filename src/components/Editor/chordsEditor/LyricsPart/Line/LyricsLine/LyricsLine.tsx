import { ChordType, LyricChordPair } from '@model/song';
import React, { useCallback, useMemo } from 'react';
import {
    IconButtonCluster,
    IconButtonInfo,
    Chord,
    Letter,
} from '@common/ChordsEditor';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import MoveDownIcon from '@rsuite/icons/MoveDown';
import MoveUpIcon from '@rsuite/icons/MoveUp';
import cn from 'classnames';
import { useEditorContext } from '@components/EditorContext';
import * as utils from './utils';
import SplitIcon from '@rsuite/icons/Split';

const CLASS = 'lyrics-line';

export interface LyricsLineProps {
    path: string;
    onToggleEdit: () => void;
    onRemove: () => void;
    onAddLineBefore: () => void;
    onAddLineAfter: () => void;
    onSplitPart?: () => void;
}

export const LyricsLine: React.FC<LyricsLineProps> = ({
    path,
    onToggleEdit,
    onRemove,
    onAddLineBefore,
    onAddLineAfter,
    onSplitPart,
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

    const buttons: IconButtonInfo[] = useMemo(() => {
        const result = [
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
                Icon: MoveUpIcon,
                title: 'Добавить строку выше',
                onClick: onAddLineBefore,
            },
            {
                Icon: MoveDownIcon,
                title: 'Добавить строку ниже',
                onClick: onAddLineAfter,
            },
        ];

        if (!!onSplitPart)
            result.push({
                Icon: SplitIcon,
                title: 'Выделить новую часть, начиная с этой строки',
                onClick: onSplitPart,
            });

        return result;
    }, [onToggleEdit, onRemove, onAddLineAfter, onAddLineBefore, onSplitPart]);

    const firstChordOffset = !lyrics[0].lyric;

    return (
        <div className={CLASS}>
            {!!lyrics.length && (
                <div key={'offset'} className={`${CLASS}__offset-container`}>
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
                                      key={`${letter}.${letterIndex}`}
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
                                              // [TODO]: Рефакторинг
                                              onRemove={
                                                  firstChordOffset &&
                                                  lyricIndex === 1
                                                      ? () =>
                                                            onEditChord(
                                                                null,
                                                                lyricIndex
                                                            )
                                                      : () =>
                                                            onRemoveChord(
                                                                lyricIndex
                                                            )
                                              }
                                          />
                                      )}
                                      <Letter
                                          key={`${letter}.${letterIndex}`}
                                          letter={letter}
                                          hasChord={
                                              letterIndex === 0 && !!chord
                                          }
                                          // [TODO]: Рефакторинг
                                          onAddChord={
                                              !chord && letterIndex === 0
                                                  ? (chord) =>
                                                        onEditChord(
                                                            chord,
                                                            lyricIndex
                                                        )
                                                  : (chord) =>
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

