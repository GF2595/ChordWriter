import React, { useState } from 'react';
import { Container } from 'rsuite';
import { ChordsEditor } from './chordsEditor/ChordsEditor';
import './EditorPage.scss';

export const EditorPage: React.FC = () => {
    return (
        <Container>
            <ChordsEditor />
        </Container>
    );
};
