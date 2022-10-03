import React from 'react';
import { useEditorContext } from '../EditorContext';
import { InstrumentalPartType } from '@model/song';
import { ChordsLine } from './ChordsLine';

export interface InstrumentalPartProps {
    path: string;
}

export const InstrumentalPart: React.FC<InstrumentalPartProps> = ({ path }) => {
    const { value: part } = useEditorContext(path);

    const { chords, tabs } = part as InstrumentalPartType;

    return (
        <div>
            {chords
                ? chords.map((line, index) => (
                      <ChordsLine
                          key={`${index}__${line[0]}-${line[1]}`}
                          lineArrayPath={`${path}.chords`}
                          lineIndex={index}
                      />
                  ))
                : tabs}
        </div>
    );
};
