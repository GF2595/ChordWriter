import {
    ChordType,
    LyricChordPair,
    Song,
    SongBody,
    SongLine,
    SongPart,
} from '@model/song';

const chordRegex = new RegExp(
    // eslint-disable-next-line no-control-regex
    '\b(?:G,C,D|A,B,C|E,C,D)|(?:[ABCDEFGH](?:#|b)?)(?:/[ABCDEFGH]b)?(?:(?:(?:maj|min|sus|add|aug|dim)(?:d{0,2}(?:#d{1,2}|susd)?)?)|(?:md{0,2}(?:(?:maj|add|#)d{0,2})?)|(?:-?d{0,2}(?:([^)]*)|#d{1,2})?))?'
);

const isChordsLine = (line: string) =>
    line
        .trim()
        .split(/\s+/)
        .every((chord) => !!chord && chordRegex.test(chord));

const parseChordsInstrumentalLine = (line: string): ChordType[] =>
    line
        .trim()
        .split(/\s+/)
        .map((chord) => ({
            chord,
            mod: '',
        }));

const parseLyricChordLinesPair = (
    chordsLine: string,
    lyricsLine: string
): LyricChordPair[] => {
    const lyrics: LyricChordPair[] = [];

    if (!isChordsLine(lyricsLine)) {
        const regex = /\b\S+/g;

        let previousRes = regex.exec(chordsLine);
        let previousResLetterIndex =
            previousRes.index + Math.ceil(previousRes[0].length / 2) - 1;
        let res = [];
        let resLetterIndex = 0;

        if (!!previousRes.index) {
            const lyric = lyricsLine
                .slice(0, previousResLetterIndex)
                .trimStart();

            if (!!lyric.length)
                lyrics.push({
                    lyric,
                });
        }

        // eslint-disable-next-line no-cond-assign
        while ((res = regex.exec(chordsLine))) {
            const chord = res[0];
            resLetterIndex = res.index + Math.ceil(chord.length / 2) - 1;

            const previousChordLyric = lyricsLine.slice(
                previousResLetterIndex,
                resLetterIndex
            );

            if (!previousResLetterIndex && previousChordLyric[0] === ' ') {
                lyrics.push(
                    {
                        lyric: '',
                        chord: {
                            chord: previousRes[0],
                            mod: '',
                        },
                    },
                    {
                        lyric: previousChordLyric.trimStart(),
                    }
                );
            } else
                lyrics.push({
                    lyric: lyricsLine.slice(
                        previousResLetterIndex,
                        resLetterIndex
                    ),
                    chord: {
                        chord: previousRes[0],
                        mod: '',
                    },
                });

            previousRes = res;
            previousResLetterIndex = resLetterIndex;
        }

        lyrics.push({
            lyric: lyricsLine.slice(
                res ? resLetterIndex : previousResLetterIndex
            ),
            chord: {
                chord: res?.[0] ?? previousRes[0],
                mod: '',
            },
        });
    }

    return lyrics;
};

const parsePart = (part: string[]): SongPart | null => {
    if (!part?.length) return null;

    if (part.every(isChordsLine) || part.slice(1).every(isChordsLine)) {
        const firstLineIsName = !isChordsLine(part[0]);

        return {
            title: firstLineIsName ? part[0] : undefined,
            chords: part
                .slice(firstLineIsName ? 1 : 0)
                .map(parseChordsInstrumentalLine),
        };
    }

    let i = 0;
    const lyricPartLines: SongLine[] = [];

    while (i < part.length) {
        const line = part[i];

        if (!isChordsLine(line)) {
            lyricPartLines.push({
                lyrics: [
                    {
                        lyric: line.trim(),
                    },
                ],
            });

            i = i + 1;
            continue;
        }

        if (i + 1 !== part.length) {
            const nextLine = part[i + 1];
            i = i + 1;

            lyricPartLines.push({
                lyrics: parseLyricChordLinesPair(line, nextLine),
            });
        }

        i = i + 1;
    }

    return {
        lines: lyricPartLines,
    };
};

export const parseTextSong: (text: string) => Song = (text) => {
    const textArray = text
        .split('\n')
        .filter((line) => (line.match(/-/g)?.length ?? -1) < line.length / 2); // Фильтруем табы, пока нет их поддержки

    const textByParts: string[][] = [];
    let partStartIndex = 0;

    textArray.forEach((line, index) => {
        if (!line.trim()) {
            if (index !== partStartIndex) {
                textByParts.push(textArray.slice(partStartIndex, index));
                partStartIndex = index + 1;
            } else partStartIndex = partStartIndex + 1;
        } else if (index === textArray.length - 1)
            textByParts.push(textArray.slice(partStartIndex));
    });

    const songBody: SongBody = [];

    textByParts.forEach((part) => {
        const parsedPart = parsePart(part);
        if (!!parsedPart) songBody.push(parsedPart);
    });

    return { author: '', title: '', songBody };
};

