export type ChordType = {
    chord: string;
    mod: string;
};

export type LyricChordPair = {
    lyric: string;
    chord?: ChordType;
};

export type SongLine = {
    lyrics: LyricChordPair[];
    repeatStart?: number;
    repeatEnd?: boolean;
};

export type PartType = {
    title?: string;
    alwaysShowChords?: boolean;
};

export type InstrumentalPartType = PartType & {
    chords?: ChordType[][];
    tabs?: string;
};

export type LyricsPartType = PartType & {
    lines: SongLine[];
};

export type SongPart = LyricsPartType | InstrumentalPartType;

export type SongBody = SongPart[];

export type Song = {
    title: string;
    author: string;
    songBody: SongBody;
};
