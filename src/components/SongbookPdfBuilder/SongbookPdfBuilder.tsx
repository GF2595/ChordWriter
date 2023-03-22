import { InstrumentalPartType, LyricsPartType, Song } from '@model/song';
import React from 'react';
import { ChordsPartBody } from './ChordsPartBody';
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
        <article>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <h3>{title}</h3>
                {!!author && <span style={{ float: 'right' }}>{author}</span>}
            </div>
            {songBody.map((part) => (
                <section>
                    {!!part.title && <h5>{part.title}</h5>}
                    {!!(part as LyricsPartType).lines ? (
                        <LyricsPartBody part={part as LyricsPartType} />
                    ) : !!(part as InstrumentalPartType).chords ? (
                        <ChordsPartBody part={part} />
                    ) : null}
                </section>
            ))}
        </article>
    );
};
