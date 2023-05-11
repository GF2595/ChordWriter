import { InstrumentalPartType, LyricsPartType } from './song';

export function isInstrumentalPartType(
    part: InstrumentalPartType | LyricsPartType
): part is InstrumentalPartType {
    const partAsInstrumental = part as InstrumentalPartType;

    return (
        partAsInstrumental.chords !== undefined ||
        partAsInstrumental.tabs !== undefined
    );
}

export function isLyricsPartType(
    part: InstrumentalPartType | LyricsPartType
): part is LyricsPartType {
    const partAsLyrics = part as LyricsPartType;

    return partAsLyrics.lines !== undefined;
}

