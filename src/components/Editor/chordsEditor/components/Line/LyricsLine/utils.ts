import { ChordType, SongLine } from '@model/song';

export const onAddChord = (
    chord: ChordType,
    line: SongLine,
    lyric: string,
    letterIndex: number,
    index: number,
    onAlterLine: (line: SongLine) => void
) => {
    const { lyrics, chords } = line;

    if (index === -1) {
        onAlterLine({
            lyrics: ['', ...lyrics],
            chords: [chord, ...chords],
            firstChordOffset: true,
        });

        return;
    }

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
            chords:
                index === 0
                    ? [chord, ...chords.slice(1)]
                    : [
                          ...chords.slice(0, index),
                          chord,
                          ...chords.slice(index + 1),
                      ],
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
};

export const onEditChord = (
    index: number,
    chord: ChordType,
    line: SongLine,
    onAlterLine: (line: SongLine) => void
) => {
    onAlterLine({
        ...line,
        chords: [
            ...line.chords.slice(0, index),
            chord,
            ...line.chords.slice(index + 1),
        ],
    });
};

export const onRemoveChord = (
    index: number,
    line: SongLine,
    onAlterLine: (line: SongLine) => void
) => {
    const { chords, lyrics } = line;

    if (index === 0 && line.firstChordOffset) {
        onAlterLine({
            ...line,
            lyrics: lyrics.slice(1),
            chords: chords.slice(1),
            firstChordOffset: false,
        });
        return;
    }

    if (index === 0) {
        onAlterLine({
            ...line,
            chords:
                chords.length === 1
                    ? undefined
                    : [undefined, ...chords.slice(1)],
        });

        return;
    }

    if (index === 1 && line.firstChordOffset) {
        onAlterLine({
            ...line,
            chords: [chords[0], undefined, ...chords.slice(2)],
        });

        return;
    }

    onAlterLine({
        chords:
            chords.length === 2 && !chords[0]
                ? undefined
                : [...chords.slice(0, index), ...chords.slice(index + 1)],
        lyrics: [
            ...lyrics.slice(0, index - 1),
            `${lyrics[index - 1]}${lyrics[index]}`,
            ...lyrics.slice(index + 1),
        ],
    });
};
