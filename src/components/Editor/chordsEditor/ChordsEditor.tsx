import React, { useState } from 'react';
import { PageContent } from '../../common/PageContent/PageContent';
import { PageHeader, ButtonInfo } from '@components/common/PageHeader';
import './ChordsEditor.scss';
import seventeen from './seventeen';
import { String } from './components';
import { SongPart } from './SongPart';
import { EditorContextProvider, useEditorContext } from './EditorContext';
import ListIcon from '@rsuite/icons/List';
import { Song, SongBody } from '@model/song';
import { Button } from 'rsuite';

const CLASS = 'chords-editor';

// [TEMP] пока не добавится открытие и создание новых
const song = seventeen;
// const song: Song = { title: '', author: '', songBody: [] };

const EditorContent: React.FC<{
    isStructureVisible: boolean;
    setStructureVisible: () => void;
}> = ({ isStructureVisible, setStructureVisible }) => {
    const { value, dispatch } = useEditorContext('songBody');
    const songBody = value as SongBody;

    return (
        <>
            <String size={'lg'} alt={'Добавьте название'} bold path={'title'} />
            <String alt={'Добавьте автора'} path={'author'} />
            <div className={`${CLASS}__text`}>
                {songBody.length ? (
                    songBody.map((part, index) => (
                        <SongPart
                            key={`${index}_${part.title}`}
                            isStructureVisible={isStructureVisible}
                            partsArrayPath={'songBody'}
                            partIndex={index}
                        />
                    ))
                ) : (
                    <Button
                        onClick={() => {
                            dispatch({
                                type: 'addArrayValue',
                                payload: { path: 'songBody', value: {} },
                            });
                            setStructureVisible();
                        }}
                    >
                        Добавить часть
                    </Button>
                )}
            </div>
        </>
    );
};

export const ChordsEditor: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(true);

    const buttons: ButtonInfo[] = [
        {
            title: 'Новая',
            disabled: true,
        },
        {
            title: 'Открыть',
            disabled: true,
        },
        {
            title: 'Сохранить',
            disabled: true,
        },
        {
            icon: <ListIcon />,
            active: structureVisible,
            title: 'Структура',
            onClick: () => setStructureVisible((value) => !value),
        },
    ];

    return (
        <>
            <PageHeader buttons={buttons} />
            <PageContent className={CLASS}>
                <EditorContextProvider song={song}>
                    <EditorContent
                        isStructureVisible={structureVisible}
                        setStructureVisible={() => setStructureVisible(true)}
                    />
                </EditorContextProvider>
            </PageContent>
        </>
    );
};
