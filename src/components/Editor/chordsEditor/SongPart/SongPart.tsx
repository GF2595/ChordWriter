import {
    InstrumentalPartType,
    LyricsPartType,
    SongPart as SongPartType,
} from '@model/song';
import React, { useCallback } from 'react';
import { useEditorContext } from '@components/EditorContext';
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

    const { value: part, dispatch } = useEditorContext(path);

    if (!part) return null;

    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content: JSX.Element = null;
    let type: PartContentType = null;

    if (!!lines) {
        content = <LyricsPart path={path} />;
        type = 'lyrics';
    }

    if ((!content && !!chords) || !!tabs) {
        content = <InstrumentalPart path={path} />;

        if (!!chords) type = 'chords';
        else type = 'tab';
    }

    const onSetType = useCallback((type: PartContentType | null) => {
        let newPart: SongPartType = {
            title: part.title,
        };

        if (type === 'chords')
            newPart = {
                ...newPart,
                chords: [[]],
            };

        if (type === 'lyrics')
            newPart = {
                ...newPart,
                lines: [],
            };

        if (type === 'tab')
            newPart = {
                ...newPart,
                tabs: '',
            };

        dispatch({ type: 'setValue', payload: { path, value: newPart } });
    }, []);

    return (
        <div className={CLASS}>
            <PartHeader
                type={type}
                partsArrayPath={partsArrayPath}
                partIndex={partIndex}
                title={title}
                onSetType={onSetType}
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
