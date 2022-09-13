import React, { useMemo, useState } from 'react';
import { LyricsPartType, SongLine } from '@model/song';
import './LyricsPart.scss';
import { Cell, Column, HeaderCell, Table, TableProps } from 'rsuite-table';
import { Line } from './Line';
import { useEditorContext } from '../EditorContext';
import EditIcon from '@rsuite/icons/Edit';
import { IconButton } from '@components/common/IconButton';

const CLASS = 'lyrics-part';

export interface LyricsPartProps {
    path: string;
}

const newLine: SongLine = {
    lyrics: [],
};

export const LyricsPart: React.FC<LyricsPartProps> = ({ path }) => {
    const { value: part, dispatch } = useEditorContext(path);

    const { lines, title } = part as LyricsPartType;
    const [editedLine, setEditedLine] = useState(-1);

    const onRemoveLine = (index: number) => {
        dispatch({
            type: 'removeArrayValue',
            payload: { path: `${path}.lines`, index },
        });
        setEditedLine(-1);
    };

    const tableData: TableProps['data'] = useMemo(
        () =>
            lines.map((line, index) => {
                // TODO: key index
                return {
                    dataKey: line?.lyrics?.[0],
                    hasChords:
                        line.chords &&
                        line.chords.length &&
                        !(line.chords.length === 1 && !line.chords[0]),
                    line: (
                        <Line
                            path={`${path}.lines[${index}]`}
                            isEdited={index === editedLine}
                            onSetLineEdit={() => setEditedLine(index)}
                            onCancelLineEdit={() => setEditedLine(-1)}
                            onRemoveLine={() => onRemoveLine(index)}
                            onAddLineAfter={() =>
                                dispatch({
                                    type: 'addArrayValue',
                                    payload: {
                                        path: `${path}.lines`,
                                        value: newLine,
                                        index: index + 1,
                                    },
                                })
                            }
                            onAddLineBefore={() =>
                                dispatch({
                                    type: 'addArrayValue',
                                    payload: {
                                        path: `${path}.lines`,
                                        value: newLine,
                                        index: index,
                                    },
                                })
                            }
                        />
                    ),
                };
            }),
        [lines, editedLine, part]
    );

    return (
        <div style={{ paddingTop: 16 }}>
            {!!lines.length ? (
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
            ) : (
                <IconButton
                    className={`${CLASS}__empty_part_button`}
                    Icon={EditIcon}
                    onClick={() => {
                        dispatch({
                            type: 'addArrayValue',
                            payload: {
                                path: `${path}.lines`,
                                value: newLine,
                            },
                        });
                        setEditedLine(0);
                    }}
                />
            )}
        </div>
    );
};
