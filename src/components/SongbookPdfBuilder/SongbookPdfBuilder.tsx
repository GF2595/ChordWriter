import { InstrumentalPartType, LyricsPartType, Song } from '@model/song';
import React from 'react';
import { ChordsPartBody } from './ChordsPartBody';
import { leftOffset } from './constants';
import { LyricsPartBody } from './LyricsPartBody';

export interface SongbookPdfBuilderProps {
    songs: Song[];
}

export const SongbookPdfBuilder: React.FC<SongbookPdfBuilderProps> = ({
    songs,
}) => {
    return (
        <>
            {songs.map((song, index) => (
                <article key={`${index}`}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginBottom: '1em',
                        }}
                    >
                        <h3>{song.title}</h3>
                        {!!song.author && (
                            <span
                                style={{
                                    alignSelf: 'end',
                                    marginRight: '32px',
                                }}
                            >
                                {song.author}
                            </span>
                        )}
                    </div>
                    <div className={'song-body'}>
                        {song.songBody.map((part, index) => (
                            <section key={`${index}`}>
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
                                    <LyricsPartBody
                                        part={part as LyricsPartType}
                                    />
                                ) : !!(part as InstrumentalPartType).chords ? (
                                    <ChordsPartBody part={part} />
                                ) : null}
                            </section>
                        ))}
                    </div>
                </article>
            ))}
        </>
    );
};
