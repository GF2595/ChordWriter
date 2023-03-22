import { LyricsPartType } from '@model/song';
import React from 'react';
import { Chord } from './Chord';

export interface LyricsPartBodyProps {
    part: LyricsPartType;
}

export const LyricsPartBody: React.FC<LyricsPartBodyProps> = ({
    part: { lines },
}) => {
    return (
        <>
            {lines.map(({ lyrics }) => (
                <div
                    style={
                        lyrics.some(({ chord }) => !!chord)
                            ? styles.lineWithChords
                            : undefined
                    }
                >
                    <div
                        style={{
                            width: '16px',
                            position: 'relative',
                            display: 'inline-block',
                        }}
                    >
                        {!lyrics[0]?.lyric && !!lyrics[0].chord && (
                            <Chord
                                style={styles.chord}
                                chord={lyrics[0].chord}
                            />
                        )}
                    </div>
                    <span style={{ whiteSpace: 'pre' }}>
                        {lyrics.map(({ lyric, chord }, index) => {
                            if (index === 0 && !lyric) return null;

                            if (!lyric)
                                if (!!chord)
                                    return (
                                        <span
                                            style={{
                                                width: '16px',
                                                position: 'relative',
                                            }}
                                        >
                                            <Chord
                                                style={styles.chord}
                                                chord={chord}
                                            />
                                        </span>
                                    );
                                else return null;

                            if (!!chord) {
                                console.log(lyric[0]);
                                return (
                                    <span>
                                        <span
                                            style={{
                                                position: 'relative',
                                                display: 'inline-flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                whiteSpace: 'pre',
                                            }}
                                        >
                                            <Chord
                                                style={styles.chord}
                                                chord={chord}
                                            />
                                            <span style={{ whiteSpace: 'pre' }}>
                                                {lyric[0]}
                                            </span>
                                        </span>
                                        <span>{lyric.slice(1)}</span>
                                    </span>
                                );
                            }

                            return lyric;
                        })}
                    </span>
                    <br />
                </div>
            ))}
        </>
    );
};

const styles: { [name: string]: React.CSSProperties } = {
    chord: {
        position: 'absolute',
        bottom: '1rem',
    },
    lineWithChords: {
        marginTop: '1rem',
    },
};
