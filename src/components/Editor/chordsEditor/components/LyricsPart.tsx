import React, { useMemo, useState } from 'react';
import { LyricsPartType, SongLine } from '@model/song';
import './LyricsPart.scss';
import { Cell, Column, HeaderCell, Table, TableProps } from 'rsuite-table';
import { LyricsLine } from './LyricsLine';

const CLASS = 'lyrics-part';

export interface LyricsPartProps {
    part: LyricsPartType;
    onEdit: (newPart?: LyricsPartType) => void;
}

export const LyricsPart: React.FC<LyricsPartProps> = ({ part, onEdit }) => {
    const [editedLine, setEditedLine] = useState(-1);

    const onRemoveLine = (index: number) => {
        if (part.lines.length === 1) onEdit(undefined);

        onEdit({
            ...part,
            lines:
                index === 0
                    ? [...part.lines.slice(1)]
                    : [
                          ...part.lines.slice(0, index),
                          ...part.lines.slice(index + 1),
                      ],
        });
    };

    const lines: TableProps['data'] = useMemo(
        () =>
            part.lines.map((line, index) => {
                // TODO: key index
                return {
                    dataKey: `${index}`,
                    line: (
                        <LyricsLine
                            line={line}
                            onToggleEdit={() => setEditedLine(index)}
                            onRemove={() => onRemoveLine(index)}
                            onAlterLine={(line: SongLine) => {
                                onEdit({
                                    ...part,
                                    lines: [
                                        ...part.lines.slice(0, index),
                                        line,
                                        ...part.lines.slice(index + 1),
                                    ],
                                });
                            }}
                        />
                    ),
                };
            }),
        [part.lines, editedLine]
    );

    return (
        <div style={{ paddingTop: 16 }}>
            <span style={{ fontWeight: 'bolder' }}>{part.title}</span>
            {!!part.lines.length && (
                <Table
                    autoHeight
                    // rowHeight={40}
                    hover={false}
                    showHeader={false}
                    data={lines}
                    rowClassName={`${CLASS}__table_row`}
                    wordWrap={false}
                >
                    <Column flexGrow={1}>
                        <HeaderCell>line</HeaderCell>
                        <Cell style={{ padding: 0 }} dataKey={'line'} />
                    </Column>
                </Table>
            )}
        </div>
    );
};
