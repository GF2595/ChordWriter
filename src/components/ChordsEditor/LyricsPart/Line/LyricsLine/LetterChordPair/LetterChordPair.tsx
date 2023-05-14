import { Letter } from '@common/ChordsEditor';
import { ChordType, LyricChordPair } from '@model/song';
import cn from 'classnames';
import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { addChordToLyrics, removeChordFromLyrics } from '../utils';
import { DraggableChord } from './DraggableChord';
import './LetterChordPair.scss';
import { DragItem } from './types';

const CLASS = 'letter-chord-pair';

export interface LetterChordPairProps {
    chord?: ChordType;
    letter: string | null;
    tail?: boolean;
    end?: boolean;
    offset?: boolean;
    lyricIndex: number;
    letterIndex: number;
    dragName: string;
    onEditChord?: (chord: ChordType, lyricIndex: number) => void;
    onChangeLyrics: (
        transformer: (lyrics: LyricChordPair[]) => LyricChordPair[]
    ) => void;
    onDropChord?: (chord: ChordType, chordIndex: number) => void;
}

export const LetterChordPair: React.FC<LetterChordPairProps> = ({
    chord,
    letter,
    tail,
    offset,
    end,
    lyricIndex,
    letterIndex,
    dragName,
    onEditChord,
    onChangeLyrics,
}) => {
    const [{ hoveredChord }, dropRef] = useDrop<
        DragItem,
        void,
        { hoveredChord?: ChordType }
    >(
        () => ({
            canDrop: () => !chord,
            accept: dragName,
            drop: (item) =>
                onChangeLyrics((lyrics) =>
                    removeChordFromLyrics(
                        addChordToLyrics(
                            lyrics,
                            item.chord,
                            offset ? -1 : lyricIndex,
                            letterIndex
                        ),
                        item.lyricIndex > lyricIndex
                            ? item.lyricIndex + 1
                            : item.lyricIndex
                    )
                ),
            collect: (monitor) => ({
                hoveredChord: !!monitor.isOver()
                    ? monitor.getItem().chord
                    : undefined,
            }),
        }),
        [onChangeLyrics, chord, letterIndex, lyricIndex, offset]
    );

    const onAddChord = useCallback(
        (chord: ChordType) =>
            onChangeLyrics((lyrics) =>
                addChordToLyrics(lyrics, chord, lyricIndex, letterIndex)
            ),
        [letterIndex, lyricIndex, onChangeLyrics]
    );

    const onRemoveChord = useCallback(
        () =>
            onChangeLyrics((lyrics) =>
                removeChordFromLyrics(lyrics, lyricIndex)
            ),
        [onChangeLyrics, lyricIndex]
    );

    return (
        <div
            className={cn(CLASS, { [`${CLASS}--non-offset`]: !offset })}
            ref={dropRef}
        >
            {(!!chord || hoveredChord) && (
                <DraggableChord
                    type={dragName}
                    absolutePositionedMod={!tail}
                    className={cn(`${CLASS}__chord`, {
                        [`${CLASS}__chord--tail`]: tail || end,
                    })}
                    chord={chord || hoveredChord}
                    onEdit={(chord: ChordType) =>
                        onEditChord(chord, lyricIndex)
                    }
                    onRemove={onRemoveChord}
                    dragItem={{ chord, lyricIndex }}
                />
            )}
            {!tail && !(end && !!hoveredChord) && (
                <Letter
                    letter={letter}
                    hasChord={!!chord}
                    onAddChord={onAddChord}
                />
            )}
        </div>
    );
};

