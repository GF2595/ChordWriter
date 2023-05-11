import {
    InstrumentalPartType,
    LyricsPartType,
    Song,
    SongPart,
} from '@model/song';

function isLyricsPart(part: SongPart): part is LyricsPartType {
    return (part as LyricsPartType).lines !== undefined;
}

function getLyricPartLines({ lines }: LyricsPartType): string {
    return lines.reduce((text, { lyrics }) => {
        if (!lyrics.length) return;

        let chords = '';
        let line = '';
        let chordBasePos = 1;

        lyrics.forEach(({ lyric, chord: chordObj }, index) => {
            line += lyric;

            if (!!chordObj) {
                const { chord: chordBase, mod: chordMod } = chordObj;
                const chord = `${chordBase}${chordMod}`;

                if (index === 0 && !lyric) {
                    chords += chord;
                    return;
                }

                const offset = Math.ceil(chord.length / 2) - 1;

                if (chordBasePos - offset <= chords.length)
                    chords += index === 0 ? chord : ` ${chord}`;
                else {
                    chords +=
                        ' '.repeat(chordBasePos - offset - chords.length) +
                        chord;
                }
            }

            chordBasePos += lyric.length;
        });

        return `${text}${!!chords.length ? '\n' : ''}${chords}\n ${line}`;
    }, '');
}

function getInstrumentalPart(part: InstrumentalPartType): string {
    const { chords, tabs } = part;

    if (!!tabs) return `\n${tabs}`;

    if (!!chords)
        return chords.reduce(
            (lines, chordLine) =>
                chordLine.reduce(
                    (previous, { chord, mod }) => `${previous}${chord}${mod} `,
                    `${lines}\n `
                ),
            ''
        );

    return '';
}

export function getMonospacedText(song: Song): string {
    const { author, title, songBody } = song;

    let text = `${title}\n${author}`;

    songBody.forEach((part) => {
        const { title } = part;

        if (!!title) text += `\n\n${title}`;
        else text += '\n';

        if (isLyricsPart(part)) text += getLyricPartLines(part);
        else text += getInstrumentalPart(part);
    });

    return text;
}
