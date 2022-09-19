import { InstrumentalPartType, LyricsPartType } from '@model/song';
import React from 'react';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPart } from '../InstrumentalPart';
import { LyricsPart } from '../LyricsPart';
import { get } from 'lodash';

export interface SongPartProps {
    path: string;
}

export const SongPart: React.FC<SongPartProps> = ({ path }) => {
    const { value: part } = useEditorContext(path);

    if (!part) return null;

    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content: JSX.Element = null;

    if (!!lines) content = <LyricsPart path={path} />;

    if ((!content && !!chords) || !!tabs)
        content = <InstrumentalPart path={path} />;

    return (
        <div style={{ paddingTop: '16px' }}>
            <span style={{ fontWeight: 'bolder' }}>{title}</span>
            {content}
        </div>
    );
};
