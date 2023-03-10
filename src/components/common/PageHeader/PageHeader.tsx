import React from 'react';
import { Header } from 'rsuite';
import { HeaderElement } from './HeaderElement';
import './PageHeader.scss';
import { ElementInfo } from './types';

const CLASS = 'header';

export interface PageHeaderProps {
    elements: ElementInfo[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ elements }) => {
    return (
        <Header className={CLASS}>
            <div className={`${CLASS}_content`}>
                {elements.map((element, index) => (
                    <HeaderElement
                        element={element}
                        key={`${index}.${element.title}`}
                    />
                ))}
            </div>
        </Header>
    );
};

