import { ChordType, SongLine } from '@model/song';
import React, { useCallback } from 'react';
import { Chord } from './Chord';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import { Tooltip, Whisper } from 'rsuite';
import cn from 'classnames';
import { ChordEditPopup } from './ChordEditPopup';

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
    if (line.lyrics.length === 1) return <>{line.lyrics[0]}</>;

    if (!line.chords || line.lyrics.length !== line.chords.length)
        return <div style={{ color: 'red' }}>error</div>;

    const onAddChord = useCallback(
        (
            chord: ChordType,
            lyric: string,
            letterIndex: number,
            index: number
        ) => {
            const firstLyricBlock = lyric.slice(0, letterIndex);
            const secondLyricBlock = lyric.slice(letterIndex);
            onAlterLine({
                chords: [
                    ...line.chords.slice(0, index),
                    line.chords[index],
                    chord,
                    ...line.chords.slice(index + 1),
                ],
                lyrics: [
                    ...line.lyrics.slice(0, index),
                    firstLyricBlock,
                    secondLyricBlock,
                    ...line.lyrics.slice(index + 1),
                ],
            });
        },
        [onAlterLine, line]
    );
    // TODO: key index
    return (
        <div className={`${CLASS}`}>
            {line.lyrics.map((lyric, index) => (
                <div key={`${lyric}`} className={`${CLASS}__cell`}>
                    <Chord
                        chord={line.chords[index]}
                        onEdit={(chord: ChordType) => {
                            onAlterLine({
                                ...line,
                                chords: [
                                    ...line.chords.slice(0, index),
                                    chord,
                                    ...line.chords.slice(index + 1),
                                ],
                            });
                        }}
                        onRemove={() => {
                            onAlterLine(
                                index === 0
                                    ? {
                                          ...line,
                                          chords: [
                                              { chord: '', mod: '' },
                                              ...line.chords.slice(1),
                                          ],
                                      }
                                    : {
                                          chords: [
                                              ...line.chords.slice(0, index),
                                              ...line.chords.slice(index + 1),
                                          ],
                                          lyrics: [
                                              ...line.lyrics.slice(
                                                  0,
                                                  index - 1
                                              ),
                                              `${line.lyrics[index - 1]}${
                                                  line.lyrics[index]
                                              }`,
                                              ...line.lyrics.slice(index + 1),
                                          ],
                                      }
                            );
                        }}
                    />
                    <div className={`${CLASS}__cell_line`}>
                        {lyric.length ? (
                            lyric.split('').map((letter, letterIndex) =>
                                letterIndex ? (
                                    <Whisper
                                        key={`${letterIndex}`}
                                        placement={'top'}
                                        trigger={'click'}
                                        speaker={
                                            <ChordEditPopup
                                                onSubmit={(chord: ChordType) =>
                                                    onAddChord(
                                                        chord,
                                                        lyric,
                                                        letterIndex,
                                                        index
                                                    )
                                                }
                                            />
                                        }
                                    >
                                        <span
                                            className={cn(
                                                `${CLASS}__cell_letter`,
                                                `${CLASS}__cell_letter-clickable`
                                            )}
                                        >
                                            {letter}
                                        </span>
                                    </Whisper>
                                ) : (
                                    <Whisper
                                        trigger={'click'}
                                        placement={'top'}
                                        speaker={
                                            <Tooltip
                                                className={`${CLASS}__cell_popover`}
                                            >
                                                Чтобы добавить сюда новый
                                                аккорд, удалите существующий
                                            </Tooltip>
                                        }
                                    >
                                        <span
                                            className={`${CLASS}__cell_letter`}
                                        >
                                            {letter}
                                        </span>
                                    </Whisper>
                                )
                            )
                        ) : (
                            <div> </div>
                        )}
                    </div>
                </div>
            ))}
            <EditIcon className={`${CLASS}__icon`} onClick={onToggleEdit} />
            <TrashIcon
                className={`${CLASS}__icon`}
                fill={'firebrick'}
                onClick={onRemove}
            />
        </div>
    );
};
