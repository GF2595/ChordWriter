import React from 'react';
import { Button, Header, IconButton, IconButtonProps } from 'rsuite';
import './PageHeader.scss';

const CLASS = 'header';

export interface ButtonInfo {
    title?: string;
    icon?: IconButtonProps['icon'];
    onClick?: () => void;
}

export interface PageHeaderProps {
    buttons: ButtonInfo[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ buttons }) => {
    return (
        <Header className={`${CLASS}_container`}>
            <div className={`${CLASS}_content`}>
                {buttons.map((button, index) => {
                    if (button.icon)
                        return (
                            <IconButton
                                key={`btn_${index}`}
                                size={'xs'}
                                icon={button.icon}
                                onClick={button.onClick}
                            >
                                {button.title}
                            </IconButton>
                        );
                    else
                        return (
                            <Button
                                key={`btn_${index}`}
                                size={'xs'}
                                onClick={button.onClick}
                            >
                                {button.title}
                            </Button>
                        );
                })}
            </div>
        </Header>
    );
};
