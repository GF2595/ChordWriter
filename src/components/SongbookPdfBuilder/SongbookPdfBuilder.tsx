import { InstrumentalPartType, LyricsPartType, Song } from '@model/song';
import { isInstrumentalPartType } from '@model/typeguards';
import React from 'react';
import { ChordsPartBody } from './ChordsPartBody';
import { leftOffset } from './constants';
import { LyricsPartBody } from './LyricsPartBody';

export interface SongbookPdfBuilderProps {
    songs: Song[];
    showChords: boolean;
}

export const SongbookPdfBuilder: React.FC<SongbookPdfBuilderProps> = ({
    songs,
    showChords,
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
                                    marginRight: '64px',
                                    fontSize: '1.17em',
                                }}
                            >
                                {song.author}
                            </span>
                        )}
                    </div>
                    <div className={'song-body'}>
                        {song.songBody.map((part, index) => {
                            // TODO: при добавлении табов сделать проверку на наличие аккордов
                            if (showChords || !isInstrumentalPartType(part))
                                return (
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
                                                {!!(part as LyricsPartType)
                                                    .lines ||
                                                !!(part as InstrumentalPartType)
                                                    .chords
                                                    ? ':'
                                                    : ''}
                                            </span>
                                        )}
                                        {!!(part as LyricsPartType).lines ? (
                                            <LyricsPartBody
                                                showChords={showChords}
                                                part={part as LyricsPartType}
                                            />
                                        ) : !!(part as InstrumentalPartType)
                                              .chords ? (
                                            <ChordsPartBody part={part} />
                                        ) : null}
                                    </section>
                                );
                        })}
                    </div>
                </article>
            ))}
        </>
    );
};
