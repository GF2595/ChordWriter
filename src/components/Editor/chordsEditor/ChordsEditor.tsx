import React, { useState } from 'react';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import { InstrumentalPartType, Song, LyricsPartType } from '@model/song';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String } from './components';
import { InstrumentalPart } from './InstrumentalPart';
import { LyricsPart } from './LyricsPart';

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

    const buttons: ButtonInfo[] = [
        {
            title: 'Новая',
            disabled: true,
        },
        {
            title: 'Открыть',
            disabled: true,
        },
        {
            // icon: (),
            title: 'Сохранить',
            disabled: true,
        },
        {
            title: 'Повтор',
            disabled: true,
        },
    ];

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
            <PageContent className={CLASS}>
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
                    onEdit={(author: string) => {
                        setSong({
                            ...song,
                            author,
                        });
                    }}
                />
                <div className={`${CLASS}__text`}>
                    {song.songBody.map((part, index) => {
                        if ((part as LyricsPartType).lines !== undefined) {
                            // TODO: key index
                            return (
                                <LyricsPart
                                    key={`${index}`}
                                    part={part as LyricsPartType}
                                    onEdit={(newPart?: LyricsPartType) => {
                                        setSong({
                                            ...song,
                                            songBody:
                                                index === 0
                                                    ? [
                                                          newPart,
                                                          ...song.songBody.slice(
                                                              1
                                                          ),
                                                      ]
                                                    : [
                                                          ...song.songBody.slice(
                                                              0,
                                                              index
                                                          ),
                                                          newPart,
                                                          ...song.songBody.slice(
                                                              index + 1
                                                          ),
                                                      ],
                                        });
                                    }}
                                />
                            );
                        }
                        // TODO: key index
                        return (
                            <InstrumentalPart
                                key={`${index}`}
                                part={part as InstrumentalPartType}
                            />
                        );
                    })}
                </div>
            </PageContent>
        </>
    );
};
