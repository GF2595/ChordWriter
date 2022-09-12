import { InstrumentalPartType, LyricsPartType, PartType } from '@model/song';
import React from 'react';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPart } from '../InstrumentalPart';
import { LyricsPart } from '../LyricsPart';
import { get, noop } from 'lodash';

export interface SongPartProps {
    path: string;
}

export const SongPart: React.FC<SongPartProps> = ({ path }) => {
    const { song } = useEditorContext();
    const part = get(song, path);

    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content = null;

    let onEdit = noop;

    if (!!lines) content = <LyricsPart path={path} />;

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
