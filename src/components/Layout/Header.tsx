import CloseIcon from '@rsuite/icons/Close';
import CopyIcon from '@rsuite/icons/Copy';
import MinusIcon from '@rsuite/icons/Minus';
import React from 'react';
import { Header as RSuiteHeader, Nav, Navbar } from 'rsuite';
import './Layout.scss';

export const Header: React.FC = () => {
    const api = window.api.window;

    return (
        <RSuiteHeader className={'drag'}>
            <Navbar style={{ backgroundColor: '#ffbe30' }}>
                <Navbar.Brand>ChordWriter</Navbar.Brand>
                <Nav className={'no-drag'} pullRight>
                    <Nav.Item
                        icon={<MinusIcon />}
                        onClick={() => api.minimize()}
                    />
                    <Nav.Item
                        icon={<CopyIcon />}
                        onClick={() => api.maximize()}
                    />
                    <Nav.Item
                        icon={<CloseIcon />}
                        onClick={() => api.close()}
                    />
                </Nav>
            </Navbar>
        </RSuiteHeader>
    );
};
