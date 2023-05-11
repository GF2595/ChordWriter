import { LyricsPartType, SongLine } from '@model/song';

export const newLine: (line?: string) => SongLine = (line) => ({
    lyrics: !!line ? [{ lyric: line }] : [],
});

export const newPartFromLines: (lines: string[]) => LyricsPartType = (
    lines
) => ({
    lines: lines.map((line) => ({ lyrics: [{ lyric: line }] })),
});
