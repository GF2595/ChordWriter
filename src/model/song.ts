type Chord =
    | string
    | {
          chord: string;
          mod: string;
      };

type SongLine = {
    firstChordOffset?: boolean;
    lastChordOffset?: boolean;
    chords?: Chord[];
    lyrics: string[];
    repeatStart?: number;
    repeatEnd?: boolean;
};

export type InstrumentalPart = {
    title?: string;
    chords?: Chord[][];
    tabs?: string;
};

export type SongPart = {
    title?: string;
    offset?: boolean;
    lines: SongLine[];
};

export type Song = {
    title: string;
    author: string;
    songBody: (SongPart | InstrumentalPart)[];
};
