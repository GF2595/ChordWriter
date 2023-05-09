import { IconButton } from '@common/IconButton';
import { useEditorContext } from '@components/EditorContext';
import { LyricsPartType } from '@model/song';
import EditIcon from '@rsuite/icons/Edit';
import React, { useState } from 'react';
import { Cell, Column, HeaderCell, Table, TableProps } from 'rsuite-table';
import { Line } from './Line';
import './LyricsPart.scss';
import { newLine, newPartFromLines } from './utils';

const CLASS = 'lyrics-part';

export interface LyricsPartProps {
    path: string;
    partsArrayPath: string;
    partIndex: number;
    onSplitPart?: (lineIndex: number) => void;
    onAddPartAfter?: () => void;
}

export const LyricsPart: React.FC<LyricsPartProps> = ({
    path,
    partsArrayPath,
    partIndex,
    onSplitPart,
    onAddPartAfter,
}) => {
    const { value: part, dispatch } = useEditorContext(path);

    const { lines } = part as LyricsPartType;
    const [editedLine, setEditedLine] = useState(-1);

    const onRemoveLine = (index: number) => {
        dispatch({
            type: 'removeArrayValue',
            payload: { path: `${path}.lines`, index },
        });
        setEditedLine(-1);
    };

    // TODO: оптимизация
    const tableData: TableProps['data'] = lines.map((line, index) => {
        // TODO: key index
        return {
            dataKey:
                line?.lyrics?.[0]?.lyric ||
                line?.lyrics?.[1]?.lyric ||
                `${index}`,
            hasChords: line.lyrics.some(({ chord }) => !!chord),
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
                                value: newLine(),
                                index: index + 1,
                            },
                        })
                    }
                    onAddLineBefore={() =>
                        dispatch({
                            type: 'addArrayValue',
                            payload: {
                                path: `${path}.lines`,
                                value: newLine(),
                                index: index,
                            },
                        })
                    }
                    onSplitPart={
                        onSplitPart && index !== 0
                            ? () => onSplitPart(index)
                            : undefined
                    }
                    onCreateNewPart={!!index ? onAddPartAfter : undefined}
                    onMultilinePaste={(excessLines: string[]) => {
                        console.log('Tick!');
                        const linesByParts: string[][] = [];

                        if (excessLines.some((line) => !line)) {
                            let lastSplitEndIndex = 0;

                            excessLines.forEach((line, index) => {
                                if (!line) {
                                    linesByParts.push(
                                        excessLines.slice(
                                            lastSplitEndIndex,
                                            index
                                        )
                                    );
                                    lastSplitEndIndex = index + 1;
                                }
                            });

                            linesByParts.push(
                                excessLines.slice(lastSplitEndIndex)
                            );
                        } else linesByParts.push(excessLines);

                        linesByParts[0].forEach(
                            (excessLine, excessLineIndex) => {
                                dispatch({
                                    type: 'addArrayValue',
                                    payload: {
                                        path: `${path}.lines`,
                                        value: newLine(excessLine),
                                        index: index + 1 + excessLineIndex,
                                    },
                                });
                            }
                        );

                        linesByParts.slice(1).forEach((part, index) => {
                            dispatch({
                                type: 'addArrayValue',
                                payload: {
                                    path: partsArrayPath,
                                    value: newPartFromLines(part),
                                    index: partIndex + 1 + index,
                                },
                            });
                        });

                        setEditedLine(index + excessLines.length);
                    }}
                />
            ),
        };
    });

    return (
        <>
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
                                value: newLine(),
                            },
                        });
                        setEditedLine(0);
                    }}
                />
            )}
        </>
    );
};

