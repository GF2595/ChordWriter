import { SongLine } from '@model/song';
import React, { useMemo } from 'react';
import { Chord, Letter } from '../../../components';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import './LyricsLine.scss';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { onAddChord, onEditChord, onRemoveChord } from './utils';
import {
    IconButtonCluster,
    IconButtonInfo,
} from '@components/Editor/ChordsEditor/components/IconButtonCluster';

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
            <IconButtonCluster
                buttons={buttons}
                className={`${CLASS}__actions`}
                buttonClassName={'lyrics-line__icon'}
            />
        </div>
    );
};
