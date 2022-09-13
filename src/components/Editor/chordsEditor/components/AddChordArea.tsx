import React from 'react';
import { Letter, LetterProps } from './Letter';

export interface AddChordAreaProps extends Pick<LetterProps, 'onAddChord'> {
    shortArea?: boolean;
}

export const AddChordArea: React.FC<AddChordAreaProps> = ({
    shortArea = false,
    ...props
}) => <Letter hasChord={false} letter={shortArea ? ' ' : '   '} {...props} />;
