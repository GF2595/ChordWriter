import React, { useMemo, useState } from 'react';
import { LyricsPartType, SongLine } from '@model/song';
import './LyricsPart.scss';
import { Cell, Column, HeaderCell, Table, TableProps } from 'rsuite-table';
import { LyricsLine } from './LyricsLine';
import { EditLine } from './EditLine';

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
                    line:
                        !line.lyrics.length ? (
                            <EditLine
                                line={line}
                                onSave={(text) => {
                                    setEditedLine(-1);
                                    onEdit({
                                        ...part,
                                        lines: [
                                            ...lines.slice(0, index),
                                            {
                                                ...line,
                                                chords: undefined,
                                                lyrics: [text],
                                                lastChordOffset: undefined,
                                                firstChordOffset: undefined,
                                            },
                                            ...lines.slice(index + 1),
                                        ],
                                    });
                                }}
                                onCancel={() => onRemoveLine(index)}
                            />
                        ) :
                        index === editedLine ? (
                            <EditLine
                                line={line}
                                onSave={(text) => {
                                    setEditedLine(-1);
                                    onEdit({
                                        ...part,
                                        lines: [
                                            ...lines.slice(0, index),
                                            {
                                                ...line,
                                                chords: undefined,
                                                lyrics: [text],
                                                lastChordOffset: undefined,
                                                firstChordOffset: undefined,
                                            },
                                            ...lines.slice(index + 1),
                                        ],
                                    });
                                }}
                                onCancel={() => setEditedLine(-1)}
                            />
                        ) : (
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
                                onAddLineAfter={() => onEdit({
                                    ...part,
                                    lines: [
                                        ...lines.slice(0, index + 1),
                                        {
                                            lyrics: []
                                        },
                                        ...lines.slice(index + 1)
                                    ]
                                })}
                                onAddLineBefore={() => onEdit({
                                    ...part,
                                    lines: [
                                        ...lines.slice(0, index),
                                        {
                                            lyrics: []
                                        },
                                        ...lines.slice(index)
                                    ]
                                })}
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
                        return rowData && rowData['hasChords'] ? 40 : 21;
                    }}
                    hover={false}
                    showHeader={false}
                    data={tableData}
                    rowClassName={`${CLASS}__table_row`}
                    wordWrap={false}
                >
                    <Column flexGrow={1}>
                        <HeaderCell>line</HeaderCell>
                        <Cell
                            style={{
                                padding: 0,
                                display: 'flex',
                                alignItems: 'end',
                            }}
                            dataKey={'line'}
                        />
                    </Column>
                </Table>
            )}
        </div>
    );
};
