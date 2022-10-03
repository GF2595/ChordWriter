import { EditorPage } from '../Editor';
import React from 'react';
import { Container, Content } from 'rsuite';
import { Header } from './Header';
import './Layout.scss';

export const Layout: React.FC = () => {
    return (
        <Container>
            <Header />
            <Container className={'no-drag'}>
                <Content>
                    <EditorPage />
                </Content>
            </Container>
        </Container>
    );
};
