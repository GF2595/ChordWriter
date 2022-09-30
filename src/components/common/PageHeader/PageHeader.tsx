import React from 'react';
import {
    Button,
    ButtonProps,
    Header,
    IconButton,
    IconButtonProps,
} from 'rsuite';
import './PageHeader.scss';

const CLASS = 'header';

export interface ButtonInfo
    extends Pick<
            IconButtonProps | ButtonProps,
            'onClick' | 'active' | 'disabled'
        >,
        Pick<IconButtonProps, 'icon'> {
    title?: string;
}

export interface PageHeaderProps {
    buttons: ButtonInfo[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ buttons }) => {
    return (
        <Header className={CLASS}>
            <div className={`${CLASS}_content`}>
                {buttons.map((button, index) => {
                    const { icon, title } = button;

                    return icon ? (
                        // TODO: key index
                        <IconButton
                            className={`${CLASS}__button`}
                            key={`btn_${index}`}
                            size={'xs'}
                            {...button}
                        >
                            {title}
                        </IconButton>
                    ) : (
                        // TODO: key index
                        <Button
                            className={`${CLASS}__button`}
                            key={`btn_${index}`}
                            size={'xs'}
                            {...button}
                        >
                            {title}
                        </Button>
                    );
                })}
            </div>
        </Header>
    );
};
