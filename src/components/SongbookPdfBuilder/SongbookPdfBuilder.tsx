/* eslint-disable react/jsx-key */
import { InstrumentalPartType, LyricsPartType, Song } from '@model/song';
import React from 'react';
import { ChordsPartBody } from './ChordsPartBody';
import { leftOffset } from './constants';
import { LyricsPartBody } from './LyricsPartBody';

export interface SongbookPdfBuilderProps {
    song: Song;
}

export const SongbookPdfBuilder: React.FC<SongbookPdfBuilderProps> = ({
    song,
}) => {
    const { author, title, songBody } = song;

    console.log(song);

    return (
        <>
            <article>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginBottom: 0,
                    }}
                >
                    <h3>{title}</h3>
                    {!!author && (
                        <span
                            style={{
                                alignSelf: 'end',
                                marginRight: '32px',
                                marginBottom: '1em',
                            }}
                        >
                            {author}
                        </span>
                    )}
                </div>
                <div className={'song-body'}>
                    {songBody.map((part) => (
                        <section>
                            {!!part.title && (
                                <span
                                    style={{
                                        fontWeight: 'bolder',
                                        marginLeft: leftOffset,
                                        marginBottom: '8px',
                                    }}
                                >
                                    {part.title}
                                    {!!(part as LyricsPartType).lines ||
                                    !!(part as InstrumentalPartType).chords
                                        ? ':'
                                        : ''}
                                </span>
                            )}
                            {!!(part as LyricsPartType).lines ? (
                                <LyricsPartBody part={part as LyricsPartType} />
                            ) : !!(part as InstrumentalPartType).chords ? (
                                <ChordsPartBody part={part} />
                            ) : null}
                        </section>
                    ))}
                </div>
            </article>
        </>
    );
};
