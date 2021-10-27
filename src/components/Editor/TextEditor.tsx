import React from 'react';
import { Input } from 'rsuite';
import './TextEditor.scss';
import { PageHeader, ButtonInfo } from '../common/PageHeader';
import { PageContent } from '../common/PageContent/PageContent';

const CLASS = 'text-editor';

export interface TextEditorProps {
    onFinishEditing: () => void;
    text: string;
    onChangeText: (value: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    onFinishEditing,
    text,
    onChangeText,
}) => {
    const setText = (text: string | number | readonly string[]) => {
        onChangeText(text as string);
    };

    const buttons: ButtonInfo[] = [
        {
            title: 'Сохранить',
            onClick: onFinishEditing,
        },
    ];

    return (
        <>
            <PageHeader buttons={buttons} />
            <PageContent className={`${CLASS}__content`}>
                <Input
                    style={{ height: '100%', resize: 'none' }}
                    as="textarea"
                    value={text}
                    onChange={(value) => {
                        setText(value);
                    }}
                />
            </PageContent>
        </>
    );
};
