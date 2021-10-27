import React, { useMemo, useState } from 'react';
import { Cell, Column, HeaderCell, RowDataType, Table } from 'rsuite-table';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import { InstrumentalPart, Song, SongPart } from '../../../model/song';
import './ChordsEditor.scss';
import breathing from './breathe';
import { Panel, PanelGroup } from 'rsuite';
import { String } from './components';

const CLASS = 'chords-editor';

// export interface ChordsEditorProps {}

export const ChordsEditor: React.FC = () => {
    // const [song, setSong] = useState<Song>({
    //     title: '',
    //     author: '',
    //     songBody: [
    //         {
    //             lines: lines.map((line) => ({
    //                 lyrics: [line],
    //             })),
    //         },
    //     ],
    // });

    const [song, setSong] = useState<Song>(breathing);

    // const tableData: RowDataType[] = lines.map((line, index) => ({
    //     dataKey: `${index}`,
    //     line,
    // }));

    const result = [];

    // for (let i = 0; i < text.length; i++) {
    //     const letter = text[i];
    //     if (letter != '\n' && letter != '\r') {
    //         result.push(
    //             <span
    //                 className={`${CLASS}__letter`}
    //                 onClick={() => alert(letter)}
    //             >
    //                 {letter}
    //             </span>
    //         );
    //     } else if (letter === '\n') result.push(<br />);
    // }

    const buttons: ButtonInfo[] = [];

    return (
        <>
            <PageHeader buttons={buttons} />
            {/* <PageContent className={CLASS}>
                <Table
                    autoHeight
                    rowHeight={20}
                    bordered={false}
                    hover={false}
                    showHeader={false}
                    data={tableData}
                    rowClassName={`${CLASS}__table_row`}
                >
                    <Column flexGrow={1}>
                        <HeaderCell>Line</HeaderCell>
                        <Cell style={{ padding: 0 }} dataKey="line" />
                    </Column>
                </Table>
            </PageContent> */}
            <PageContent>
                <String
                    value={song.title}
                    bold
                    onEdit={(title: string) => {
                        setSong({
                            ...song,
                            title,
                        });
                    }}
                />
                <String
                    value={song.author}
                    align={'right'}
                    onEdit={(author: string) => {
                        setSong({
                            ...song,
                            author,
                        });
                    }}
                />
                <div
                    style={{
                        paddingLeft: 'calc(100vw / 7)',
                        paddingTop: '24px',
                    }}
                >
                    {song.songBody.map((part) => {
                        if ((part as SongPart).lines !== undefined) {
                            const songPart = part as SongPart;
                            return (
                                <div style={{ paddingTop: 16 }}>
                                    <span style={{ fontWeight: 'bolder' }}>
                                        {part.title}
                                    </span>
                                    <Table
                                        autoHeight
                                        rowHeight={20}
                                        hover={false}
                                        showHeader={false}
                                        data={songPart.lines.map(
                                            (line, index) => ({
                                                dataKey: `${index}`,
                                                line: line.lyrics.reduce(
                                                    (previous, current) =>
                                                        `${previous}${current}`
                                                ),
                                            })
                                        )}
                                        rowClassName={`${CLASS}__table_row`}
                                    >
                                        <Column flexGrow={1}>
                                            <HeaderCell>line</HeaderCell>
                                            <Cell
                                                style={{ padding: 0 }}
                                                dataKey={'line'}
                                            />
                                        </Column>
                                    </Table>
                                </div>
                            );
                        }

                        return (
                            <div style={{ paddingTop: 8 }}>
                                {(part as InstrumentalPart).title}
                            </div>
                        );
                    })}
                </div>
            </PageContent>
        </>
    );
};
