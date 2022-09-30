import { InstrumentalPartType, LyricsPartType } from '@model/song';
import React from 'react';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPart } from '../InstrumentalPart';
import { LyricsPart } from '../LyricsPart';
import { PartHeader } from './PartHeader';
import './SongPart.scss';
import { PartContentType } from './types';
import cn from 'classnames';
import { Divider } from 'rsuite';

const CLASS = 'song-part';

export interface SongPartProps {
    partsArrayPath: string;
    partIndex: number;
    isStructureVisible?: boolean;
}

export const SongPart: React.FC<SongPartProps> = ({
    partsArrayPath,
    partIndex,
    isStructureVisible,
}) => {
    const path = `${partsArrayPath}[${partIndex}]`;

    const { value: part } = useEditorContext(path);

    if (!part) return null;

    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content: JSX.Element = null;
    let type: PartContentType = 'lyrics';

    if (!!lines) content = <LyricsPart path={path} />;

    if ((!content && !!chords) || !!tabs) {
        content = <InstrumentalPart path={path} />;

        if (!!chords) type = 'chords';
        else type = 'tab';
    }

    return (
        <div className={CLASS}>
            <PartHeader
                type={type}
                partsArrayPath={partsArrayPath}
                partIndex={partIndex}
                title={title}
                onAddAbove={() => {}}
                onAddBelow={() => {}}
                onDelete={() => {}}
                onSetTitle={() => {}}
                onSetType={() => {}}
                showControls={isStructureVisible}
            />
            <div
                className={cn({
                    [`${CLASS}__offset-content`]: isStructureVisible,
                })}
            >
                {content}
            </div>
            {isStructureVisible && <Divider className={`${CLASS}__divider`} />}
        </div>
    );
};
