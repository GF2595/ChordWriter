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

    const { lines, title } = part;

    const onRemoveLine = (index: number) => {
        if (lines.length === 1) onEdit(undefined);

        onEdit({
            ...part,
            lines:
                index === 0
                    ? [...lines.slice(1)]
                    : [...lines.slice(0, index), ...lines.slice(index + 1)],
        });
    };

    const tableData: TableProps['data'] = useMemo(
        () =>
            lines.map((line, index) => {
                // TODO: key index
                return {
                    dataKey: `${index}`,
                    hasChords:
                        line.chords &&
                        line.chords.length &&
                        !(line.chords.length === 1 && !line.chords[0]),
                    line: (
                        <LyricsLine
                            line={line}
                            onToggleEdit={() => setEditedLine(index)}
                            onRemove={() => onRemoveLine(index)}
                            onAlterLine={(line: SongLine) => {
                                onEdit({
                                    ...part,
                                    lines: [
                                        ...lines.slice(0, index),
                                        line,
                                        ...lines.slice(index + 1),
                                    ],
                                });
                            }}
                        />
                    ),
                };
            }),
        [lines, editedLine]
    );

    return (
        <div style={{ paddingTop: 16 }}>
            <span style={{ fontWeight: 'bolder' }}>{title}</span>
            {!!lines.length && (
                <Table
                    autoHeight
                    rowHeight={(rowData) => {
                        return rowData && rowData['hasChords'] ? 40 : 20;
                    }}
                    hover={false}
                    showHeader={false}
                    data={tableData}
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
