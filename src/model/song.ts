export type ChordType = {
    chord: string;
    mod: string;
};

export type SongLine = {
    firstChordOffset?: boolean;
    lastChordOffset?: boolean;
    chords?: ChordType[];
    lyrics: string[];
    repeatStart?: number;
    repeatEnd?: boolean;
};

export type InstrumentalPartType = {
    title?: string;
    chords?: ChordType[][];
    tabs?: string;
};

export type LyricsPartType = {
    title?: string;
    offset?: boolean;
    lines: SongLine[];
};

export type Song = {
    title: string;
    author: string;
    songBody: (LyricsPartType | InstrumentalPartType)[];
};
