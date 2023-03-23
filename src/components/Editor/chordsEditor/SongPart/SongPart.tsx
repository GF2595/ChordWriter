import { useEditorContext } from '@components/EditorContext';
import {
    InstrumentalPartType,
    LyricsPartType,
    SongPart as SongPartType,
} from '@model/song';
import cn from 'classnames';
import React, { useCallback } from 'react';
import { Divider } from 'rsuite';
import { InstrumentalPart } from '../InstrumentalPart';
import { LyricsPart } from '../LyricsPart';
import { PartHeader } from './PartHeader';
import './SongPart.scss';
import { PartContentType } from './types';

const CLASS = 'song-part';

export interface SongPartProps {
    partsArrayPath: string;
    partIndex: number;
    isStructureVisible?: boolean;
    onSplitPart?: (partIndex: number, lineIndex: number) => void;
}

export const SongPart: React.FC<SongPartProps> = ({
    partsArrayPath,
    partIndex,
    isStructureVisible,
    onSplitPart,
}) => {
    const path = `${partsArrayPath}[${partIndex}]`;

    const { value: part, dispatch } = useEditorContext(path);

    const onSetType = useCallback(
        (type: PartContentType | null) => {
            let newPart: SongPartType = {
                title: part?.title,
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
        },
        [dispatch, part.title, path]
    );

    if (!part) return null;

    const { title, lines, chords, tabs } = part as InstrumentalPartType &
        LyricsPartType;

    let content: JSX.Element = null;
    let type: PartContentType = null;

    if (!!lines) {
        content = (
            <LyricsPart
                onSplitPart={
                    isStructureVisible
                        ? (lineIndex) => onSplitPart(partIndex, lineIndex)
                        : undefined
                }
                path={path}
            />
        );
        type = 'lyrics';
    }

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

