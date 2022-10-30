import {
    ChordType,
    InstrumentalPartType,
    LyricsPartType,
    Song,
    SongLine,
} from '@model/song';
import { has, isArray } from 'lodash';

export const getNewSong = (): Song => ({
    title: '',
    author: '',
    songBody: [],
});

const formatError = (error: string) =>
    `Ошибка чтения файла, ошибка формата: ${error}`;

const testChord = (chord: ChordType, errorHeader: string) => {
    if (!chord) throw formatError(errorHeader);

    const { chord: chordLetter, mod } = chord;

    if (!chordLetter || typeof chordLetter !== 'string')
        throw formatError(`${errorHeader}, неверный формат поля chord`);

    if (mod && typeof mod !== 'string')
        throw formatError(`${errorHeader}, неверный формат поля mod`);
};

const testLyricsLine = (line: SongLine, errorHeader: string) => {
    const {
        firstChordOffset,
        lastChordOffset,
        chords,
        lyrics,
        repeatEnd,
        repeatStart,
    } = line;

    if (firstChordOffset && typeof firstChordOffset !== 'boolean')
        throw formatError(
            `${errorHeader}, неверный формат поля firstChordOffset`
        );

    if (lastChordOffset && typeof lastChordOffset !== 'boolean')
        throw formatError(
            `${errorHeader}, неверный формат поля lastChordOffset`
        );

    if (repeatStart && typeof repeatStart !== 'number')
        throw formatError(`${errorHeader}, неверный формат поля repeatStart`);

    if (repeatEnd && typeof repeatEnd !== 'boolean')
        throw formatError(`${errorHeader}, неверный формат поля repeatEnd`);

    if (!isArray(lyrics) || lyrics.some((lyric) => typeof lyric !== 'string'))
        throw formatError(`${errorHeader}, неверный формат поля lyrics`);

    if (!!chords) {
        if (!isArray(chords))
            throw formatError(`${errorHeader}, неверный формат поля chords`);

        if (!!chords && chords.length !== lyrics.length)
            throw formatError(
                `${errorHeader}, длина полей lyrics и chords не совпадает`
            );

        chords.forEach((chord, index) => {
            if (!chord && chord !== null)
                throw formatError(`${errorHeader}, аккорд #${index + 1}`);

            if (chord !== null)
                testChord(chord, `${errorHeader}, аккорд #${index + 1}`);
        });
    }
};

const testLyricsLinesArray = (lyricsLines: SongLine[], errorHeader: string) => {
    if (!isArray(lyricsLines)) throw formatError(errorHeader);

    lyricsLines.forEach((line, index) => {
        if (!line) throw formatError(`${errorHeader}, строка #${index + 1}`);

        testLyricsLine(line, `${errorHeader}, строка #${index + 1}`);
    });
};

const testChordsLinesArray = (
    lineArray: ChordType[][],
    errorHeader: string
) => {
    if (!isArray(lineArray)) throw formatError(errorHeader);

    lineArray.forEach((line, index) => {
        if (!isArray(line))
            throw formatError(`${errorHeader}, строка ${index + 1}`);

        line.forEach((chord, index) =>
            testChord(chord, `${errorHeader}, аккорд #${index + 1}`)
        );
    });
};

const testTabs = (tabs: string, errorHeader: string) => {
    // TODO: нормальный тест, когда появится поддержка табов
    if (!tabs || typeof tabs !== 'string') throw formatError(errorHeader);
};

const testPart = (
    part: InstrumentalPartType | LyricsPartType,
    errorHeader: string
) => {
    const { title } = part;

    if (!!title && typeof title !== 'string')
        throw formatError(`${errorHeader}, название`);

    const { chords, tabs } = part as InstrumentalPartType;
    const { lines } = part as LyricsPartType;

    if (!!chords) testChordsLinesArray(chords, `${errorHeader}, аккорды`);

    if (!!tabs) testTabs(tabs, `${errorHeader}, табулатура`);

    if (!!lines) testLyricsLinesArray(lines, `${errorHeader}, текст`);
};

export const checkSongJsonFormat = (song: Song): void => {
    const { title, author, songBody } = song;

    if (typeof title !== 'string') throw formatError('Название');

    if (typeof author !== 'string') throw formatError('Автор');

    if (!isArray(songBody)) throw formatError('Поле songBody');

    songBody.forEach((part, index) => testPart(part, `Часть #${index + 1}`));
};
