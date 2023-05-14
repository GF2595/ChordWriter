import { IconButtonCluster, IconButtonInfo } from '@common/ChordsEditor';
import { useEditorContext } from '@components/EditorContext';
import { ChordType, LyricChordPair } from '@model/song';
import EditIcon from '@rsuite/icons/Edit';
import MoveDownIcon from '@rsuite/icons/MoveDown';
import MoveUpIcon from '@rsuite/icons/MoveUp';
import SplitIcon from '@rsuite/icons/Split';
import TrashIcon from '@rsuite/icons/Trash';
import React, { useCallback, useMemo } from 'react';
import { LetterChordPair } from './LetterChordPair';
import './LyricsLine.scss';

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

    const onChangeLyrics = useCallback(
        (transform: (lyrics: LyricChordPair[]) => LyricChordPair[]) => {
            dispatch({
                type: 'setValue',
                payload: {
                    path: `${path}.lyrics`,
                    value: transform(lyrics),
                },
            });
        },
        [dispatch, lyrics, path]
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

    const firstChordOffset = !lyrics[0].lyric && !!lyrics[0].chord;

    return (
        <div className={CLASS}>
            {!!lyrics.length && (
                <LetterChordPair
                    key={'offset'}
                    dragName={path}
                    offset
                    chord={firstChordOffset ? lyrics[0].chord : undefined}
                    letterIndex={0}
                    lyricIndex={0}
                    onEditChord={(chord) => onEditChord(chord, 0)}
                    onChangeLyrics={onChangeLyrics}
                    letter={null}
                />
            )}
            {lyrics.map(({ lyric, chord }, lyricIndex) => (
                <div
                    key={`${lyric}.${lyricIndex}`}
                    className={`${CLASS}__cell`}
                >
                    <div className={`${CLASS}__cell_line`}>
                        {lyric.length
                            ? lyric
                                  .split('')
                                  .map((letter, letterIndex) => (
                                      <LetterChordPair
                                          key={`${letter}.${letterIndex}`}
                                          dragName={path}
                                          chord={
                                              letterIndex === 0
                                                  ? chord
                                                  : undefined
                                          }
                                          letter={letter}
                                          letterIndex={letterIndex}
                                          lyricIndex={lyricIndex}
                                          onEditChord={(chord) =>
                                              onEditChord(chord, lyricIndex)
                                          }
                                          onChangeLyrics={onChangeLyrics}
                                      />
                                  ))
                            : lyricIndex !== 0 &&
                              !!chord && (
                                  <LetterChordPair
                                      key={`tail.${lyricIndex}`}
                                      dragName={path}
                                      tail
                                      chord={chord}
                                      onEditChord={(chord) =>
                                          onEditChord(chord, lyricIndex)
                                      }
                                      onChangeLyrics={onChangeLyrics}
                                      letter={null}
                                      lyricIndex={lyricIndex}
                                      letterIndex={0}
                                  />
                              )}
                    </div>
                </div>
            ))}
            <LetterChordPair
                end
                key={'lineEnd'}
                dragName={path}
                letter={'  '}
                letterIndex={0}
                lyricIndex={lyrics.length}
                onChangeLyrics={onChangeLyrics}
            />
            <IconButtonCluster
                buttons={buttons}
                className={`${CLASS}__actions`}
                buttonClassName={`${CLASS}__icon`}
            />
        </div>
    );
};

