import { InstrumentalPartType, LyricsPartType, PartType } from '@model/song';
import React from 'react';
import { InstrumentalPart } from '../InstrumentalPart';
import { LyricsPart } from '../LyricsPart';

export interface SongPartProps {
    part: PartType;
    partIndex: number;
    onEdit: (part: PartType) => void;
}

export const SongPart: React.FC<SongPartProps> = ({ part, onEdit }) => {
    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content = null;

    if (!!lines)
        content = <LyricsPart part={part as LyricsPartType} onEdit={onEdit} />;

    if ((!content && !!chords) || !!tabs)
        content = (
            <InstrumentalPart
                part={part as InstrumentalPartType}
                onEdit={onEdit}
            />
        );

    if (!content) content = null;

    return (
        <div style={{ paddingTop: '16px' }}>
            <span style={{ fontWeight: 'bolder' }}>{title}</span>
            {content}
        </div>
    );
};
