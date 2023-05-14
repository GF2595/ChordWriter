import { ChordType, LyricChordPair } from '@model/song';
import { replace } from '@utils/array';

/**
 * Добавление аккорда в строку
 * @param lyrics текущая строка
 * @param chord аккорд
 * @param lyricIndex номер блока строки. При значении -1 аккорд ставится над пустым первым блоком
 * @param letterIndex номер буквы в блоке
 */
export const addChordToLyrics = (
    lyrics: LyricChordPair[],
    chord: ChordType,
    lyricIndex: number,
    letterIndex?: number
): LyricChordPair[] => {
    if (
        lyricIndex < -1 ||
        lyricIndex > lyrics.length + 1 ||
        (!letterIndex && letterIndex < 0)
    ) {
        console.error(`onAddChord wrong index: ${lyricIndex}`);
        return lyrics;
    }

    if (lyricIndex === -1) {
        if (!lyrics[0].lyric) {
            console.error('onAddChord duplicate offset chord');
            return lyrics;
        }

        return [{ lyric: '', chord }, ...lyrics];
    }

    if (lyricIndex === lyrics.length) {
        return [...lyrics, { lyric: '', chord }];
    }

    const { lyric: currentLyric, chord: currentChord } = lyrics[lyricIndex];

    if (letterIndex === 0 && !currentChord) {
        return replace(lyrics, lyricIndex, { lyric: currentLyric, chord });
    }

    return [
        ...lyrics.slice(0, lyricIndex),
        { lyric: currentLyric.slice(0, letterIndex), chord: currentChord },
        { lyric: currentLyric.slice(letterIndex), chord },
        ...lyrics.slice(lyricIndex + 1),
    ];
};

/**
 * Удаление аккорда из строки
 * @param lyrics текущая строка
 * @param lyricIndex номер блока строки
 */
export const removeChordFromLyrics = (
    lyrics: LyricChordPair[],
    lyricIndex: number
): LyricChordPair[] => {
    if (lyricIndex < 0 || lyricIndex >= lyrics.length) {
        console.error(`onRemoveChord wrong index: ${lyricIndex}`);
        return lyrics;
    }

    const { lyric } = lyrics[lyricIndex];

    if (!lyric) {
        return [
            ...lyrics.slice(0, lyricIndex),
            ...lyrics.slice(lyricIndex + 1),
        ];
    }

    if (lyricIndex === 0) {
        return [{ lyric }, ...lyrics.slice(1)];
    }

    if (lyricIndex === 1 && !lyrics[0].lyric) {
        return replace(lyrics, lyricIndex, { chord: null, lyric });
    }

    const { lyric: previousLyric, chord: previousChord } =
        lyrics[lyricIndex - 1];

    return [
        ...lyrics.slice(0, lyricIndex - 1),
        { lyric: `${previousLyric}${lyric}`, chord: previousChord },
        ...lyrics.slice(lyricIndex + 1),
    ];
};

