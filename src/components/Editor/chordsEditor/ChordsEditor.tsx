import React, { useState } from 'react';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import { InstrumentalPartType, Song, LyricsPartType } from '@model/song';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String, LyricsPart } from './components';
import { InstrumentalPart } from './components/InstrumentalPart';

// const CLASS = 'chords-editor';

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

    const [song, setSong] = useState<Song>(seventeen);

    // const tableData: RowDataType[] = lines.map((line, index) => ({
    //     dataKey: `${index}`,
    //     line,
    // }));

    // const result = [];

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
                        if ((part as LyricsPartType).lines !== undefined) {
                            return <LyricsPart part={part as LyricsPartType} />;
                        }

                        return (
                            <InstrumentalPart
                                part={part as InstrumentalPartType}
                            />
                        );
                    })}
                </div>
            </PageContent>
        </>
    );
};
