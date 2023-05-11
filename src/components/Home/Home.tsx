import { PageContent } from '@common/PageContent';
import { ElementInfo, PageHeader } from '@common/PageHeader';
import { ChordsEditor } from '@components/ChordsEditor';
import {
    EditorContextProvider,
    useEditorContext,
} from '@components/EditorContext';
import { MakePdfModal } from '@components/MakePdfModal';
import { MonospacedModal } from '@components/MonospacedModal';
import ListIcon from '@rsuite/icons/List';
import TextImageIcon from '@rsuite/icons/TextImage';
import { checkSongJsonFormat } from '@utils/checkFormat';
import { getNewSong } from '@utils/getNewSong';
import { default as React, useCallback, useMemo, useState } from 'react';
import { Container, Notification, toaster } from 'rsuite';
import './Home.scss';
import { PlaceholderMenu } from './PlaceholderMenu';

const CLASS = 'home-page-content';

const HomePageContent: React.FC = () => {
    const [structureVisible, setStructureVisible] = useState(false);
    const [monospacedModalVisible, setMonospacedModalVisible] = useState(false);
    const [makePdfModalVisible, setMakePdfModalVisible] = useState(false);
    const { value, dispatch } = useEditorContext();
    const api = window.api.window;

    const hasEditedSong = !!value;

    const message = (error: any) => (
        <Notification
            type={'error'}
            header={'Ошибка'}
            duration={30000}
            closable
        >
            Ошибка при открытии файла:
            <br />
            {error.toString()}
        </Notification>
    );

    const onCreateSong = useCallback(() => {
        dispatch({
            type: 'setValue',
            payload: { value: getNewSong() },
        });

        setStructureVisible(true);
    }, [dispatch]);

    const onOpenSong = useCallback(
        () =>
            api
                .openFile()
                .then((file) => {
                    if (!file) return;

                    checkSongJsonFormat(file);

                    dispatch({
                        type: 'setValue',
                        payload: { value: file },
                    });
                })
                .catch((error) => {
                    toaster.push(message(error), {
                        placement: 'bottomEnd',
                    });
                }),
        [api, dispatch]
    );

    const buttons: ElementInfo[] = useMemo(
        () => [
            {
                title: 'Файл',
                buttons: [
                    {
                        title: 'Создать',
                        info: 'Открыть редактор новой песни',
                        onClick: onCreateSong,
                    },
                    {
                        title: 'Открыть',
                        info: 'Открыть *.json файл с сохранённой песней',
                        onClick: onOpenSong,
                    },
                    {
                        title: 'Сохранить как...',
                        info: 'Сохранить песню в *.json файл',
                        disabled: !hasEditedSong,
                        onClick: () => {
                            api.saveToNewFile(JSON.stringify(value, null, 4));
                        },
                    },
                    'Divider',
                    {
                        title: 'В моноширинную запись',
                        info: 'Вывести текущую песню в моноширинном формате',
                        disabled: !hasEditedSong,
                        onClick: () => setMonospacedModalVisible(true),
                    },
                ],
            },
            {
                title: 'Сборка в PDF',
                icon: <TextImageIcon />,
                info: 'Сохранить текущую песню или собрать песенник в формате PDF',
                onClick: () => setMakePdfModalVisible(true),
            },
            {
                icon: <ListIcon />,
                active: structureVisible,
                disabled: !hasEditedSong,
                title: 'Структура',
                info: 'Отобразить структуру (отдельные части и их типы) и элементы редактирования структуры песни',
                onClick: () => setStructureVisible((value) => !value),
            },
        ],
        [api, hasEditedSong, onCreateSong, onOpenSong, structureVisible, value]
    );

    return (
        <>
            <PageHeader elements={buttons} />
            <PageContent className={CLASS}>
                {hasEditedSong ? (
                    <ChordsEditor
                        structureVisible={structureVisible}
                        onSetStructureVisible={() => setStructureVisible(true)}
                    />
                ) : (
                    <PlaceholderMenu
                        onCreateSong={onCreateSong}
                        onMakePdf={() => setMakePdfModalVisible(true)}
                        onOpenSong={onOpenSong}
                    />
                )}
            </PageContent>
            <MonospacedModal
                open={monospacedModalVisible}
                onClose={() => setMonospacedModalVisible(false)}
            />
            {makePdfModalVisible && (
                <MakePdfModal
                    open={makePdfModalVisible}
                    onClose={() => setMakePdfModalVisible(false)}
                />
            )}
        </>
    );
};

export const Home: React.FC = () => {
    return (
        <Container>
            <EditorContextProvider song={undefined}>
                <HomePageContent />
            </EditorContextProvider>
        </Container>
    );
};

