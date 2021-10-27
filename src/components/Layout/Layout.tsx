import { EditorPage } from '../Editor';
import React from 'react';
import { Container, Content, Nav, Sidebar, Sidenav } from 'rsuite';
import { Header } from './Header';
import cn from 'classnames';
import './Layout.scss';

export const Layout: React.FC = () => {
    return (
        <Container>
            <Header />
            <Container className={'no-drag'}>
                <Sidebar>
                    <Sidenav>
                        <Sidenav.Body>
                            <Nav>
                                <Nav.Item>Main</Nav.Item>
                            </Nav>
                        </Sidenav.Body>
                    </Sidenav>
                </Sidebar>
                <Content>
                    <EditorPage />
                </Content>
            </Container>
        </Container>
    );
};
