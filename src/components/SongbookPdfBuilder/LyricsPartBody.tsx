import { LyricsPartType } from '@model/song';
import React from 'react';
import { Chord } from './Chord';
import { leftOffset } from './constants';

export interface LyricsPartBodyProps {
    part: LyricsPartType;
}

export const LyricsPartBody: React.FC<LyricsPartBodyProps> = ({
    part: { lines },
}) => {
    return (
        <>
            {lines.map(({ lyrics }, index) => (
                <div
                    key={`${index}`}
                    style={
                        lyrics.some(({ chord }) => !!chord)
                            ? styles.lineWithChords
                            : undefined
                    }
                >
                    <span
                        style={{
                            width: leftOffset,
                            position: 'relative',
                            display: 'inline-block',
                            whiteSpace: 'pre',
                        }}
                    >
                        {!lyrics[0]?.lyric && !!lyrics[0].chord && (
                            <Chord
                                absolutePositionedMod
                                style={styles.chord}
                                chord={lyrics[0].chord}
                            />
                        )}{' '}
                    </span>
                    <span style={{ whiteSpace: 'pre' }}>
                        {lyrics.map(({ lyric, chord }, index) => {
                            if (index === 0 && !lyric) return null;

                            if (!lyric)
                                if (!!chord)
                                    return (
                                        <span
                                            key={`${index}`}
                                            style={{
                                                width: leftOffset,
                                                position: 'relative',
                                                whiteSpace: 'pre',
                                                // [TODO] Нормальное решение здесь и в LyricsLine
                                                marginLeft: !!lyrics[index - 1]
                                                    ?.lyric
                                                    ? '12px'
                                                    : 0,
                                            }}
                                        >
                                            <Chord
                                                absolutePositionedMod
                                                style={styles.chordTail}
                                                chord={chord}
                                            />{' '}
                                        </span>
                                    );
                                else return null;

                            if (!!chord)
                                return (
                                    <span key={`${index}`}>
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
                                                absolutePositionedMod
                                                style={styles.chord}
                                                chord={chord}
                                            />
                                            <span
                                                style={{
                                                    whiteSpace: 'pre',
                                                }}
                                            >
                                                {lyric[0]}
                                            </span>
                                        </span>
                                        <span>{lyric.slice(1)}</span>
                                    </span>
                                );

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
    chordTail: {
        position: 'relative',
        bottom: '1rem',
    },
    lineWithChords: {
        marginTop: '1rem',
    },
};
