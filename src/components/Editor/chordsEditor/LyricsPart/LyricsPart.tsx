import React, { useMemo, useState } from 'react';
import { LyricsPartType } from '@model/song';
import './LyricsPart.scss';
import { Cell, Column, HeaderCell, Table, TableProps } from 'rsuite-table';
import { Line } from './Line';

const CLASS = 'lyrics-part';

export interface LyricsPartProps {
    part: LyricsPartType;
    onEdit: (newPart?: LyricsPartType) => void;
}

export const LyricsPart: React.FC<LyricsPartProps> = ({ part, onEdit }) => {
    const { lines, title } = part;
    const [editedLine, setEditedLine] = useState(-1);

    const onRemoveLine = (index: number) => {
        if (lines.length === 1) onEdit(undefined);
        setEditedLine(-1);

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
                        <Line
                            part={part}
                            line={line}
                            lineIndex={index}
                            isEdited={index === editedLine}
                            onSetLineEdit={() => setEditedLine(index)}
                            onCancelLineEdit={() => setEditedLine(-1)}
                            onEdit={(newPart) => {
                                setEditedLine(-1);
                                onEdit(newPart);
                            }}
                            onRemoveLine={onRemoveLine}
                        />
                    ),
                };
            }),
        [lines, editedLine, part]
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
