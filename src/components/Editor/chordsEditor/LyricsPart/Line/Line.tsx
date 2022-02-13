import { LyricsPartType, SongLine } from '@model/song';
import React from 'react';
import { EditLine } from './EditLine';
import { LyricsLine } from './LyricsLine';

export interface LineProps {
    part: LyricsPartType;
    line: SongLine;
    lineIndex: number;
    isEdited: boolean;
    onEdit: (newPart?: LyricsPartType) => void;
    onRemoveLine: (index: number) => void;
    onSetLineEdit: () => void;
    onCancelLineEdit: () => void;
}

export const Line: React.FC<LineProps> = ({
    part,
    line,
    lineIndex,
    isEdited,
    onEdit,
    onRemoveLine,
    onSetLineEdit,
    onCancelLineEdit,
}) => {
    const { lines } = part;

    const isLyricsEmpty = !line.lyrics.length;

    if (isLyricsEmpty || isEdited)
        return (
            <EditLine
                line={line}
                onSave={(text) => {
                    onCancelLineEdit();
                    onEdit({
                        ...part,
                        lines: [
                            ...lines.slice(0, lineIndex),
                            {
                                ...line,
                                chords: undefined,
                                lyrics: [text],
                                lastChordOffset: undefined,
                                firstChordOffset: undefined,
                            },
                            ...lines.slice(lineIndex + 1),
                        ],
                    });
                }}
                onCancel={
                    isLyricsEmpty
                        ? () => onRemoveLine(lineIndex)
                        : onCancelLineEdit
                }
            />
        );

    return (
        <LyricsLine
            line={line}
            onToggleEdit={onSetLineEdit}
            onRemove={() => onRemoveLine(lineIndex)}
            onAlterLine={(line: SongLine) => {
                onEdit({
                    ...part,
                    lines: [
                        ...lines.slice(0, lineIndex),
                        line,
                        ...lines.slice(lineIndex + 1),
                    ],
                });
            }}
            onAddLineAfter={() =>
                onEdit({
                    ...part,
                    lines: [
                        ...lines.slice(0, lineIndex + 1),
                        {
                            lyrics: [],
                        },
                        ...lines.slice(lineIndex + 1),
                    ],
                })
            }
            onAddLineBefore={() =>
                onEdit({
                    ...part,
                    lines: [
                        ...lines.slice(0, lineIndex),
                        {
                            lyrics: [],
                        },
                        ...lines.slice(lineIndex),
                    ],
                })
            }
        />
    );
};
