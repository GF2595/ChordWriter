// import { ChordType, SongLine } from '@model/song';

import { ChordType, LyricChordPair } from '@model/song';

/**
 * Добавление аккорда в строку
 * @param lyrics текущая строка
 * @param onSave метод для сохранения новой строки
 * @param chord аккорд
 * @param lyricIndex номер блока строки. При значении -1 аккорд ставится над пустым первым блоком
 * @param letterIndex номер буквы в блоке
 */
export const onAddChord = (
    lyrics: LyricChordPair[],
    onSave: (lyrics: LyricChordPair[]) => void,
    chord: ChordType,
    lyricIndex: number,
    letterIndex?: number
): void => {
    if (
        lyricIndex < -1 ||
        lyricIndex > lyrics.length + 1 ||
        (!letterIndex && letterIndex < 0)
    ) {
        console.error(`onAddChord wrong index: ${lyricIndex}`);
        return;
    }

    if (lyricIndex === -1) {
        if (!lyrics[0].lyric) {
            console.error('onAddChord duplicate offset chord');
            return;
        }

        onSave([{ lyric: '', chord }, ...lyrics]);
        return;
    }

    if (lyricIndex === lyrics.length) {
        onSave([...lyrics, { lyric: '', chord }]);
        return;
    }

    const { lyric: currentLyric, chord: currentChord } = lyrics[lyricIndex];

    onSave([
        ...lyrics.slice(0, lyricIndex),
        { lyric: currentLyric.slice(0, letterIndex), chord: currentChord },
        { lyric: currentLyric.slice(letterIndex), chord },
        ...lyrics.slice(lyricIndex + 1),
    ]);
};

/**
 * Удаление аккорда из строки
 * @param lyrics текущая строка
 * @param onSave метод для сохранения новой строки
 * @param lyricIndex номер блока строки
 */
export const onRemoveChord = (
    lyrics: LyricChordPair[],
    onSave: (lyrics: LyricChordPair[]) => void,
    lyricIndex: number
): void => {
    if (lyricIndex < 0 || lyricIndex >= lyrics.length) {
        console.error(`onRemoveChord wrong index: ${lyricIndex}`);
        return;
    }

    const { lyric } = lyrics[lyricIndex];

    if (!lyric) {
        onSave([
            ...lyrics.slice(0, lyricIndex),
            ...lyrics.slice(lyricIndex + 1),
        ]);
        return;
    }

    if (lyricIndex === 0) {
        onSave([{ lyric }, ...lyrics.slice(1)]);
        return;
    }

    const { lyric: previousLyric, chord: previousChord } =
        lyrics[lyricIndex - 1];

    onSave([
        ...lyrics.slice(0, lyricIndex - 1),
        { lyric: `${previousLyric}${lyric}`, chord: previousChord },
        ...lyrics.slice(lyricIndex + 1),
    ]);
};

