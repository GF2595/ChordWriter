export type ChordType = {
    chord: string;
    mod: string;
};

export type SongLine = {
    firstChordOffset?: boolean;
    lastChordOffset?: boolean;
    chords?: Array<ChordType | null>;
    lyrics: string[];
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

export type Song = {
    title: string;
    author: string;
    songBody: (LyricsPartType | InstrumentalPartType)[];
};
