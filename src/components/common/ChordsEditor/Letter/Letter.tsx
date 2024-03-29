import React, { useRef } from 'react';
import { Tooltip, Whisper } from 'rsuite';
import { ChordEditPopup } from '@common/ChordsEditor/ChordEditPopup';
import cn from 'classnames';
import { ChordType } from '@model/song';
import './Letter.scss';

const CLASS = 'letter';

export interface LetterProps {
    letter: string | null;
    hasChord: boolean;
    onAddChord: (chord: ChordType) => void;
}

export const Letter: React.FC<LetterProps> = ({
    letter,
    hasChord,
    onAddChord,
}) => {
    const triggerRef = useRef();
    const isWhitespace = letter !== null && letter.trim() === '';
    const isEmpty = letter === null;

    return (
        <Whisper
            ref={triggerRef}
            placement={'top'}
            trigger={'click'}
            speaker={
                hasChord ? (
                    <Tooltip className={`${CLASS}__popover`}>
                        Чтобы добавить сюда новый аккорд, удалите существующий
                    </Tooltip>
                ) : (
                    <ChordEditPopup
                        onSubmit={(chord) => {
                            onAddChord(chord);
                            // тут странная ошибка, которая не убирается ни ?, ни !
                            // @ts-ignore
                            triggerRef.current.close();
                        }}
                    />
                )
            }
        >
            <span
                className={cn(
                    CLASS,
                    {
                        [`${CLASS}-clickable`]:
                            !hasChord && !(isWhitespace || isEmpty),
                    },
                    {
                        [`${CLASS}-whitespace_clickable`]:
                            isWhitespace || isEmpty,
                    },
                    { [`${CLASS}-empty`]: isEmpty }
                )}
            >
                {letter === null ? '  ' : letter}
            </span>
        </Whisper>
    );
};

