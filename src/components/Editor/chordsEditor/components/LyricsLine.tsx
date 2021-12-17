import { ChordType, SongLine } from '@model/song';
import React, { useCallback } from 'react';
import { Chord } from './Chord';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import PlusIcon from '@rsuite/icons/Plus';
import DragableIcon from '@rsuite/icons/Dragable';
import { Letter } from './Letter';
import cn from 'classnames';
import { noop } from 'lodash';

const CLASS = 'lyrics-line';

export interface LyricsLineProps {
    line: SongLine;
    onToggleEdit: () => void;
    onAlterLine: (line: SongLine) => void;
    onRemove: () => void;
}

export const LyricsLine: React.FC<LyricsLineProps> = ({
    line,
    onToggleEdit,
    onAlterLine,
    onRemove,
}) => {
    const { lyrics, chords } = line;

    if (lyrics.length !== 1 && (!chords || lyrics.length !== chords.length))
        return <div style={{ color: 'red' }}>error</div>;

    const onAddChord = useCallback(
        (
            chord: ChordType,
            lyric: string,
            letterIndex: number,
            index: number
        ) => {
            if (chords && index === lyrics.length) {
                onAlterLine({
                    lyrics: [...lyrics, ''],
                    chords: [...chords, chord],
                });

                return;
            }

            if (chords && !chords[index] && letterIndex === 0) {
                onAlterLine({
                    ...line,
                    chords: [chord, ...chords.slice(1)],
                });

                return;
            }

            if (!chords && letterIndex === 0) {
                onAlterLine({
                    ...line,
                    chords: [chord],
                });

                return;
            }

            const newLyrics = [
                ...lyrics.slice(0, index),
                lyric.slice(0, letterIndex),
                lyric.slice(letterIndex),
                ...lyrics.slice(index + 1),
            ];

            if (chords) {
                onAlterLine({
                    chords: [
                        ...chords.slice(0, index),
                        chords[index],
                        chord,
                        ...chords.slice(index + 1),
                    ],
                    lyrics: newLyrics,
                });
            } else {
                onAlterLine({
                    chords: [undefined, chord],
                    lyrics: newLyrics,
                });
            }
        },
        [onAlterLine, lyrics, chords, line]
    );

    const onEditChord = useCallback(
        (index: number, chord: ChordType) => {
            onAlterLine({
                ...line,
                chords: [
                    ...chords.slice(0, index),
                    chord,
                    ...chords.slice(index + 1),
                ],
            });
        },
        [onAlterLine, lyrics, chords, line]
    );

    const onRemoveChord = useCallback(
        (index: number) => {
            onAlterLine(
                index === 0
                    ? {
                          ...line,
                          chords:
                              chords.length === 1
                                  ? undefined
                                  : [undefined, ...chords.slice(1)],
                      }
                    : {
                          chords:
                              chords.length === 2 && !chords[0]
                                  ? undefined
                                  : [
                                        ...chords.slice(0, index),
                                        ...chords.slice(index + 1),
                                    ],
                          lyrics: [
                              ...lyrics.slice(0, index - 1),
                              `${lyrics[index - 1]}${lyrics[index]}`,
                              ...lyrics.slice(index + 1),
                          ],
                      }
            );
        },
        [onAlterLine, line, lyrics, chords]
    );

    // TODO: key index
    return (
        <div className={`${CLASS}`}>
            <DragableIcon
                className={cn(`${CLASS}__icon`, `${CLASS}__icon_left`)}
            />
            {lyrics.map((lyric, index) => (
                <div key={`${lyric}.${index}`} className={`${CLASS}__cell`}>
                    {chords && !!chords.length && chords[index] ? (
                        <Chord
                            chord={chords[index]}
                            onEdit={(chord) => onEditChord(index, chord)}
                            onRemove={() => onRemoveChord(index)}
                        />
                    ) : (
                        ' '
                    )}
                    <div className={`${CLASS}__cell_line`}>
                        {lyric.length ? (
                            lyric
                                .split('')
                                .map((letter, letterIndex) => (
                                    <Letter
                                        key={`${letter}.${letterIndex}`}
                                        letter={letter}
                                        hasChord={
                                            letterIndex === 0 &&
                                            chords &&
                                            !!chords[index]
                                        }
                                        onAddChord={(chord) =>
                                            onAddChord(
                                                chord,
                                                lyric,
                                                letterIndex,
                                                index
                                            )
                                        }
                                    />
                                ))
                        ) : (
                            <div> </div>
                        )}
                    </div>
                </div>
            ))}
            <Letter
                key={lyrics.length}
                letter={'  '}
                hasChord={false}
                onAddChord={(chord) => onAddChord(chord, '', 0, lyrics.length)}
            />
            <div className={`${CLASS}__actions`}>
                <EditIcon className={`${CLASS}__icon`} onClick={onToggleEdit} />
                <TrashIcon
                    className={`${CLASS}__icon`}
                    fill={'firebrick'}
                    onClick={onRemove}
                />
                {/* TODO: noop */}
                <PlusIcon className={`${CLASS}__icon`} onClick={noop} />
            </div>
        </div>
    );
};
