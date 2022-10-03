import React, { useRef } from 'react';
import { Tooltip, Whisper } from 'rsuite';
import { ChordEditPopup } from '../ChordEditPopup';
import cn from 'classnames';
import { ChordType } from '@model/song';
import './Letter.scss';

const CLASS = 'letter';

export interface LetterProps {
    letter: string;
    hasChord: boolean;
    onAddChord: (chord: ChordType) => void;
}

export const Letter: React.FC<LetterProps> = ({
    letter,
    hasChord,
    onAddChord,
}) => {
    const triggerRef = useRef();
    const isWhitespace = letter.trim() === '';

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
                    { [`${CLASS}-clickable`]: !hasChord && !isWhitespace },
                    { [`${CLASS}-whitespace_clickable`]: isWhitespace }
                )}
            >
                {letter}
            </span>
        </Whisper>
    );
};
