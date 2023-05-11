import { EditableHeader } from '@common/ChordsEditor';
import { useEditorContext } from '@components/EditorContext';
import { LyricsPartType, SongBody } from '@model/song';
import React from 'react';
import { Button } from 'rsuite';
import './ChordsEditor.scss';
import { SongPart } from './SongPart';

const CLASS = 'chords-editor';

export interface ChordsEditorProps {
    structureVisible: boolean;
    onSetStructureVisible: () => void;
}

export const ChordsEditor: React.FC<ChordsEditorProps> = ({
    structureVisible,
    onSetStructureVisible,
}) => {
    // TODO: поправить dispatch
    const { value: songBody, untypedDispatch: dispatch } =
        useEditorContext<SongBody>('songBody');

    return (
        <>
            <EditableHeader
                size={'lg'}
                alt={'Добавьте название'}
                bold
                path={'title'}
            />
            <EditableHeader alt={'Добавьте автора'} path={'author'} />
            <div className={`${CLASS}__text`}>
                {songBody.length ? (
                    songBody.map((part, index) => (
                        <SongPart
                            key={`${index}_${part.title}`}
                            isStructureVisible={structureVisible}
                            partsArrayPath={'songBody'}
                            partIndex={index}
                            onSplitPart={(partIndex, lineIndex) => {
                                const oldPart = songBody[
                                    partIndex
                                ] as LyricsPartType;

                                if (!oldPart || !oldPart.lines?.[lineIndex])
                                    return;

                                dispatch({
                                    type: 'setValue',
                                    payload: {
                                        path: 'songBody',
                                        value: [
                                            ...songBody.slice(0, partIndex),
                                            {
                                                ...oldPart,
                                                lines: oldPart.lines.slice(
                                                    0,
                                                    lineIndex
                                                ),
                                            },
                                            {
                                                lines: oldPart.lines.slice(
                                                    lineIndex
                                                ),
                                            },
                                            ...songBody.slice(partIndex + 1),
                                        ],
                                    },
                                });
                            }}
                        />
                    ))
                ) : (
                    <Button
                        onClick={() => {
                            dispatch({
                                type: 'addArrayValue',
                                payload: {
                                    path: 'songBody',
                                    value: { lines: [] },
                                },
                            });
                            onSetStructureVisible();
                        }}
                    >
                        Добавить часть
                    </Button>
                )}
            </div>
        </>
    );
};

