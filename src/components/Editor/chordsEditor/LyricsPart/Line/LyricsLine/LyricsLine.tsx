import { SongLine } from '@model/song';
import React from 'react';
import { Chord, Letter } from '../../../components';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { IconButton } from '@components/common/IconButton';
import { onAddChord, onEditChord, onRemoveChord } from './utils';

const CLASS = 'lyrics-line';

export interface LyricsLineProps {
    line: SongLine;
    onToggleEdit: () => void;
    onAlterLine: (line: SongLine) => void;
    onRemove: () => void;
    onAddLineBefore: () => void;
    onAddLineAfter: () => void;
}

// TODO: рефакторинг всех этих onAddChord
export const LyricsLine: React.FC<LyricsLineProps> = ({
    line,
    onToggleEdit,
    onRemove,
    onAlterLine,
    onAddLineBefore,
    onAddLineAfter,
}) => {
    const { lyrics, chords } = line;

    if (lyrics.length !== 1 && (!chords || lyrics.length !== chords.length))
        return <div style={{ color: 'red' }}>error</div>;

    // TODO: key index
    return (
        <div className={CLASS}>
            <Letter
                // TODO: нормальное решение
                letter={'   '}
                hasChord={line.firstChordOffset}
                onAddChord={(chord) =>
                    onAddChord(chord, line, '', 0, -1, onAlterLine)
                }
            />
            {lyrics.map((lyric, index) => (
                <div key={`${lyric}.${index}`} className={`${CLASS}__cell`}>
                    {chords && !!chords.length && chords[index] ? (
                        <Chord
                            className={
                                index === 0 && line.firstChordOffset
                                    ? `${CLASS}__chord-offset`
                                    : undefined
                            }
                            chord={chords[index]}
                            onEdit={(chord) =>
                                onEditChord(index, chord, line, onAlterLine)
                            }
                            onRemove={() =>
                                onRemoveChord(index, line, onAlterLine)
                            }
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
                                                line,
                                                lyric,
                                                letterIndex,
                                                index,
                                                onAlterLine
                                            )
                                        }
                                    />
                                ))
                        ) : (
                            <div>{index === 0 ? '' : ' '}</div>
                        )}
                    </div>
                </div>
            ))}
            <Letter
                key={lyrics.length}
                letter={'  '}
                hasChord={false}
                onAddChord={(chord) =>
                    onAddChord(chord, line, '', 0, lyrics.length, onAlterLine)
                }
            />
            <div className={`${CLASS}__actions`}>
                <IconButton
                    Icon={EditIcon}
                    title={
                        'Редактировать текст (редактирование стирает добавленные аккорды)'
                    }
                    className={'lyrics-line__icon'}
                    onClick={onToggleEdit}
                />
                <IconButton
                    Icon={TrashIcon}
                    className={'lyrics-line__icon'}
                    title={'Удалить строку'}
                    onClick={onRemove}
                    fill={'firebrick'}
                />
                <IconButton
                    Icon={ArrowUpLineIcon}
                    className={'lyrics-line__icon'}
                    title={'Добавить строку выше'}
                    onClick={onAddLineBefore}
                />
                <IconButton
                    Icon={ArrowDownLineIcon}
                    className={'lyrics-line__icon'}
                    title={'Добавить строку ниже'}
                    onClick={onAddLineAfter}
                />
            </div>
        </div>
    );
};
