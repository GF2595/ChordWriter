import React from 'react';
import { LyricsPartType } from '@model/song';
import './LyricsPart.scss';
import { Cell, Column, HeaderCell, Table } from 'rsuite-table';

const CLASS = 'lyrics-part';

export interface LyricsPartProps {
    part: LyricsPartType;
}

export const LyricsPart: React.FC<LyricsPartProps> = ({ part }) => {
    return (
        <div style={{ paddingTop: 16 }}>
            <span style={{ fontWeight: 'bolder' }}>{part.title}</span>
            <Table
                autoHeight
                rowHeight={20}
                hover={false}
                showHeader={false}
                data={part.lines.map((line, index) => ({
                    dataKey: `${index}`,
                    line: line.lyrics.reduce(
                        (previous, current) => `${previous}${current}`
                    ),
                }))}
                rowClassName={`${CLASS}__table_row`}
            >
                <Column flexGrow={1}>
                    <HeaderCell>line</HeaderCell>
                    <Cell style={{ padding: 0 }} dataKey={'line'} />
                </Column>
            </Table>
        </div>
    );
};
