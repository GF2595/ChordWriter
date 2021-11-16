import React from 'react';
import { Button, Header, IconButton, IconButtonProps } from 'rsuite';
import './PageHeader.scss';

const CLASS = 'header';

export interface ButtonInfo {
    title?: string;
    icon?: IconButtonProps['icon'];
    onClick?: () => void;
    disabled?: boolean;
}

export interface PageHeaderProps {
    buttons: ButtonInfo[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ buttons }) => {
    return (
        <Header className={`${CLASS}_container`}>
            <div className={`${CLASS}_content`}>
                {buttons.map((button, index) => {
                    const { icon, onClick, disabled, title } = button;

                    return icon ? (
                        // TODO: key index
                        <IconButton
                            className={`${CLASS}__button`}
                            key={`btn_${index}`}
                            size={'xs'}
                            icon={icon}
                            onClick={onClick}
                            disabled={disabled}
                        >
                            {title}
                        </IconButton>
                    ) : (
                        // TODO: key index
                        <Button
                            className={`${CLASS}__button`}
                            key={`btn_${index}`}
                            size={'xs'}
                            onClick={onClick}
                            disabled={disabled}
                        >
                            {title}
                        </Button>
                    );
                })}
            </div>
        </Header>
    );
};
